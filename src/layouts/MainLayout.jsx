import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Header />
      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          boxSizing: "border-box",
          backgroundColor: "#f4f6f8",
        }}
      >
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
