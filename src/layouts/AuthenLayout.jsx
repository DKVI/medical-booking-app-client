import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

function AuthenLayout() {
  useEffect(() => {
    localStorage.clear();
  });
  return (
    <div style={{ textAlign: "center" }}>
      <Outlet />
    </div>
  );
}

export default AuthenLayout;
