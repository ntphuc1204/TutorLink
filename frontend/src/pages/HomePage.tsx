import React, { useState } from "react";
import dayjs from "dayjs";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import Nav from "@/components/Navbar";
import WeekCalendar from "@/components/calendar/WeekCalendar";
import SettingsPage from "./SettingsPage";
import UserManagement from "./UserManagement";
import { useAuthStore } from "@/stores/useAuthStore";

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const { activePage, setActivePage } = useAuthStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const renderContent = () => {
    switch (activePage) {
      case "Lịch tuần":
        return <WeekCalendar selected={selectedDate} />;
      case "Cài đặt":
        return <SettingsPage />;
      case "Quản lý user":
        return <UserManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <Header />

      <div className="flex md:flex-row flex-col overflow-hidden">
        <Nav
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          activePage={activePage}
          setActivePage={setActivePage}
          isAdmin={isAdmin}
        />

        <main className="flex-1 min-h-[80vh] overflow-hidden bg-[#F2F8FF] p-4 relative h-full">
          {renderContent()}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
