import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "./layouts/AuthenLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
function AppRoutes() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Kiểm tra trạng thái đăng nhập

  return useRoutes([
    // Route mặc định ("/")
    {
      path: "/",
      element: <Navigate to={"/home"} />,
    },
    // Routes yêu cầu đăng nhập
    {
      path: "/login",
      element: <AuthLayout />,
      children: [{ path: "", element: <Login /> }],
    },
    // Route 404
    { path: "*", element: <NotFound /> },
  ]);
}

export default AppRoutes;
