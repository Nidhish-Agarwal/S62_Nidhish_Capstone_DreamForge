import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

// Have made this because we would need to import all these things in various pages so this function reduces the import to only one making the code look clean

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
