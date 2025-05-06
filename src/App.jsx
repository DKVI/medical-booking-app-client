import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "./layouts/AuthenLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ClientLayout from "./layouts/ClientLayout";
import Booking from "./pages/Booking";
import Checkout from "./pages/Checkout";
import Doctor from "./pages/Doctor";
import History from "./pages/History";
import BookingType from "./pages/BookingType";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";

function AppRoutes() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check login status

  return useRoutes([
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
      path: "/account",
      element: <AuthLayout />,
      children: [{ path: "", element: <Login /> }],
    },
    {
      path: "/dashboard",
      element: <ClientLayout />,
      children: [{ path: "", element: <Dashboard /> }],
    },
    {
      path: "/booking",
      element: <ClientLayout />,
      children: [{ path: "", element: <Booking /> }],
    },
    {
      path: "/checkout",
      element: <ClientLayout />,
      children: [{ path: "", element: <Checkout /> }],
    },
    {
      path: "/doctor",
      element: <ClientLayout />,
      children: [{ path: "", element: <Doctor /> }],
    },
    {
      path: "/history",
      element: <ClientLayout />,
      children: [{ path: "", element: <History /> }],
    },
    {
      path: "/booking-type",
      element: <ClientLayout />,
      children: [{ path: "", element: <BookingType /> }],
    },
    {
      path: "/profile",
      element: <ClientLayout />,
      children: [{ path: "", element: <Profile /> }],
    },
    {
      path: "/setting",
      element: <ClientLayout />,
      children: [{ path: "", element: <Setting /> }],
    },
    { path: "*", element: <NotFound /> },
  ]);
}

export default AppRoutes;
