import Link from "next/link";
import AuthForm from "@/components/AuthForm";
export default function LoginPage() {
  return <main className="shell"><section className="card"><Link href="/">Accueil</Link><h1>Connexion</h1><p className="intro">Retrouvez votre espace personnel.</p><AuthForm mode="login" /><p className="mt-6">Pas encore de compte ? <Link href="/register">S’inscrire</Link></p></section></main>;
}
