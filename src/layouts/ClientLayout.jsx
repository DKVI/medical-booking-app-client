import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

function ClientLayout() {
  return (
    <>
      <Header />
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
      <SideBar />
    </>
  );
}

export default ClientLayout;
