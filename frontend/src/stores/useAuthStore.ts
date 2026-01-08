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
      users: [],
      loading: false,

      activePage: "",
      setActivePage: (page: string) => set({ activePage: page }),

      setAccessToken: (accessToken) => set({ accessToken }),

      clearState: () =>
        set({ accessToken: null, user: null, users: [], loading: false }),

      // ================= AUTH =================
      signUp: async (username, password, email, firstName, lastName, role) => {
        try {
          set({ loading: true });
          await authService.signUp(username, password, email, firstName, lastName, role);
          toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        } catch (error) {
          console.error("Đăng ký không thành công:", error);
          toast.error("Đăng ký thất bại");
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

      // ================= PROFILE =================
      updateProfile: async (data) => {
        try {
          set({ loading: true });
          await authService.updateProfile(data);
          await get().fetchMe();
          toast.success("Cập nhật hồ sơ thành công!");
        } catch (err) {
          console.error(err);
          toast.error("Cập nhật hồ sơ thất bại!");
        } finally {
          set({ loading: false });
        }
      },

      // ================= ADMIN =================
      fetchAllUsers: async () => {
        try {
          set({ loading: true });
          const users = await authService.getAllUsers();
          set({ users });
        } catch (err) {
          console.error(err);
          toast.error("Không tải được danh sách người dùng");
        } finally {
          set({ loading: false });
        }
      },

      updateUser: async (id, data) => {
        try {
          set({ loading: true });
          await authService.updateUser(id, data);
          toast.success("Cập nhật người dùng thành công!");
          await get().fetchAllUsers();
        } catch (err) {
          console.error(err);
          toast.error("Cập nhật thất bại!");
        } finally {
          set({ loading: false });
        }
      },
      deleteUser: async (id) => {
        try {
          set({ loading: true });
          await authService.deleteUser(id);
          toast.success("Xóa người dùng thành công!");
          await get().fetchAllUsers();
        } catch (err) {
          console.error(err);
          toast.error("Xóa thất bại!");
        } finally {
          set({ loading: false });
        }
      },
      // ================= PROFILE =================
      uploadAvatar: async (file: File) => {
        try {
          set({ loading: true });

          const res = await authService.uploadAvatar(file);

          // cập nhật user trong store
          set((state) => ({
            user: state.user
              ? { ...state.user, avatarUrl: res.avatarUrl }
              : state.user,
          }));

          toast.success("Cập nhật avatar thành công!");
          return res.avatarUrl;
        } catch (err) {
          console.error(err);
          toast.error("Upload avatar thất bại!");
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
