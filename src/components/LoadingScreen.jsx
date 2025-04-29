import { CircularProgress } from "@mui/material";
import React from "react";

export default function LoadingScreen() {
  return (
    <div
      className="w-[100vw] h-[100vh] flex"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "fixed",
        zIndex: 1000,
      }}
    >
      <CircularProgress className="m-auto" />
    </div>
  );
}
