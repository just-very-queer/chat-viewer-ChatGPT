import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import FileDropzone from './components/FileDropzone';
import { ActiveConversationProvider } from './context/ActiveConversationContext';
import './App.css';

function App() {
  const conversations = useLiveQuery(() => db.conversations.toArray());

  if (!conversations || conversations.length === 0) {
    return <FileDropzone />;
  }

  return (
    <ActiveConversationProvider>
      <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <ChatView />
      </div>
    </ActiveConversationProvider>
  );
}

export default App;
