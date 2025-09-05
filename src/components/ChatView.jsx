import React, { useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useActiveConversation } from '../context/ActiveConversationContext';

const ChatView = () => {
  const { activeConversationId } = useActiveConversation();
  const messagesEndRef = useRef(null);

  const messages = useLiveQuery(
    () => {
      if (!activeConversationId) return [];
      return db.messages.where('conversationId').equals(activeConversationId).sortBy('timestamp');
    },
    [activeConversationId] // Rerun the query when the active conversation ID changes
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const containerStyle = {
    flexGrow: 1,
    padding: '20px',
    overflowY: 'auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const messageStyle = (author) => ({
    padding: '8px 12px',
    borderRadius: '18px',
    marginBottom: '10px',
    maxWidth: '75%',
    alignSelf: author === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: author === 'user' ? '#0084ff' : '#e4e6eb',
    color: author === 'user' ? 'white' : 'black',
    border: '1px solid #eee',
    wordWrap: 'break-word',
  });

  const authorStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '0.9em',
  };

  if (!activeConversationId) {
    return <main style={containerStyle}><div style={{margin: 'auto', textAlign: 'center'}}>Select a conversation to view messages.</div></main>;
  }

  if (!messages) {
    return <main style={containerStyle}><div style={{margin: 'auto', textAlign: 'center'}}>Loading messages...</div></main>;
  }

  const renderContent = (content) => {
    return content.map((part, index) => {
      if (part.type === 'text') {
        // Using pre-wrap to respect newlines and formatting from ChatGPT
        return <p key={index} style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{part.value}</p>;
      }
      if (part.type === 'image') {
        // TODO: Implement image rendering from blob stored in db.media
        return <em key={index} style={{display: 'block', margin: '5px 0'}}>[Image: {part.mediaId}]</em>;
      }
      return null;
    });
  };

  return (
    <main style={containerStyle}>
      <div style={{ flexGrow: 1 }}>
        {messages.map(msg => (
          <div key={msg.id} style={messageStyle(msg.author)}>
            <div style={authorStyle}>{msg.author}</div>
            <div>
              {renderContent(msg.content)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default ChatView;
