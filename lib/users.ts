// lib/users.ts
import bcrypt from "bcryptjs";

export type AuthUser = {
  username: string;
  passwordHash: string;
  role: "ADMIN" | "EDITOR";
};

// ⚠️ Generate hashes once (e.g. via bcrypt.hashSync) and paste here,
//     or generate at build time. This example hashes at startup.

const rawUsers = [
  { username: "teacher1", password: "pass123", role: "ADMIN" },
  { username: "teacher2", password: "pass456", role: "ADMIN" },
  { username: "staff", password: "secret", role: "EDITOR" },
];

export const users: AuthUser[] = rawUsers.map(u => ({
  username: u.username,
  role: u.role == "ADMIN" ? "ADMIN" : "EDITOR",
  passwordHash: bcrypt.hashSync(u.password, 10),
}));
