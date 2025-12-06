// lib/auth/jwt.ts
import jwt from "jsonwebtoken";
import type { ID } from "@/lib/types";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET not defined in env");
}

export function signToken(payload: { sub: ID; role?: string; email?: string }, opts?: jwt.SignOptions) {
  return jwt.sign(payload, SECRET, { expiresIn: "30d", ...(opts || {}) });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as any;
  } catch (err) {
    return null;
  }
}
