import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios.get("/user/logout", {
        withCredentials: true,
      });
    } catch (er) {
      console.log(er);
    }
  };

  return logout;
};

export default useLogout;
