import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import HeaderDoctor from "../components/HeaderDoctor";
import SideBarDoctor from "../components/SideBarDoctor";

function DoctorLayout() {
  return (
    <>
      <HeaderDoctor />
      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          boxSizing: "border-box",
          overflowX: "hidden",
          backgroundColor: "#f4f6f8",
        }}
      >
        <Outlet />
      </main>
      <SideBarDoctor />
    </>
  );
}

export default DoctorLayout;
