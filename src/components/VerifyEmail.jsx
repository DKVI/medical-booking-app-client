import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import emailApi from "../api/mail.api";

export default function VerifyEmail({ username, email, token }) {
  const sendVerifyMail = async () => {
    await emailApi.verifyEmail(token, email, username);
  };
  useEffect(() => {
    sendVerifyMail();
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0f9ff 100%)",
        zIndex: 500,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      initial={{ scale: 0.8, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.68, -0.55, 0.27, 1.55],
      }}
    >
      <motion.div
        className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-blue-100 px-8 py-8 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          type: "spring",
          bounce: 0.45,
        }}
      >
        <FontAwesomeIcon
          icon={faEnvelopeCircleCheck}
          className="text-blue-500 text-5xl mb-4 drop-shadow"
        />
        <div className="text-[26px] font-extrabold text-[var(--base-color)] mb-2 text-center">
          Please check your email!
        </div>
        <div className="text-blue-700 text-lg font-semibold mb-2 text-center">
          {email}
        </div>
        <div className="text-gray-600 text-base text-center mb-2">
          Hi{" "}
          <span className="font-bold text-[var(--base-color)]">{username}</span>
          ,
          <br />
          We have sent a verification link to your email.
          <br />
          Please check your inbox and follow the instructions to activate your
          account.
        </div>
        <div className="text-gray-400 text-sm text-center mb-4">
          If you don't see the email, please check your spam or promotions
          folder.
        </div>
        <Button
          variant="contained"
          sx={{
            fontWeight: "bold",
            fontSize: 16,
            borderRadius: 3,
            px: 4,
            py: 1.5,
            background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
            boxShadow: "0 2px 12px #60a5fa33",
          }}
          onClick={() => {
            window.open("https://mail.google.com", "_blank");
          }}
          startIcon={<FontAwesomeIcon icon={faEnvelopeCircleCheck} />}
        >
          Go to Gmail
        </Button>
      </motion.div>
    </motion.div>
  );
}
