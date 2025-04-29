import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css"; // Import CSS tùy chỉnh
import { enUS } from "date-fns/locale"; // Import locale tiếng Anh

function CalendarBlock() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="calendar-container w-full h-full flex justify-center items-center">
      <Calendar
        onChange={setDate}
        value={date}
        locale="en-US" // Sử dụng locale tiếng Anh
        className="m-auto rounded-[20px]"
      />
    </div>
  );
}

export default CalendarBlock;
