import { createContext, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

// Have made a context to provide login details to all the pages instead of prop drilling

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(() => {
    const storedPersist = localStorage.getItem("persist");
    return storedPersist !== null ? JSON.parse(storedPersist) : false;
  });

  // Set or clear Sentry user when auth.userId changes
  useEffect(() => {
    if (auth?.userId) {
      Sentry.setUser({ id: auth.userId });
    } else {
      Sentry.setUser(null); // Clear user on logout or initial load
    }
  }, [auth?.userId]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
