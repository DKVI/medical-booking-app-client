import React from "react";

export default function WorkScheduleElement({
  workschedule,
  selectedWorkScheduleId,
  setSelectedWorkScheduleId,
}) {
  // Lọc lịch làm việc thành hai nhóm: buổi sáng và buổi chiều
  const morningSchedules = workschedule.filter(
    (schedule) => schedule.period === "Morning"
  );
  const afternoonSchedules = workschedule.filter(
    (schedule) => schedule.period === "Afternoon"
  );

  return (
    <div style={{ width: "500px", margin: "0 auto", marginBottom: "20px" }}>
      {/* Block buổi sáng */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "16px",
          }}
        >
          Morning
        </label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {morningSchedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => setSelectedWorkScheduleId(schedule.id)}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor:
                  selectedWorkScheduleId === schedule.id ? "#1976d2" : "#fff",
                color: selectedWorkScheduleId === schedule.id ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {schedule.times}
            </button>
          ))}
        </div>
      </div>

      {/* Block buổi chiều */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "16px",
          }}
        >
          Afternoon
        </label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {afternoonSchedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => setSelectedWorkScheduleId(schedule.id)}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor:
                  selectedWorkScheduleId === schedule.id ? "#1976d2" : "#fff",
                color: selectedWorkScheduleId === schedule.id ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {schedule.times}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
