import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface MiniCalendarProps {
  selected: Dayjs;
  setSelected: (d: Dayjs) => void;
}

const MiniCalendar = ({ selected, setSelected }: MiniCalendarProps) => {
  const [month, setMonth] = useState(dayjs());

  const startOfMonth = month.startOf("month");
  const firstDayIndex = startOfMonth.day(); // CN = 0
  
  const prevMonth = () => setMonth(month.subtract(1, "month"));
  const nextMonth = () => setMonth(month.add(1, "month"));

  // Tạo grid 6 hàng x 7 cột
  const calendarCells = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayIndex + 1;
    return startOfMonth.add(dayNumber - 1, "day");
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-[#B5D8F2] p-3">
      <div className="flex justify-between items-center mb-3">
        <button onClick={prevMonth} className="hover:text-[#45A7E6]">◀</button>
        <div className="font-semibold text-[#2F4858]">{month.format("MMMM YYYY")}</div>
        <button onClick={nextMonth} className="hover:text-[#45A7E6]">▶</button>
      </div>

      <div className="grid grid-cols-7 text-center text-[#6C8A99] text-xs mb-1">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center gap-1">
        {calendarCells.map((date, i) => {
          const isCurrentMonth = date.month() === month.month();
          const isSelected = date.isSame(selected, "day");

          return (
            <div
              key={i}
              className={`h-8 w-8 flex items-center justify-center text-sm cursor-pointer rounded-full transition-all
                ${!isCurrentMonth ? "text-gray-300" : "text-[#2F4858]"}
                ${isSelected ? "bg-[#45A7E6] text-white font-bold" : "hover:bg-[#E8F3FF]"}
              `}
              onClick={() => setSelected(date)}
            >
              {date.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;