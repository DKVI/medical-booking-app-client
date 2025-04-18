import React from "react";
import FormAuth from "../components/FormAuth";
function Login() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url(/2-banner.jpg)",
        backgroundPosition: "center",
        backgroundRepeat: "none",
        backgroundSize: "cover",
      }}
    >
      <FormAuth />
    </div>
  );
}

export default Login;
