import Link from "next/link";
export default function Home() {
  return <main className="shell"><section className="card"><p className="intro">TP Auth · Next.js & Prisma</p><h1>Bienvenue dans votre espace.</h1><p className="intro">Créez votre compte ou connectez-vous pour accéder à votre tableau de bord personnel.</p><div className="flex flex-wrap gap-3"><Link className="button" href="/login">Se connecter</Link><Link className="button" href="/register">S’inscrire</Link></div></section></main>;
}