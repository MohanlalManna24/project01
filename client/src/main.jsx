import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import ForgetPassword from "./components/ForgetPassword.jsx";
import EmailVarify from "./components/EmailVarify.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/email-varify",
        element: <EmailVarify />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
