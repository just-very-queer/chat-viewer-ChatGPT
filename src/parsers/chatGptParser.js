import { db } from '../db';
import JSZip from 'jszip';

/**
 * The ChatGPT export stores conversations as a tree. This function traverses the tree
 * from the most recent message back to the root to get a flat array of messages
 * in chronological order.
 */
const flattenMessages = (mapping) => {
    if (!mapping || Object.keys(mapping).length === 0) return [];

    let leafNodeId = null;
    let maxCreateTime = 0;

    // Find the leaf node (the last message in the main conversation thread)
    for (const id in mapping) {
        const node = mapping[id];
        if (node.message && node.message.create_time && node.message.create_time > maxCreateTime) {
            const children = node.children;
            // A leaf node in the main thread might have children that are alternate replies
            // but we look for the node that is not a parent to any other node in the main flow.
            // A simple heuristic is to find the message with the latest timestamp.
            maxCreateTime = node.message.create_time;
            leafNodeId = id;
        }
    }

    if (!leafNodeId) return [];

    const reversedMessages = [];
    let currentId = leafNodeId;
    while (currentId) {
        const node = mapping[currentId];
        if (node && node.message) {
            reversedMessages.push(node.message);
        }
        currentId = node ? node.parent : null;
    }
    return reversedMessages.reverse();
};


/**
 * Extracts the main JSON data array from the chat.html file.
 * The JSON is embedded in a <script> tag, so we need to parse it out carefully.
 */
const extractJsonData = (htmlContent) => {
    const jsonVarStart = 'var jsonData = ';
    const startIndex = htmlContent.indexOf(jsonVarStart);
    if (startIndex === -1) throw new Error("Could not find conversation data variable in chat.html.");

    const scriptContent = htmlContent.substring(startIndex + jsonVarStart.length);
    let bracketCount = 0;
    let inString = false;
    let jsonEndIndex = -1;
    let firstBracketFound = false;

    for (let i = 0; i < scriptContent.length; i++) {
        const char = scriptContent[i];
        if (char === '"' && (i === 0 || scriptContent[i - 1] !== '\\')) {
            inString = !inString;
        }
        if (!inString) {
            if (char === '[') {
                if (!firstBracketFound) firstBracketFound = true;
                bracketCount++;
            } else if (char === ']') {
                bracketCount--;
            }
        }
        if (firstBracketFound && bracketCount === 0) {
            jsonEndIndex = i;
            break;
        }
    }

    if (jsonEndIndex === -1) throw new Error("Could not parse conversation data array from chat.html.");

    const jsonString = scriptContent.substring(0, jsonEndIndex + 1).trim();
    return JSON.parse(jsonString);
};


export const parseChatGPT = async (file, postMessage) => {
    postMessage({ type: 'progress', message: 'Unzipping archive...' });
    const zip = await JSZip.loadAsync(file);

    const chatHtmlFile = zip.file('chat.html');
    if (!chatHtmlFile) throw new Error("The zip file does not contain 'chat.html'.");

    postMessage({ type: 'progress', message: 'Processing images...' });
    const imageFolder = zip.folder("images");
    if (imageFolder) {
        const mediaPromises = [];
        imageFolder.forEach((relativePath, file) => {
            if (!file.dir) {
                const promise = file.async('blob').then(blob => {
                    const mediaId = `images/${relativePath}`;
                    return { id: mediaId, blob };
                });
                mediaPromises.push(promise);
            }
        });
        const mediaItems = await Promise.all(mediaPromises);
        if (mediaItems.length > 0) {
            await db.media.bulkPut(mediaItems);
        }
    }

    postMessage({ type: 'progress', message: 'Parsing conversations...' });
    const htmlContent = await chatHtmlFile.async('string');
    const conversationsData = extractJsonData(htmlContent);

    if (!conversationsData || conversationsData.length === 0) {
        throw new Error('No conversations found in the extracted data.');
    }

    postMessage({ type: 'progress', message: `Found ${conversationsData.length} conversations. Storing...` });

    for (const convo of conversationsData) {
        if (!convo.title) continue;

        const conversationId = await db.conversations.add({
            platform: 'chatgpt',
            title: convo.title,
            create_time: convo.create_time,
            update_time: convo.update_time,
        });

        const messages = flattenMessages(convo.mapping)
            .filter(msg => msg && msg.author.role !== 'system' && (msg.content?.parts || msg.content?.text))
            .map(msg => {
                const contentParts = [];
                const parts = msg.content.parts || (msg.content.text ? [msg.content.text] : []);

                parts.forEach(part => {
                    if (typeof part === 'string' && part.trim()) {
                        contentParts.push({ type: 'text', value: part });
                    } else if (typeof part === 'object' && part) {
                         if (part.asset_pointer && part.content_type === 'image_asset_pointer') {
                            let imagePath = part.file_path;
                            if (imagePath && !imagePath.startsWith('images/')) {
                                imagePath = `images/${imagePath}`;
                            }
                            contentParts.push({ type: 'image', mediaId: imagePath });
                        } else if (part.text && part.text.trim()) {
                            contentParts.push({ type: 'text', value: part.text });
                        }
                    }
                });

                return {
                    id: msg.id,
                    conversationId,
                    timestamp: msg.create_time,
                    author: msg.author.role,
                    content: contentParts,
                    metadata: {
                        end_turn: msg.end_turn,
                        weight: msg.weight,
                        metadata: msg.metadata,
                    }
                };
            })
            .filter(msg => msg.content.length > 0); // Don't save messages with no processable content

        if (messages.length > 0) {
            await db.messages.bulkAdd(messages);
        }
    }
};
