// lib/users.ts
import bcrypt from "bcryptjs";

export type AuthUser = {
  username: string;
  passwordHash: string;
  role: "ADMIN" | "EDITOR";
};

const rawUsers = [
  { username: "teacher1", password: "$2b$10$i4WpKvWcbuzREkmpsUmHW.ZAhYTsTQuIp4Ze2CTQDSHrD7JYBSz1q", role: "ADMIN" },
  { username: "teacher2", password: "$2b$10$J.WgFN8IQEPtEhUVyvSWCO3AS926PztIpmqVaUWo/AxF1Of2KkqpW", role: "ADMIN" },
  { username: "staff", password: "$2b$10$dgk/bE7vkp2Ch7KkEjZOBuNA7YBVbRJ2mUwr.6Qk4npw50GJu8Ize", role: "EDITOR" },
];

export const users: AuthUser[] = rawUsers.map(u => ({
  username: u.username,
  role: u.role == "ADMIN" ? "ADMIN" : "EDITOR",
  passwordHash: u.password,
}));
