import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
const useAuthToken = () => {
  const [decodedToken, setDecodedToken] = useState(undefined);
useEffect(() => {
  const tokenStr = localStorage.getItem("token");
  if (tokenStr) {
    try {
      const decoded = jwtDecode(tokenStr);
      setDecodedToken(decoded);
    } catch (error) {
      console.error("Invalid token:", error);
      setDecodedToken(null);
    }
  } else {
    setDecodedToken(null);
  }
}, []);

  return decodedToken;
};

export default useAuthToken;
