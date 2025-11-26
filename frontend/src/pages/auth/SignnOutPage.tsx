import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import React from "react";
import { useNavigate } from "react-router";

const LogOut = () => {
    const { signOut } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        await signOut();
        navigate("/signin");
      } catch (error) {
        console.error("Đăng xuất không thành công:", error);
      }
    };
  return (
    <div>
            <Button onClick={handleLogout}> Logout</Button>
    </div>
  )
}

export default LogOut
