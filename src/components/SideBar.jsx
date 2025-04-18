import React from "react";
import "../App.css";
import { faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div
      className="w-[200px] shadow-2xl p-5 flex flex-col justify-between"
      style={{
        position: "fixed",
        top: "80px",
        bottom: "0",
        left: "0",
      }}
    >
      {/* Main Menu (Phần trên) */}
      <div className="main-menu flex flex-col gap-4">
        <Link className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faGear}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Setting</p>
        </Link>
        <Link className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faGear}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Dashboard</p>
        </Link>
        <Link className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faGear}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Profile</p>
        </Link>
      </div>

      {/* Sub Menu (Phần dưới) */}
      <div className="sub-menu flex flex-col gap-4">
        <Link className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faGear}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Setting</p>
        </Link>
        <Link className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Logout</p>
        </Link>
      </div>
    </div>
  );
}
