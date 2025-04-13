import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--base-color)",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "20px" }}
      >
        404
      </h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "30px" }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "var(--base-color)",
          backgroundColor: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          fontSize: "1rem",
          fontWeight: "bold",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "var(--base-color)";
          e.target.style.color = "white";
          e.target.style.border = "2px solid white";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "white";
          e.target.style.color = "var(--base-color)";
          e.target.style.border = "none";
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
