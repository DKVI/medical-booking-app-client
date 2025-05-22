import React from "react";
import FormAuth from "../components/FormAuth";
import { motion } from "framer-motion"; // Thêm dòng này

function Login() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: "url(/2-banner.jpg)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="w-full flex justify-center"
      >
        <FormAuth />
      </motion.div>
    </div>
  );
}

export default Login;
