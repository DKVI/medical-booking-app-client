import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const vietnamTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      const hours = vietnamTime.getHours().toString().padStart(2, "0");
      const minutes = vietnamTime.getMinutes().toString().padStart(2, "0");
      const seconds = vietnamTime.getSeconds().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <h1 className="text-[var(--base-color)] font-bold">
      {time ? time : "00:00:00"}
    </h1>
  );
};

export default DigitalClock;
