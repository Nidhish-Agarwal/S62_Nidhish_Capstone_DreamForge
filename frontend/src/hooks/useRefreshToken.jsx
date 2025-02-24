import axios from "../api/axios.js";
import useAuth from "./useAuth";

// Making a hook to get a new accessToken and storing it in the AuthContext

function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    setAuth((prev) => {
      return {
        ...prev,
        userId: response.data.userId,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      };
    });

    return response.data.accessToken;
  };

  return refresh;
}

export default useRefreshToken;
