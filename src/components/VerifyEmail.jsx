import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMailReply } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import emailApi from "../api/mail.api";
export default function VerifyEmail({ username, email, token }) {
  const sendVerifyMail = async () => {
    await emailApi.verifyEmail(token, email, username);
  };
  useEffect(() => {
    sendVerifyMail();
  }, []);
  return (
    <motion.div
      className=""
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--base-color)",
        zIndex: 500,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div>
          <h2 className=" text-[24px]">
            Welcome to Medical Booking App,{" "}
            <span className="text-[var(--base-color)]">{username}</span>!
          </h2>
        </div>
        <div className="py-3">
          <FontAwesomeIcon
            className="text-[100px] text-[var(--base-color)]"
            icon={faEnvelope}
          />
        </div>
        <div>
          <b className="p-3">Verify your email</b>
          <p className="p-3">
            Hi, thanks for registering an account with Medical Booking App!
            You're the coolest person in all land
          </p>
          <p className="p-3">
            Before we get started, we'll need to verify your email.{" "}
            <span className="text-[var(--base-color)]">{email}</span>
          </p>
          <button
            type="button"
            className="p-2 text-white"
            style={{ backgroundColor: "var(--base-color)" }}
            onClick={() => {
              window.open("https://mail.google.com", "_blank"); // Mở Gmail trong tab mới
            }}
          >
            Go to Gmail
          </button>
        </div>
      </div>
    </motion.div>
  );
}
