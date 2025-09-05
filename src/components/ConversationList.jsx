import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useActiveConversation } from '../context/ActiveConversationContext';

const ConversationList = () => {
  const conversations = useLiveQuery(() => db.conversations.orderBy('create_time').reverse().toArray());
  const { activeConversationId, setActiveConversationId } = useActiveConversation();

  if (!conversations) {
    return <div>Loading conversations...</div>;
  }

  const convoStyle = (id) => ({
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    backgroundColor: id === activeConversationId ? 'royalblue' : 'transparent',
    color: id === activeConversationId ? 'white' : 'black',
    fontWeight: id === activeConversationId ? 'bold' : 'normal',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  return (
    <nav style={{ overflowY: 'auto' }}>
      {conversations.map(convo => (
        <div
          key={convo.id}
          style={convoStyle(convo.id)}
          onClick={() => setActiveConversationId(convo.id)}
          title={convo.title}
        >
          {convo.title}
        </div>
      ))}
    </nav>
  );
};

export default ConversationList;
