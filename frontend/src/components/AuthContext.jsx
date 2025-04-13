import React, { createContext, useState } from 'react';

// Creiamo un contesto specifico per la comunicazione tra i dropdown
export const DropdownContext = createContext();

export const DropdownProvider = ({ children }) => {
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{
      loginDropdownOpen,
      setLoginDropdownOpen,
      registerDropdownOpen,
      setRegisterDropdownOpen
    }}>
      {children}
    </DropdownContext.Provider>
  );
};
