export interface User { 
    _id: string;
    username: string;
    email: string;
    displayName: string;
    role: "student" | "teacher" | "admin";
    avatarUrl?: string;
    bio?: string;
    phone?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  