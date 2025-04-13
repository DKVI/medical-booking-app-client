import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "./layouts/AuthenLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

function AppRoutes() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check login status

  return useRoutes([
    // Default route ("/")
    {
      path: "/",
      element: <Navigate to="/home" />,
    },
    // Home route
    {
      path: "/home",
      element: <MainLayout />,
      children: [{ path: "", element: <Home /> }],
    },
    // Login route
    {
      path: "/login",
      element: <AuthLayout />,
      children: [{ path: "", element: <Login /> }],
    },
    // 404 route
    { path: "*", element: <NotFound /> },
  ]);
}

export default AppRoutes;
