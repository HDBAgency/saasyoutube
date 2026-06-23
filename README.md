# VideoSave — SaaS Convertisseur Vidéo

Téléchargez YouTube, TikTok, Instagram, Twitter en MP3/MP4. Monétisé par AdSense.

## Stack

- **Frontend/API** : Next.js 14 (App Router) + Tailwind CSS
- **File d'attente** : BullMQ + Redis
- **Base de données** : PostgreSQL + Prisma
- **Conversion** : yt-dlp + FFmpeg
- **Monétisation** : Google AdSense (interstitiel avec compte à rebours)

## Structure

```
apps/
  web/      — Next.js (frontend + API routes)
  worker/   — Process BullMQ séparé
packages/
  shared/   — Types TypeScript
  db/       — Prisma client partagé
```

## Démarrage rapide (développement local)

### Prérequis

- Node.js 20+
- Docker & Docker Compose
- yt-dlp (`pip install yt-dlp`)
- FFmpeg

### 1. Variables d'environnement

```bash
cp .env.example .env
# Éditez .env avec vos valeurs
```

### 2. Lancer les services (Redis + PostgreSQL)

```bash
docker-compose up -d postgres redis
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Générer Prisma + migrer la base

```bash
npm run db:generate
npm run db:push
```

### 5. Lancer le dev

```bash
npm run dev
# ou séparément :
# Terminal 1 : npm run dev -w apps/web
# Terminal 2 : npm run dev -w apps/worker
```

L'app est disponible sur **http://localhost:3000**

## Déploiement (Docker Compose)

```bash
cp .env.example .env
# Configurez .env pour la production

docker-compose up -d
# Les migrations se font au démarrage du web service

# Générer les migrations en production :
docker-compose exec web npx prisma migrate deploy
```

## Configuration AdSense

Dans `.env` :

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_INTERSTITIAL=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_HEADER=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=XXXXXXXXXX
```

En développement, des placeholders gris s'affichent à la place des vraies pubs.

## Monétisation — flux publicitaire

1. Utilisateur clique "Télécharger"
2. Modal interstitiel s'affiche avec une pub 300x250
3. Compte à rebours 5 secondes (configurable via `NEXT_PUBLIC_AD_COUNTDOWN_SECONDS`)
4. Le bouton se déverrouille → lancement de la conversion
5. Barre de progression → lien de téléchargement

## Variables d'environnement complètes

| Variable | Défaut | Description |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis URL |
| `JWT_SECRET` | — | Secret pour les tokens de téléchargement |
| `NEXT_PUBLIC_AD_COUNTDOWN_SECONDS` | `5` | Durée du compte à rebours publicitaire |
| `MAX_VIDEO_DURATION_SECONDS` | `3600` | Durée max des vidéos (1h) |
| `DOWNLOAD_EXPIRY_MINUTES` | `30` | Durée de vie des fichiers convertis |
| `TMP_DIR` | `/tmp/downloads` | Dossier de stockage temporaire |

## Notes légales

- Ajoutez de vraies CGU et politique de confidentialité avant de mettre en ligne
- Rédigez une vraie page DMCA avec votre email de contact
- AdSense requiert l'approbation de votre site — en attendant, utilisez **Monetag** ou **Adsterra**
- Hébergez sur un VPS (Hetzner, DigitalOcean) pour avoir accès à yt-dlp et ffmpeg sans restrictions
