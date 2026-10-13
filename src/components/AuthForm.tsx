"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setError(""); setLoading(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setError(result.error ?? "Une erreur est survenue"); return; }
      router.push("/dashboard"); router.refresh();
    } catch { setError("Connexion au serveur impossible. Réessayez."); }
    finally { setLoading(false); }
  }
  return <form onSubmit={submit} className="space-y-5" aria-busy={loading}>
    {mode === "register" && <label className="field">Nom<input name="name" autoComplete="name" required minLength={2} maxLength={80} /></label>}
    <label className="field">Adresse email<input name="email" type="email" autoComplete="email" required /></label>
    <label className="field">Mot de passe<input name="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={mode === "register" ? 8 : 1} /></label>
    {mode === "register" && <p className="text-sm text-slate-500">Au moins 8 caractères.</p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <button className="button w-full" disabled={loading}>{loading ? "Patientez…" : mode === "login" ? "Se connecter" : "Créer mon compte"}</button>
  </form>;
}
