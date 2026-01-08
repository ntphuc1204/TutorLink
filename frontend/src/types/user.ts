import { useState } from "react";

export type Role = "student" | "teacher" | "admin";
export interface User { 
    _id: string;
    username: string;
    email: string;
    displayName: string;
    role: Role;
    avatarUrl?: string;
    bio?: string;
    phone?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  const [users, setUsers] = useState<User[]>([]);