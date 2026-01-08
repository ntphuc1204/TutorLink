import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  users: User[];
  loading: boolean;

  activePage: string;
  setActivePage: (page: string) => void;

  setAccessToken: (accessToken: string) => void;
  clearState: () => void;

  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    role: "student" | "teacher" | "admin"
  ) => Promise<void>;

  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<string | null>;

  // PROFILE
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | void>;   // 👈 THÊM DÒNG NÀY

  // ADMIN
  fetchAllUsers: () => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}
