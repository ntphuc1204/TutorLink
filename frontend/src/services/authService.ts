import api from "@/lib/axios";

export const authService = {
  // ==== AUTH CŨ CỦA BẠN ====
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    role: "student" | "teacher" | "admin" = "student"
  ) => {
    const res = await api.post(
      "/auth/signup",
      {
        username,
        password,
        email,
        firstName,
        lastName,
        role,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  signIn: async (username: string, password: string) => {
    const res = await api.post(
      "/auth/signin",
      { username, password },
      { withCredentials: true }
    );
    return res.data;
  },

  signOut: async () => {
    const res = await api.post('/auth/signout', {}, {
        withCredentials: true
    });
    return res.data;
},
fetchMe: async () => { 
    const res = await api.get('/user/me', {
        withCredentials: true
    });
    return res.data.user;
},
refresh: async () => { 
    const res = await api.post('/auth/refresh', {}, {
        withCredentials: true
    });
    return res.data.accessToken;
},
  // ==== 👇 THÊM 3 HÀM NÀY 👇 ====

  updateProfile: async (data: any) => {
    const res = await api.put("/user/profile", data, {
      withCredentials: true,
    });
    return res.data;
  },

  getAllUsers: async () => {
    const res = await api.get("/user/all", {
      withCredentials: true,
    });
    return res.data.users;
  },

  updateRole: async (id: string, role: string) => {
    const res = await api.put(
      `/user/${id}/role`,
      { role },
      { withCredentials: true }
    );
    return res.data;
    },
    updateUser: async (id: string, data: any) => {
        const res = await api.put(
          `/user/${id}`,
          data,
          { withCredentials: true }
        );
        return res.data;
      },
      deleteUser: async (id: string) => {
        const res = await api.delete(`/user/${id}`, {
          withCredentials: true,
        });
        return res.data;
      },
      uploadAvatar: async (file: File) => {
        const form = new FormData();
        form.append("avatar", file);
      
        const res = await api.put("/user/upload-avatar", form, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      
        return res.data;
      },
      
};
