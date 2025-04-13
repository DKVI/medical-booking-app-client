import React from "react";
import "../app.css";

export default function Header() {
  return (
    <div
      className="flex glass-morphism w-full h-[80px] lg:fixed absolute py-2 px-2 lg:py-3 lg:px-10"
      style={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        color: "#fff",
        justifyContent: "space-between",
      }}
    >
      <div className="h-full">
        <img
          src="/icon.png"
          className="h-full"
          style={{
            filter: "drop-shadow(0px 4px 6px white)",
          }}
        />
      </div>
      <div className="text-[var(--base-color)]">
        <a
          href="/login"
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
          }}
        >
          Login
        </a>{" "}
        |{" "}
        <a
          href="/sign-up"
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
          }}
        >
          Sign up
        </a>
      </div>
    </div>
  );
}
