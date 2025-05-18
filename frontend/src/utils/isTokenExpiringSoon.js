import { jwtDecode } from "jwt-decode";

export const isTokenExpiringSoon = (token, bufferSeconds = 30) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;

    const expiryTime = decoded.exp * 1000; // JWT exp in seconds → ms
    const currentTime = Date.now();

    return expiryTime - currentTime <= bufferSeconds * 1000;
  } catch {
    return true; // Treat errors as expired/soon-expiring
  }
};
