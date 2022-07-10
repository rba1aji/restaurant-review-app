import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    variant: 'danger',
    msg: 'Enter a strong password',
  });
  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        alert,
        setAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const AppState = () => {
  return useContext(AppContext);
};