import React, { useState } from "react";
import avatarCache from "../api/randomAvt.api"; // Import avatarCache chứa danh sách ảnh
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import patientApi from "../api/patient.api";
import LoadingScreen from "./LoadingScreen";

export default function AvatarChoosing({ idUser, onBack }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null); // State lưu avatar được chọn
  const [dialogOpen, setDialogOpen] = useState(false); // State kiểm soát dialog
  const [dialogMessage, setDialogMessage] = useState(""); // State lưu thông báo trong dialog
  const [loading, setLoading] = useState(false);
  const handleAvatarClick = (value) => {
    setSelectedAvatar(value); // Gán ID của avatar được chọn
  };

  const changeAvt = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await patientApi.changeAvt({
          id: idUser,
          avatar: selectedAvatar,
        });
        if (res.success) {
          setLoading(false);
          setDialogMessage(
            "Avatar updated successfully! Do you want to reload the page?"
          );
          setDialogOpen(true); // Hiển thị dialog thành công
        } else {
          setLoading(false);
          setDialogMessage("System error. Please try again.");
          setDialogOpen(true); // Hiển thị dialog lỗi
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
        setDialogMessage("System error. Please try again.");
        setDialogOpen(true); // Hiển thị dialog lỗi
      }
    }, 1000);
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Đóng dialog
  };

  const handleReload = () => {
    window.location.reload(); // Reload lại trang
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
      {loading && <LoadingScreen />}
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
                selectedAvatar === avatarCache[id]
                  ? "border-[5px] border-[var(--base-color)]"
                  : "border-[2px] border-gray-300"
              }`}
              onClick={() => handleAvatarClick(avatarCache[id])}
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
                backgroundColor: "red",
              },
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
            }}
            onClick={onBack}
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
                backgroundColor: "green",
              },
              padding: "10px 20px",
              borderRadius: "8px",
            }}
            onClick={() => {
              changeAvt();
            }}
            disabled={!selectedAvatar}
          >
            Save
          </Button>
        </div>

        {/* Dialog */}
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>
            <Typography>{dialogMessage}</Typography>
          </DialogContent>
          <DialogActions>
            {dialogMessage.includes("successfully") ? (
              <>
                <Button onClick={handleReload} color="primary">
                  Yes
                </Button>
                <Button onClick={handleDialogClose} color="secondary">
                  No
                </Button>
              </>
            ) : (
              <Button onClick={handleDialogClose} color="primary">
                Close
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
