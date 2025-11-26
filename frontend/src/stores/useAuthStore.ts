import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,
    setAccessToken: (accessToken) => set({ accessToken }),

    clearState: () => set({ accessToken: null, user: null, loading: false }),

    signUp: async (username, password, email, firstName, lastName) => { 
        try {
            await authService.signUp(username, password, email, firstName, lastName);
            set({ loading: true });
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        } catch (error) {
            console.error("Đăng ký không thành công:", error);
        } finally {
            set({ loading: false });
        }
    },
    signIn: async (username, password) => { 
        try {
            set({ loading: true });
            const { accessToken } = await authService.signIn(username, password);
            await authService.signIn(username, password);
            toast.success("Đăng nhập thành công!");
            get().setAccessToken(accessToken);
            await get().fetchMe();
        } catch (error) {
            console.error("Đăng nhập không thành công:", error);
            toast.error("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
        } finally {
            set({ loading: false });
        }
    },
    signOut: async () => { 
        try {
            set({ loading: true });
            await authService.signOut();
            get().clearState();
            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.error("Đăng xuất không thành công:", error);
        } finally {
            set({ loading: false });
        }
    },
    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();
            set({ user });
        } catch (error) {
            console.error("Lấy thông tin người dùng không thành công:", error);
            set({ user: null, accessToken: null });
        } finally {
            set({ loading: false });
        }
    },
    refresh: async () => {
        try {
            set({ loading: true });
            const { user, fetchMe, setAccessToken } = get();
            const accessToken = await authService.refresh();
            setAccessToken(accessToken);
            if (user) {
                await fetchMe();
            }
            return accessToken;
        } catch (error) {
            console.error("phiên đăng nhập đã hết hạn. vui lòng đăng nhập lại", error);
            get().clearState();
            return null;
        } finally {
            set({ loading: false });
        }
    },
}));