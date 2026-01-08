import React from "react";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const hours = Array.from({ length: 18 }, (_, i) => 7 + i); // 7AM - 21PM
const HOUR_HEIGHT = 160;

// 👉 Tuần bắt đầu từ Thứ 2
const generateWeekDays = (date: Dayjs) =>
  Array.from({ length: 7 }, (_, i) => date.startOf("isoWeek").add(i, "day"));

interface CalendarEvent {
  id: number;
  title: string;
  subject: string;
  start: Dayjs;
  end: Dayjs;
}
const subjectColors: Record<string, string> = {
  english: "#4CAF50", // xanh lá
  math: "#FF9800", // cam
  football: "#E91E63", // hồng
  programming: "#2196F3", // xanh dương
};

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Học tiếng Anh",
    subject: "english",
    start: dayjs("2025-12-13T09:00"),
    end: dayjs("2025-12-13T10:00"),
  },
  {
    id: 2,
    title: "Học Toán",
    subject: "math",
    start: dayjs("2025-12-14T14:00"),
    end: dayjs("2025-12-14T16:00"),
  },
  {
    id: 3,
    title: "Đá bóng 7",
    subject: "football",
    start: dayjs("2025-12-16T17:00"),
    end: dayjs("2025-12-16T18:15"),
  },
  {
    id: 4,
    title: "Học lập trình",
    subject: "programming",
    start: dayjs("2025-12-17T10:00"),
    end: dayjs("2025-12-17T11:30"),
  },
  {
    id: 5,
    title: "Học lập trình C++",
    subject: "programming",
    start: dayjs("2025-12-19T10:00"),
    end: dayjs("2025-12-19T11:20"),
  },
  {
    id: 6,
    title: "Đá bóng 11",
    subject: "football",
    start: dayjs("2025-12-20T17:00"),
    end: dayjs("2025-12-20T18:30"),
  },
  {
    id: 7,
    title: "Học lập trình",
    subject: "programming",
    start: dayjs("2025-12-17T12:00"),
    end: dayjs("2025-12-17T12:45"),
  },
  {
    id: 8,
    title: "Học tiếng Anh",
    subject: "english",
    start: dayjs("2025-12-17T15:30"),
    end: dayjs("2025-12-17T17:45"),
  },
  {
    id: 9,
    title: "Học Toán",
    subject: "math",
    start: dayjs("2025-12-18T15:30"),
    end: dayjs("2025-12-18T17:00"),
  },
  {
    id: 10,
    title: "Học lập trình",
    subject: "programming",
    start: dayjs("2025-12-15T15:00"),
    end: dayjs("2025-12-15T16:30"),
  },
];

export const WeekCalendar = ({ selected }: { selected: Dayjs }) => {
  const weekDays = generateWeekDays(selected);

  return (
    <div className="flex-1 p-0 h-full bg-[#F2F8FF]">
      <div className="h-[80%] max-h-[80vh] overflow-y-auto p-0 relative md:h-[100%] md:w-full">
        {/* HEADER */}
        <div className="grid grid-cols-7 text-center py-3 bg-white sticky top-0 z-10 shadow-[0_4px_10px_0_rgba(135,195,255,0.5)] pl-[2.4rem]">
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className="border-r border-[#B5D8F2] last:border-0"
            >
              <div className="font-semibold text-[#2F4858] text-[0.8rem] md:text-[1.6rem]">
                {day.format("ddd")}
              </div>
              <div className="text-[#45A7E6] text-[0.6rem] md:text-[1.4rem]">
                {day.format("DD-MM")}
              </div>
            </div>
          ))}
        </div>

        {/* BODY */}
        <div className="flex bg-[#E8F3FF]">
          {/* TIME COLUMN */}
          <div className="w-[2.4rem] border-x border-y border-[#B5D8F2]">
            {hours.map((h) => (
              <div
                key={h}
                className="h-40 text-xs text-[#6C8A99] pr-1 text-right"
              >
                {h}:00
              </div>
            ))}
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 flex-1">
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className="border-r border-[#B5D8F2] relative"
              >
                {hours.map((h) => (
                  <div
                    key={h}
                    className="h-40 border-b border-[#B5D8F2] hover:bg-[#CDE8FF]"
                  ></div>
                ))}

                {/* EVENTS */}
                {mockEvents
                  .filter((e) => e.start.isSame(day, "day"))
                  .map((e) => {
                    const startHour = e.start.hour() - 7;
                    const startMinute = e.start.minute();
                    const duration = e.end.diff(e.start, "minute") / 60;

                    const top =
                      startHour * HOUR_HEIGHT +
                      (startMinute / 60) * HOUR_HEIGHT;

                    return (
                      <div
                        key={e.id}
                        className="
                          absolute text-white p-1 rounded
                          shadow-[0_2px_8px_rgba(69,167,230,0.45)]
                          text-[0.8rem]
                        "
                        style={{
                          background: subjectColors[e.subject] || "#80CFFF",
                          top,
                          height: duration * HOUR_HEIGHT,
                        }}
                      >
                        {e.title}
                        <div className="text-[0.75rem]">
                          {e.start.format("HH:mm")} → {e.end.format("HH:mm")}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar;
