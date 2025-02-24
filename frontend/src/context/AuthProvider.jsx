import { createContext, useState } from "react";

// Have made a context to provide login details to all the pages instead of prop drilling

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(() => {
    const storedPersist = localStorage.getItem("persist");
    return storedPersist !== null ? JSON.parse(storedPersist) : false;
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
