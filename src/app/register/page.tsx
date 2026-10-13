import Link from "next/link";
import AuthForm from "@/components/AuthForm";
export default function RegisterPage() {
  return <main className="shell"><section className="card"><Link href="/">Accueil</Link><h1>Créer un compte</h1><p className="intro">Votre espace personnel en quelques instants.</p><AuthForm mode="register" /><p className="mt-6">Déjà inscrit ? <Link href="/login">Se connecter</Link></p></section></main>;
}