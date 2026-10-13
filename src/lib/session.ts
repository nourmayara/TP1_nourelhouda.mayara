import { cookies } from "next/headers";
import { COOKIE_NAME, MAX_AGE, signToken, verifyToken } from "./token";

export async function createSession(userId: number) {
  const token = await signToken(userId);
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}
