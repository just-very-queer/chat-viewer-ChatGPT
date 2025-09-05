import { parseChatGPT } from '../parsers/chatGptParser.js';

self.onmessage = async (e) => {
  const { type, file, platform } = e.data;

  if (type === 'IMPORT_FILE') {
    try {
      if (platform === 'chatgpt') {
        await parseChatGPT(file, self.postMessage);
      } else if (platform === 'whatsapp') {
        self.postMessage({ type: 'error', message: 'WhatsApp parser not implemented yet.' });
      } else if (platform === 'ucajson') {
        self.postMessage({ type: 'error', message: 'UCA JSON parser not implemented yet.' });
      } else {
        throw new Error(`Unknown platform: ${platform}`);
      }
      self.postMessage({ type: 'done', message: 'Import complete!' });
    } catch (error) {
      console.error('Import Worker Error:', error);
      self.postMessage({ type: 'error', message: `Error during import: ${error.message}` });
    }
  }
};
