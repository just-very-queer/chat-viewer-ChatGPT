import React from 'react';
import ConversationList from './ConversationList';

const Sidebar = () => {
  const sidebarStyle = {
    width: '320px',
    flexShrink: 0,
    borderRight: '1px solid #ccc',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  };

  const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid #ccc',
    margin: 0,
  };

  return (
    <aside style={sidebarStyle}>
      <header>
        <h1 style={headerStyle}>UCA</h1>
      </header>
      <ConversationList />
    </aside>
  );
};

export default Sidebar;
