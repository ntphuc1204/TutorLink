import React, { useState } from "react";
import { Dayjs } from "dayjs";
import MiniCalendar from "./calendar/MiniCalendar";

interface NavProps {
  selectedDate: Dayjs;
  setSelectedDate: (d: Dayjs) => void;
  activePage: string;
  setActivePage: (p: string) => void;
  isAdmin?: boolean; // 👈 thêm prop này
}

const Nav = ({
  selectedDate,
  setSelectedDate,
  activePage,
  setActivePage,
  isAdmin = false,
}: NavProps) => {
  const [openCalendar, setOpenCalendar] = useState(false);

  // 👇 danh sách menu — nếu không phải admin thì bỏ "Quản lý user"
  const menuItems = [
    "Lịch tuần",
    "Cài đặt",
    ...(isAdmin ? ["Quản lý user"] : []),
  ];

  return (
    <nav
      className="
        w-full md:w-50 
        bg-[#fff] border-[#B5D8F2] 
        flex md:flex-col flex-col
        h-auto md:h-full 
        p-4 gap-2 md:gap-0
        relative
      "
    >
      {/* Desktop calendar */}
      <div className="hidden block">
        <MiniCalendar selected={selectedDate} setSelected={setSelectedDate} />
      </div>

      {/* Mobile mini calendar */}
      {activePage === "Lịch tuần" && (
        <div className=" relative">
          <button
            className="px-3 py-2 border rounded-lg text-[#2F4858] bg-white shadow-sm"
            onClick={() => setOpenCalendar(!openCalendar)}
          >
            {selectedDate.format("DD/MM/YYYY")}
          </button>

          {openCalendar && (
            <div
              className="absolute top-12 left-0 z-20  w-[15rem]
              bg-white shadow-xl border rounded-lg p-2"
            >
              <MiniCalendar
                selected={selectedDate}
                setSelected={(d) => {
                  setSelectedDate(d);
                  setOpenCalendar(false);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Menu */}
      <div className="mt-0 md:mt-4 flex-1">
        <ul className="flex md:flex-col flex-row md:space-y-1 space-x-2 md:space-x-0">
          {menuItems.map((item) => (
            <li
              key={item}
              onClick={() => setActivePage(item)}
              className={`
                px-3 py-2 font-medium rounded-lg cursor-pointer
                transition-colors whitespace-nowrap m-0
                ${
                  activePage === item
                    ? "bg-[#E8F3FF] text-[#45A7E6]"
                    : "text-[#2F4858] hover:bg-[#E8F3FF] hover:text-[#45A7E6]"
                }
              `}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
