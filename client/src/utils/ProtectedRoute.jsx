// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import axios from "../utils/axios";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    axios
      .get("/auth/verify")
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
