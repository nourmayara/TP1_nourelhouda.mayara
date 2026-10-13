import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";
export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { name: true, email: true, createdAt: true } });
  if (!user) redirect("/api/auth/session-expired");
  return <main className="shell"><section className="card"><h1>Bonjour {user.name} !</h1><p className="intro">Vous êtes connecté à votre compte.</p><p>Email : {user.email}</p><p className="mb-6">Membre depuis le {user.createdAt.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })}</p><LogoutButton /></section></main>;
}