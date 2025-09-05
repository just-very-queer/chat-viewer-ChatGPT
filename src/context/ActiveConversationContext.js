import React, { createContext, useState, useContext } from 'react';

const ActiveConversationContext = createContext();

export const ActiveConversationProvider = ({ children }) => {
  const [activeConversationId, setActiveConversationId] = useState(null);

  return (
    <ActiveConversationContext.Provider value={{ activeConversationId, setActiveConversationId }}>
      {children}
    </ActiveConversationContext.Provider>
  );
};

export const useActiveConversation = () => {
  return useContext(ActiveConversationContext);
};
