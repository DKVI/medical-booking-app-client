import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function WeekdayDatePicker({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Hàm để kiểm tra xem ngày có nằm trong tuần hiện tại không
  const shouldDisableDate = (date) => {
    const today = dayjs(); // Ngày hiện tại
    const tomorrow = today.add(1, "day");
    const endOfWeek = today.endOf("week").subtract(0, "day"); // Kết thúc tuần (Thứ sáu)
    return !dayjs(date).isBetween(tomorrow, endOfWeek, "day", "[]"); // Vô hiệu hóa nếu không nằm trong tuần hiện tại
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    onDateChange(newValue); // Truyền dữ liệu ra ngoài qua prop
    console.log(newValue);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Choose a Weekday"
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={shouldDisableDate} // Giới hạn ngày
          textField={(params) => <input {...params} />}
          className="w-[500px]"
        />
      </LocalizationProvider>
      <p
        style={{
          marginTop: "10px",
          color: "gray",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        You must book before 11 PM the day after.
      </p>
    </div>
  );
}
