# TP Auth — Next.js, Prisma et SQLite

Les parties 0 à 6 sont implémentées. Le projet conserve Next.js 16 et Prisma 6 : `src/proxy.ts` remplace le middleware de Next.js 15. Le champ existant `passwordHash` stocke le hash bcrypt. Le nom est obligatoire à l'inscription via Zod. Les champs `role` et la table `Session` préexistants sont conservés ; le TP utilise des JWT sans état et ne remplit pas cette table. Les exercices bonus ne sont pas implémentés.

## Démarrage

```powershell
npm.cmd install
# Seulement sur une nouvelle installation : copier .env.example vers .env.
# Renseigner JWT_SECRET avec la sortie de :
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
npx.cmd prisma generate
npx.cmd prisma migrate deploy
npm.cmd run dev
```

Ouvrir http://localhost:3000. Le fichier `.env` local est configuré ; ne pas le partager. `.env`, les bases SQLite et les cookies de test sont ignorés. La migration doit être versionnée.

## Vérifications

```powershell
npm.cmd run lint
npm.cmd run build
# Terminal 1
npm.cmd run start -- --port 3100
# Terminal 2
node scripts/test-auth.mjs
# Inspection de la base
npx.cmd prisma studio
```

Le test HTTP crée un compte temporaire et le supprime dans un bloc `finally`. Il couvre les codes 201/400/401/404/409, le hash bcrypt, les cookies, la normalisation, les redirections, les JWT invalides/expirés et la suppression d'un compte.

Recette navigateur : ouvrir `/dashboard` sans connexion ; s'inscrire ; vérifier le nom, l'email et la date ; ouvrir `/login` connecté ; se déconnecter ; essayer un mot de passe incorrect ; se reconnecter. Dans les outils du navigateur, vérifier HttpOnly et SameSite=Lax. Secure est activé en production (HTTPS requis en déploiement).

## API

- POST `/api/auth/register` : nom, email, password ; 201, 400 ou 409.
- POST `/api/auth/login` : email, password ; 200, 400 ou 401.
- POST `/api/auth/logout` : suppression du cookie ; 200.
- GET `/api/auth/me` : utilisateur sans hash ; 200, 401 ou 404.

Voir `REPONSES_TP.md` pour les réponses pédagogiques.