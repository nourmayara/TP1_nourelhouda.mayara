import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
const prisma = new PrismaClient();
const base = process.env.TEST_BASE_URL ?? "http://localhost:3100";
const email = `tp-test-${Date.now()}@example.com`;
let cookie = "";
async function request(path, method = "GET", body, authenticated = false) {
  return fetch(base + path, { method, redirect: "manual", headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...(authenticated ? { Cookie: cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
}
try {
  assert.equal((await request("/dashboard")).status, 307);
  assert.equal((await request("/api/auth/me")).status, 401);
  assert.equal((await request("/api/auth/register", "POST", { name: "A", email, password: "court" })).status, 400);
  const malformed = await fetch(base + "/api/auth/login", { method: "POST", body: "{" });
  assert.equal(malformed.status, 400);
  const registered = await request("/api/auth/register", "POST", { name: "  Alice  ", email: email.toUpperCase(), password: "motdepasse123" });
  assert.equal(registered.status, 201);
  const header = registered.headers.get("set-cookie");
  assert.match(header, /HttpOnly/i); assert.match(header, /SameSite=lax/i); assert.match(header, /Max-Age=604800/i);
  cookie = header.split(";")[0];
  const user = await registered.json();
  assert.equal(user.name, "Alice"); assert.equal(user.email, email); assert.equal("passwordHash" in user, false);
  const stored = await prisma.user.findUniqueOrThrow({ where: { email } });
  assert.notEqual(stored.passwordHash, "motdepasse123"); assert.equal(await bcrypt.compare("motdepasse123", stored.passwordHash), true);
  const me = await request("/api/auth/me", "GET", undefined, true); assert.equal(me.status, 200); assert.equal("passwordHash" in await me.json(), false);
  assert.equal((await request("/dashboard", "GET", undefined, true)).status, 200);
  const loginPage = await request("/login", "GET", undefined, true); assert.equal(loginPage.status, 307); assert.match(loginPage.headers.get("location"), /dashboard/);
  assert.equal((await request("/api/auth/register", "POST", { name: "Alice", email, password: "motdepasse123" })).status, 409);
  const wrong = await request("/api/auth/login", "POST", { email, password: "faux" });
  const unknown = await request("/api/auth/login", "POST", { email: "absent-" + email, password: "faux" });
  assert.equal(wrong.status, 401); assert.equal(unknown.status, 401); assert.deepEqual(await wrong.json(), await unknown.json());
  const logout = await request("/api/auth/logout", "POST", undefined, true); assert.equal(logout.status, 200); assert.match(logout.headers.get("set-cookie"), /Expires=Thu, 01 Jan 1970/i);
  assert.equal((await request("/api/auth/me")).status, 401);
  const login = await request("/api/auth/login", "POST", { email: email.toUpperCase(), password: "motdepasse123" }); assert.equal(login.status, 200);
  cookie = "session=invalid"; assert.equal((await request("/api/auth/me", "GET", undefined, true)).status, 401);
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const expired = await new SignJWT({ userId: user.id }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1 second ago").sign(secret);
  cookie = "session=" + expired; assert.equal((await request("/api/auth/me", "GET", undefined, true)).status, 401);
  cookie = login.headers.get("set-cookie").split(";")[0];
  await prisma.user.delete({ where: { email } });
  assert.equal((await request("/api/auth/me", "GET", undefined, true)).status, 404);
  const dashboard = await request("/dashboard", "GET", undefined, true); assert.equal(dashboard.status, 307); assert.match(dashboard.headers.get("location"), /session-expired/);
  console.log("Recette réussie : validation, inscription, hash, doublon, connexion, cookies, redirections, déconnexion, JWT invalide/expiré et compte supprimé.");
} finally {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
}