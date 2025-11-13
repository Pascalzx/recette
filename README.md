# Recettes Familiales - SaaS de Gestion de Recettes avec OCR

Une application web moderne pour gérer et partager vos recettes familiales avec extraction intelligente par OCR.

## Fonctionnalités

- **Authentification sécurisée** avec Supabase Auth
- **Extraction OCR intelligente** de recettes depuis photos via Claude API
- **Partage familial** - Partagez vos recettes avec les membres de votre famille
- **Recherche avancée** - Recherchez par nom, ingrédients ou catégorie
- **Interface responsive** - Fonctionne sur mobile, tablette et desktop
- **Design épuré** - Interface simple et intuitive pour tous les âges

## Technologies

- **Frontend**: React 18 + Vite
- **Backend API**: Node.js + Express
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **OCR**: Anthropic Claude API
- **Routing**: React Router v6
- **Icons**: Lucide React

## Installation

### Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Clé API Anthropic Claude

### Configuration

#### 1. Cloner le projet

```bash
git clone <votre-repo>
cd recette
```

#### 2. Configurer Supabase

- Créez un projet sur [supabase.com](https://supabase.com)
- **Base de données** : Allez dans SQL Editor et exécutez le contenu de `supabase-schema.sql`
- **Storage** :
  - Créez un bucket nommé `recipe-images` (public)
  - Exécutez les politiques RLS depuis `supabase-storage-setup.sql`
- Récupérez vos clés depuis Settings > API :
  - URL du projet
  - Clé anonyme (`anon/public`)
  - Clé service role (pour le backend uniquement)

#### 3. Configuration du Backend API (Recommandé)

```bash
cd api
npm install
```

Créez un fichier `api/.env` :

```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

ANTHROPIC_API_KEY=your_anthropic_api_key

ALLOWED_ORIGINS=http://localhost:5173
```

**Important** : Utilisez la `SERVICE_ROLE_KEY` pour le backend (pas la clé anonyme).

Lancez le backend :

```bash
npm run dev
```

Le serveur API démarre sur `http://localhost:3001`

Voir [api/README.md](api/README.md) pour plus de détails.

#### 4. Configuration du Frontend

```bash
# Retour à la racine
cd ..
npm install
```

Créez un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# URL du backend API
VITE_API_URL=http://localhost:3001
```

#### 5. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Structure du projet

```
recette/
├── api/                        # Backend API Node.js
│   ├── src/
│   │   ├── controllers/        # Logique métier
│   │   ├── middleware/         # Middlewares Express
│   │   ├── routes/             # Définition des routes
│   │   └── server.js           # Point d'entrée
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── src/                        # Frontend React
│   ├── components/
│   │   ├── auth/               # Composants d'authentification
│   │   ├── layout/             # Layout et navigation
│   │   └── recipes/            # Composants de recettes
│   ├── hooks/                  # Hooks personnalisés
│   ├── pages/                  # Pages de l'application
│   ├── services/               # Services (Supabase, API)
│   │   ├── supabase.js         # Client Supabase
│   │   ├── api.js              # Appels API backend
│   │   └── claude.js           # (Fallback) Appel direct Claude
│   ├── types/                  # Définitions de types
│   └── utils/                  # Utilitaires
├── supabase-schema.sql         # Schéma de base de données
├── supabase-storage-setup.sql  # Configuration Storage
└── README.md
```

## Base de données Supabase

### Tables principales

- **profiles** - Profils utilisateurs
- **families** - Familles
- **family_members** - Membres des familles (table de liaison)
- **recipes** - Recettes

### Row Level Security (RLS)

Toutes les tables sont protégées par des politiques RLS pour garantir que :
- Les utilisateurs ne voient que leurs propres recettes et celles de leur famille
- Les modifications sont limitées aux propriétaires
- Les données familiales sont isolées

## Utilisation

### Créer un compte

1. Cliquez sur "Créer un compte"
2. Entrez votre nom, email et mot de passe
3. Vous serez automatiquement connecté

### Ajouter une recette

**Méthode 1 : Par photo (OCR)**
1. Cliquez sur "Ajouter une recette"
2. Importez une photo de votre recette papier
3. L'IA Claude extrait automatiquement les informations
4. Vérifiez et modifiez si nécessaire
5. Enregistrez

**Méthode 2 : Manuellement**
1. Cliquez sur "Ajouter une recette"
2. Choisissez "saisir manuellement"
3. Remplissez le formulaire
4. Enregistrez

### Rechercher des recettes

- Utilisez la barre de recherche pour trouver par nom ou ingrédient
- Filtrez par catégorie (Entrée, Plat, Dessert)
- Les résultats s'affichent en temps réel

### Partager avec la famille

Les recettes sont automatiquement visibles par tous les membres de votre famille une fois que vous les avez ajoutés au système.

## Notes importantes

### Architecture Backend API

L'application utilise maintenant une architecture backend sécurisée :

**Avantages** :
- Clé API Claude protégée côté serveur
- Upload d'images vers Supabase Storage
- Rate limiting et sécurité renforcée
- Validation des données
- Logs centralisés

**Endpoints** :
- `POST /api/ocr/extract` - Extraction OCR via Claude
- `POST /api/upload/image` - Upload d'image vers Supabase Storage
- `DELETE /api/upload/image` - Suppression d'image

Voir [api/README.md](api/README.md) pour la documentation complète.

### Sécurité

- **Authentification** : Tokens JWT Supabase vérifiés sur chaque requête
- **RLS** : Politiques de sécurité au niveau base de données
- **Rate Limiting** : 100 requêtes/15min par IP
- **Validation** : Images limitées à 5MB
- **CORS** : Origines autorisées uniquement

### Limitations actuelles

- Pas de gestion avancée des familles (invitation, etc.)
- Pas de commentaires sur les recettes
- Pas de système de favoris

## Développement

### Commandes disponibles

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Construire pour la production
npm run preview      # Prévisualiser le build de production
npm run lint         # Linter le code
```

### Améliorations futures

- [ ] Système d'invitation familiale par email
- [ ] Notes et commentaires sur les recettes
- [ ] Favoris et évaluations avec étoiles
- [ ] Export PDF des recettes
- [ ] Mode hors ligne (PWA)
- [ ] Suggestions de recettes par IA
- [ ] Planification de menus hebdomadaires
- [ ] Liste de courses générée depuis les recettes
- [ ] Conversion automatique des unités
- [ ] Support multilingue

## Support

Pour toute question ou problème :
- Consultez la documentation de [Supabase](https://supabase.com/docs)
- Documentation [Claude API](https://docs.anthropic.com)
- Issues GitHub du projet

## Licence

MIT
