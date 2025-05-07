import React, { useState } from "react";
import avatarCache from "../api/randomAvt.api"; // Import avatarCache chứa danh sách ảnh
import { Button } from "@mui/material";

export default function AvatarChoosing({ onSave, onBack }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null); // State lưu avatar được chọn

  const handleAvatarClick = (id) => {
    setSelectedAvatar(id); // Gán ID của avatar được chọn
  };

  return (
    <div
      className="w-[100vw] h-[100vh] flex"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "fixed",
        zIndex: 1000,
      }}
    >
      <div className="m-auto w-[calc(100vw-400px)] bg-white h-[calc(100vh-100px)] p-10 rounded-lg shadow-lg flex flex-col">
        {/* Tiêu đề */}
        <h2
          className="text-[var(--base-color)] text-2xl font-bold text-center mb-5"
          style={{ paddingBottom: "20px" }}
        >
          Choosing Avatar
        </h2>

        {/* Danh sách avatar */}
        <div
          className="grid grid-cols-10 gap-4 overflow-y-auto"
          style={{ flex: 1 }}
        >
          {Object.keys(avatarCache).map((id) => (
            <img
              key={id}
              src={avatarCache[id]}
              alt={`Avatar ${id}`}
              className={`w-16 h-16 rounded-full cursor-pointer ${
                selectedAvatar === id
                  ? "border-[5px] border-[var(--base-color)]"
                  : "border-[2px] border-gray-300"
              }`}
              onClick={() => handleAvatarClick(id)}
            />
          ))}
        </div>

        {/* Nút Save và Back */}
        <div className="flex justify-between mt-10">
          <Button
            type="button"
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": {
                backgroundColor: "red",
              },
              "&:active": {
                backgroundColor: "red", // Chuyển sang màu đỏ khi click
              },
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
            }}
            onClick={onBack} // Gọi hàm onBack khi bấm nút Back
          >
            Back
          </Button>
          <Button
            sx={{
              backgroundColor: "green",
              color: "white",
              "&:hover": {
                backgroundColor: "green",
              },
              "&:active": {
                backgroundColor: "green", // Chuyển sang màu đỏ khi click
              },
              padding: "10px 20px",
              borderRadius: "8px",
            }}
            onClick={() => onSave(avatarCache[selectedAvatar])} // Gọi hàm onSave với URL avatar được chọn
            disabled={!selectedAvatar} // Vô hiệu hóa nút nếu chưa chọn avatar
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
