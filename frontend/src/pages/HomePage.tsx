import { useAuthStore } from "@/stores/useAuthStore";
import LogOut from "./auth/SignnOutPage";


const HomePage = () => {
    const user  = useAuthStore((state) => state.user);

  return (
    <div>
          <h1>Welcome, {user?.username}!</h1>
        <LogOut />
    </div>
  );
};

export default HomePage;
