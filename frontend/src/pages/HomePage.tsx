import React, { useState } from "react";
import dayjs from "dayjs";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import Nav from "@/components/Navbar";
import WeekCalendar from "@/components/calendar/WeekCalendar";

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [activePage, setActivePage] = useState("Lịch tuần");

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <div>Đây là Dashboard</div>;
      case "Lịch tuần":
        return <WeekCalendar selected={selectedDate} />;
      case "Cài đặt":
        return <div>Trang Cài đặt</div>;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />

      <div className="flex md:flex-row flex-col overflow-hidden">
        <Nav
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <main className="flex-1 overflow-hidden bg-[#F2F8FF] p-4 relative min-h-[48rem]">
          {renderContent()}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
