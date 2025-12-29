import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>()(
    persist(
      (set, get) => ({
        accessToken: null,
        user: null,
        loading: false,
  
        setAccessToken: (accessToken) => set({ accessToken }),
  
        clearState: () => set({ accessToken: null, user: null, loading: false }),
  
        signUp: async (username, password, email, firstName, lastName) => {
          try {
            set({ loading: true });
            await authService.signUp(username, password, email, firstName, lastName);
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
            get().setAccessToken(accessToken);
  
            await get().fetchMe();
  
            toast.success("Đăng nhập thành công!");
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
          } catch {
            set({ user: null, accessToken: null });
          } finally {
            set({ loading: false });
          }
        },
  
        refresh: async () => {
          try {
            set({ loading: true });
  
            const accessToken = await authService.refresh();
            get().setAccessToken(accessToken);
  
            if (get().user) await get().fetchMe();
  
            return accessToken;
          } catch {
            get().clearState();
            return null;
          } finally {
            set({ loading: false });
          }
        },
      }),
  
      {
        name: "auth-storage",
      }
    )
  );
  