# **ChatGPT Export Viewer**

**A beautiful, private, and feature-rich way to view and search your ChatGPT data export.**  
This is a single, self-contained HTML file that runs entirely in your browser. It processes the export.zip file from ChatGPT, allowing you to browse, search, and export your conversations in a polished, modern interface without your data ever leaving your computer.

## **✨ Key Features**

* **Glass UI:** A stunning "Liquid Glass" (Glassmorphism) interface inspired by modern design trends, available in both light and dark themes.  
* **Full ZIP Processing:** No need to unzip files manually. Just upload your entire export.zip file, and the app handles the rest.  
* **View Uploaded Images:** Images you've uploaded in your chats are extracted from the zip and displayed inline.  
* **Blazing Fast Performance:**  
  * **Background Processing:** A Web Worker processes the zip file without freezing the UI, perfect for huge exports.  
  * **Lazy Loading:** Messages are loaded on-demand as you scroll, making even the longest conversations feel instant.  
* **Powerful Search:**  
  * **Universal Search:** Quickly find keywords across all your conversations.  
  * **In-Chat Search:** Filter messages within a single conversation, with non-matches dimmed for clarity.  
* **Conversation Stats:** See the total message count and the date range for each conversation at a glance.  
* **Export to JSON:** Convert your loaded chat history into a clean, structured JSON file with a single click.  
* **100% Private:** All processing happens locally in your browser. Your data is never uploaded to any server.

## **🚀 How to Use**

There are two simple ways to use the viewer:

1. **Live Demo (Recommended):**  
   * Visit the hosted version here: \[Link to your GitHub Pages URL\]  
2. **Local Download:**  
   * Download the latest chat-viewer.html file from the \[Releases\](\[Link to your GitHub Releases\]) page.  
   * Open the downloaded file in any modern web browser.

Once the page is loaded, simply click the upload icon and select the export.zip file you downloaded from ChatGPT.

## **🛠️ How It Works**

The entire application is a single chat-viewer.html file that leverages modern web technologies to provide a seamless experience without a backend.

* **Client-Side Processing:** All logic is handled by your browser's JavaScript engine.  
* **Web Worker:** The heavy task of unzipping and parsing the export file is offloaded to a background thread to keep the UI from freezing.  
* **Key Libraries:**  
  * **JSZip:** For reading .zip files in JavaScript.  
  * **Marked.js:** For rendering Markdown in chat messages.  
  * **Highlight.js:** For beautiful syntax highlighting in code blocks.  
  * **Tailwind CSS:** For the modern and responsive user interface.

## **🔒 Privacy**

**Your privacy is paramount.** This tool is designed to be completely secure. Since it's a static HTML file that runs locally in your browser, your conversations and personal data are never sent over the internet or stored on any server.

## **🌐 Host Your Own**

You can easily host your own version of this viewer for free on GitHub Pages:

1. **Fork this repository.**  
2. Go to your forked repository's **Settings** tab.  
3. Navigate to the **Pages** section in the left sidebar.  
4. Under "Source," select Deploy from a branch.  
5. Choose the main branch and the /(root) folder, then click **Save**.  
6. Your site will be live at https://\<your-username\>.github.io/\<repository-name\>/chat-viewer.html in a few minutes.

## **📄 License**

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).