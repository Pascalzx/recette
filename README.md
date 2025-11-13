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
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **OCR**: Anthropic Claude API
- **Routing**: React Router v6
- **Icons**: Lucide React

## Installation

### Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Clé API Anthropic Claude

### Configuration

1. **Cloner le projet**

```bash
git clone <votre-repo>
cd recette
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer Supabase**

   - Créez un projet sur [supabase.com](https://supabase.com)
   - Allez dans SQL Editor et exécutez le contenu de `supabase-schema.sql`
   - Récupérez votre URL et clé anonyme depuis Settings > API

4. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
VITE_ANTHROPIC_API_KEY=votre_cle_api_claude
```

5. **Lancer l'application**

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Structure du projet

```
recette/
├── src/
│   ├── components/
│   │   ├── auth/          # Composants d'authentification
│   │   ├── layout/        # Layout et navigation
│   │   └── recipes/       # Composants de recettes
│   ├── hooks/             # Hooks personnalisés
│   ├── pages/             # Pages de l'application
│   ├── services/          # Services (Supabase, Claude API)
│   ├── types/             # Définitions de types
│   └── utils/             # Utilitaires
├── supabase-schema.sql    # Schéma de base de données
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

### Sécurité

- **En production** : Ne jamais exposer les clés API côté client
- Utilisez un backend pour les appels à Claude API
- Les clés dans `.env` ne doivent jamais être commitées

### Upload d'images

Dans cette version de démonstration, les images sont stockées en base64. Pour la production :
- Utilisez Supabase Storage
- Optimisez les images avant upload
- Implémentez des limites de taille

### Limitations actuelles

- Pas de gestion avancée des familles (invitation, etc.)
- Upload d'images en base64 (non optimisé pour production)
- Claude API appelée depuis le frontend (devrait être backend)

## Développement

### Commandes disponibles

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Construire pour la production
npm run preview      # Prévisualiser le build de production
npm run lint         # Linter le code
```

### Améliorations futures

- [ ] Système d'invitation familiale
- [ ] Upload d'images vers Supabase Storage
- [ ] Backend API pour Claude (sécurité)
- [ ] Notes et commentaires sur les recettes
- [ ] Favoris et évaluations
- [ ] Export PDF des recettes
- [ ] Mode hors ligne (PWA)
- [ ] Suggestions de recettes par IA

## Support

Pour toute question ou problème :
- Consultez la documentation de [Supabase](https://supabase.com/docs)
- Documentation [Claude API](https://docs.anthropic.com)
- Issues GitHub du projet

## Licence

MIT
