import {
  faCalendarCheck,
  faUserClock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function DashboardDoctor() {
  // Lấy ngày hôm nay và định dạng
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short", // Thứ (ví dụ: Mon, Tue)
    month: "long", // Tháng đầy đủ (ví dụ: January, February)
    day: "numeric", // Ngày (ví dụ: 1, 2)
  }).format(today);

  return (
    <div>
      <div className="fixed top-0 text-[30px] left-[300px] right-0 py-5 px-10 font-bold text-[var(--base-color)] text-left shadow-md bg-white">
        Dashboard
      </div>
      <div className="mt-[100px] ml-[300px] py-10 px-[50px] w-[calc(100vw-300px)] h-[calc(100vh-100px)]">
        <div className="w-full flex justify-between">
          <div className="h-[100px] w-1/3 flex gap-5">
            <div
              className="flex w-[100px] rounded-[50%]"
              style={{ border: "4px solid var(--base-color)" }}
            >
              <FontAwesomeIcon
                className="m-auto text-[30px] text-[var(--base-color)]"
                icon={faUserClock}
              />
            </div>
            <div className="flex justify-between flex-col text-left">
              <p className="text-[20px]">Total Patients</p>
              <p className="text-[30px]">12</p>
              <p className="text-[20px]">Till Today</p>
            </div>
          </div>
          <div className="h-[100px] w-1/3 flex gap-5">
            <div
              className="flex w-[100px] rounded-[50%]"
              style={{ border: "4px solid var(--base-color)" }}
            >
              <FontAwesomeIcon
                className="m-auto text-[30px] text-[var(--base-color)]"
                icon={faUsers}
              />
            </div>
            <div className="flex justify-between flex-col text-left">
              <p className="text-[20px]">Today Patients</p>
              <p className="text-[30px]">2</p>
              <p className="text-[20px]">{formattedDate}</p>{" "}
            </div>
          </div>
          <div className="h-[100px] w-1/3 flex gap-5">
            <div
              className="flex w-[100px] rounded-[50%]"
              style={{ border: "4px solid var(--base-color)" }}
            >
              <FontAwesomeIcon
                className="m-auto text-[30px] text-[var(--base-color)]"
                icon={faCalendarCheck}
              />
            </div>
            <div className="flex justify-between flex-col text-left">
              <p className="text-[20px]">Total Appointments</p>
              <p className="text-[30px]">4</p>
              <p className="text-[20px]">{formattedDate}</p>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardDoctor;
