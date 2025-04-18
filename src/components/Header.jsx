import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const cookies = new Cookies();
    const cookieToken = cookies.get("myCat"); // Thay "myCat" bằng tên cookie thực tế
    if (cookieToken) {
      const realToken = cookieToken.startsWith("Bearer ")
        ? cookieToken.split(" ")[1]
        : cookieToken;
      setToken(realToken);
    }
  }, []);

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
      <div className="relative text-[var(--base-color)]">
        {token ? (
          <div className="relative group">
            {/* Icon User */}
            <div className="border border-[var(--base-color)] px-3 py-2 rounded-full cursor-pointer group-hover:bg-gray-100">
              <FontAwesomeIcon
                icon={faUser}
                className="text-[var(--base-color)]"
              />
            </div>

            {/* Dropdown Menu */}
            <div
              className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-lg p-2 mt-2"
              style={{
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 200,
              }}
            >
              <a
                href="/profile"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Profile
              </a>
              <a
                href="/settings"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Settings
              </a>
              <a
                href="/logout"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Logout
              </a>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
