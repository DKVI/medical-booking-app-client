import React from "react";
import { useNavigate } from "react-router-dom";
import FormAuth from "../components/FormAuth";
function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

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
      <FormAuth onLogin={handleLogin} />
    </div>
  );
}

export default Login;
