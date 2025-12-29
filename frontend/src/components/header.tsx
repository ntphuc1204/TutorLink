import LogOut from "@/pages/auth/SignnOutPage";
import { useAuthStore } from "@/stores/useAuthStore";
import React from "react";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex justify-between p-[1rem]">
      <h1>Welcome, {user?.username}!</h1>
      <LogOut />
    </div>
  );
};

export default Header;
