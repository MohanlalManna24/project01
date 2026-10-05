import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    api
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.message || "Could not load user details."
        );
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      {user ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold">Welcome, {user.username}</h1>
          <p className="text-slate-600">Email: {user.email}</p>
        </div>
      ) : (
        !errorMessage && <p className="text-slate-500">Loading user details...</p>
      )}
    </div>
  );
};

export default Home;
