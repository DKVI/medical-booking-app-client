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
import MedicalNote from "./pages/MedicalNote";
import DetailNote from "./pages/DetailNote";
import DoctorDetail from "./pages/DoctorDetail";
import LoginDoctor from "./pages/LoginDoctor";
import DoctorLayout from "./layouts/DoctorLayout";
import DashboardDoctor from "./pages/DashboardDoctor";
import Appointments from "./pages/Appointments";
import DetailAppointment from "./pages/DetailAppointment";

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
    {
      path: "/medical-note",
      element: <ClientLayout />,
      children: [{ path: "", element: <MedicalNote /> }],
    },
    {
      path: "/detail-note",
      element: <ClientLayout />,
      children: [{ path: "", element: <DetailNote /> }],
    },
    {
      path: "/doctor-detail",
      element: <ClientLayout />,
      children: [{ path: "", element: <DoctorDetail /> }],
    },
    {
      path: "/for-doctor/login",
      element: <AuthLayout />,
      children: [{ path: "", element: <LoginDoctor /> }],
    },
    {
      path: "/for-doctor/dashboard",
      element: <DoctorLayout />,
      children: [{ path: "", element: <DashboardDoctor /> }],
    },
    {
      path: "/for-doctor/appointment",
      element: <DoctorLayout />,
      children: [{ path: "", element: <Appointments /> }],
    },
    {
      path: "/for-doctor/appointment/detail",
      element: <DoctorLayout />,
      children: [{ path: "", element: <DetailAppointment /> }],
    },
    { path: "*", element: <NotFound /> },
  ]);
}

export default AppRoutes;
