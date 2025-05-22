import React from "react";
import FormAuthDoctor from "../components/FormAuthDoctor";
function LoginDoctor() {
  return (
    <div
      className="flex flex-col items-center justify-center h-[100vh]"
      style={{
        backgroundImage: "url(/3-banner.jpg)",
        backgroundPosition: "center",
        backgroundRepeat: "none",
        backgroundSize: "cover",
      }}
    >
      <FormAuthDoctor />
    </div>
  );
}

export default LoginDoctor;
