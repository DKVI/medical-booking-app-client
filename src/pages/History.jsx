import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import authApi from "../api/auth.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import scheduleDetailApi from "../api/scheduledetail.api";
import purchaseApi from "../api/purchase.api";
import { motion } from "framer-motion";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function History() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("Pending"); // Trạng thái mặc định là Pending
  const [schedulingDetail, setSchedulingDetail] = useState(null);
  const [purchases, setPurchases] = useState(null);
  const [anchorEls, setAnchorEls] = useState({}); // Lưu trữ anchorEl cho từng thẻ
  const open = Boolean(anchorEls);

  const handleMenuClick = (event, index) => {
    setAnchorEls((prev) => ({ ...prev, [index]: event.currentTarget }));
  };

  const handleMenuClose = (index) => {
    setAnchorEls((prev) => ({ ...prev, [index]: null }));
  };

  const handleDetail = (id) => {
    navigate(`/checkout?id=${id}`);
    handleMenuClose();
  };

  const handleCancel = async (id) => {
    try {
      await scheduleDetailApi.cancel(id); // Gọi API hủy lịch
      alert("Lịch đã được hủy thành công!");
      await getShedulingDetail(); // Cập nhật lại danh sách
    } catch (err) {
      console.error("Hủy lịch thất bại:", err);
      alert("Hủy lịch thất bại!");
    }
    handleMenuClose();
  };

  const verifyUser = async (token) => {
    try {
      const res = await authApi.verify(token);
      if (!res.success) {
        navigate("/account"); // Điều hướng về trang đăng nhập nếu token không hợp lệ
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      navigate("/account"); // Điều hướng về trang đăng nhập nếu có lỗi
    }
  };

  // Hàm lấy thông tin người dùng
  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      setUser(res.user); // Lưu thông tin người dùng vào state
      await getShedulingDetail();
    } catch (err) {
      console.error("Failed to fetch user information:", err);
      navigate("/account"); // Điều hướng về trang đăng nhập nếu có lỗi
    }
  };

  const getShedulingDetail = async () => {
    try {
      const res = await scheduleDetailApi.getAll();
      setSchedulingDetail(res.schedulingDetails);
      console.log(res.schedulingDetails);
      await getPurchases();
    } catch (err) {
      console.log(err);
    }
  };

  const getPurchases = async () => {
    try {
      const res = await purchaseApi.getAll();
      setPurchases(res.purchases);
      console.log(res.purchases);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token"); // Lấy token từ cookie
    if (!token) {
      navigate("/account");
    } else {
      verifyUser(token);
      getUser(token);
    }
  }, []);

  return (
    <motion.div
      className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] p-[40px] bg-[#f4f6f8] flex gap-[20px] flex-col"
      style={{ overflow: "hidden" }} // Tắt cuộn
      initial={{ opacity: 0 }} // Bắt đầu mờ
      animate={{ opacity: 1 }} // Hiển thị dần
      transition={{ duration: 1 }} // Thời gian chuyển đổi
    >
      {/* Tiêu đề History */}
      <h1
        className="text-3xl font-bold mb-6"
        style={{
          color: "var(--base-color)", // Màu tiêu đề
          textShadow: "2px 2px 4px #cccc", // Thêm shadow
          textAlign: "left", // Neo về bên trái
        }}
      >
        History Purchase
      </h1>

      <div className="w-full flex-col flex gap-[20px]">
        {schedulingDetail && schedulingDetail.length > 0 && purchases ? (
          schedulingDetail
            .filter((detail) => {
              const purchase = purchases?.find(
                (e) => e.scheduling_details_id === detail.id
              );
              return purchase; // Chỉ lấy các lịch hẹn có purchase
            })
            .sort((a, b) => {
              const purchaseA = purchases?.find(
                (e) => e.scheduling_details_id === a.id
              );
              const purchaseB = purchases?.find(
                (e) => e.scheduling_details_id === b.id
              );
              return (purchaseB?.id || 0) - (purchaseA?.id || 0); // Sắp xếp giảm dần theo id purchase
            })
            .map((detail, index) => {
              const purchase = purchases?.find(
                (e) => e.scheduling_details_id === detail.id
              );
              return (
                <motion.div
                  key={index}
                  className="w-full py-5 px-10 flex shadow-xl justify-between rounded-[20px] cursor-pointer"
                  style={{ alignItems: "center" }}
                  initial={{ opacity: 0, y: 50 }} // Bắt đầu mờ và trượt xuống
                  animate={{ opacity: 1, y: 0 }} // Hiển thị khi vào viewport
                  transition={{ duration: 0.5, delay: index * 0.1 }} // Thời gian và độ trễ
                >
                  <div className="card-icon flex justify-start flex-none">
                    <FontAwesomeIcon
                      className="text-[var(--base-color)] text-[40px]"
                      icon={faCreditCard}
                    />
                  </div>
                  <div
                    className="description w-4/6 justify-items-start"
                    onClick={() => handleDetail(detail.id)}
                  >
                    <h2 className="text-[var(--base-color)] font-bold text-[24px]">
                      Successful Booking!
                    </h2>
                    <p className="text-gray-700 text-sm">
                      Facility: {detail.facility_name || "N/A"}
                    </p>
                    <p className="text-gray-700 text-sm">
                      Specialty: {detail.specialty_name || "N/A"}
                    </p>
                    <p className="text-gray-700 text-sm">
                      Doctor: {detail.doctor_name || "N/A"}
                    </p>
                  </div>
                  <div
                    className="status-times w-1/6 flex-col flex justify-end gap-[10px]"
                    style={{ alignContent: "flex-end", flexWrap: "wrap" }}
                  >
                    {purchase?.status === "Pending" ? (
                      <div
                        className="bg-red-500 text-white px-2 text-[10px] w-[100px] py-1 flex-none rounded-lg text-center"
                        style={{ fontWeight: "bold" }}
                      >
                        Pending
                      </div>
                    ) : (
                      <div
                        className="bg-green-500 text-white px-2 text-[10px] w-[100px] py-1 flex-none rounded-lg text-center"
                        style={{ fontWeight: "bold" }}
                      >
                        Purchased
                      </div>
                    )}
                    <div className="date text-[var(--base-color)] font-bold text-sm">
                      {purchase?.status === "Purchased" ? (
                        <span
                          style={{
                            fontSize: "16px",
                            color: "var(--base-color)", // Màu base-color
                          }}
                        >
                          {new Date(detail.date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      ) : new Date(detail.date).setHours(0, 0, 0, 0) <=
                        new Date().setHours(0, 0, 0, 0) ? (
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#ff9800", // Màu cam cho Expired
                            fontWeight: "bold",
                          }}
                        >
                          Expired
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "16px",
                            color: "var(--base-color)", // Màu base-color
                          }}
                        >
                          {new Date(detail.date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="times text-[var(--base-color)] font-bold text-sm">
                      <span
                        style={{
                          fontSize: "16px",
                          color: "var(--base-color)", // Màu base-color
                        }}
                      >
                        {detail.times || "N/A"}
                      </span>
                    </div>
                  </div>
                  {/* Dấu 3 chấm và menu thả xuống */}
                  <IconButton
                    aria-label="more"
                    aria-controls={`menu-${index}`}
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, index)} // Truyền index
                  >
                    <MoreVertIcon style={{ color: "var(--base-color)" }} />
                  </IconButton>
                  <Menu
                    id={`menu-${index}`}
                    anchorEl={anchorEls[index]} // Sử dụng anchorEl riêng cho từng thẻ
                    open={Boolean(anchorEls[index])} // Kiểm tra xem menu có mở không
                    onClose={() => handleMenuClose(index)} // Đóng menu cho thẻ tương ứng
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={() => handleDetail(detail.id)}>
                      Detail
                    </MenuItem>
                    {/* Chỉ hiển thị "Cancel" nếu trạng thái là Pending và không phải Expired */}
                    {purchase?.status === "Pending" &&
                      new Date(detail.date).setHours(0, 0, 0, 0) >
                        new Date().setHours(0, 0, 0, 0) && (
                        <MenuItem onClick={() => handleCancel(detail.id)}>
                          Cancel
                        </MenuItem>
                      )}
                    {/* Hiển thị "Delete" nếu ngày đã Expired và trạng thái không phải Purchased */}
                    {purchase?.status !== "Purchased" &&
                      new Date(detail.date).setHours(0, 0, 0, 0) <=
                        new Date().setHours(0, 0, 0, 0) && (
                        <MenuItem onClick={() => handleDelete(detail.id)}>
                          Delete
                        </MenuItem>
                      )}
                  </Menu>
                </motion.div>
              );
            })
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No scheduling details available.
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default History;
