# Guide de démarrage rapide

Ce guide vous permet de lancer rapidement l'application en local.

## Prérequis

- Node.js 18+
- Un compte Supabase (gratuit)
- Une clé API Anthropic Claude

## Étapes de configuration

### 1. Configuration Supabase (5 minutes)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. **Base de données** :
   - Allez dans SQL Editor
   - Copiez-collez le contenu de `supabase-schema.sql`
   - Exécutez le script
4. **Storage** :
   - Allez dans Storage
   - Créez un nouveau bucket nommé `recipe-images`
   - Cochez "Public bucket"
   - Allez dans SQL Editor
   - Copiez-collez le contenu de `supabase-storage-setup.sql`
   - Exécutez le script
5. **Récupérez vos clés** :
   - Allez dans Settings > API
   - Notez :
     - Project URL
     - `anon` public key (pour le frontend)
     - `service_role` key (pour le backend)

### 2. Configuration du Backend

```bash
# Aller dans le dossier API
cd api

# Installer les dépendances
npm install

# Créer le fichier .env
cat > .env << 'EOF'
PORT=3001
NODE_ENV=development

SUPABASE_URL=VOTRE_URL_SUPABASE
SUPABASE_SERVICE_ROLE_KEY=VOTRE_SERVICE_ROLE_KEY

ANTHROPIC_API_KEY=VOTRE_CLE_CLAUDE

ALLOWED_ORIGINS=http://localhost:5173
EOF

# Éditer le fichier .env et remplacer les valeurs
nano .env  # ou votre éditeur préféré

# Lancer le serveur
npm run dev
```

Le backend devrait maintenant tourner sur `http://localhost:3001`

### 3. Configuration du Frontend

Ouvrez un nouveau terminal :

```bash
# Retour à la racine
cd ..

# Installer les dépendances
npm install

# Créer le fichier .env
cat > .env << 'EOF'
VITE_SUPABASE_URL=VOTRE_URL_SUPABASE
VITE_SUPABASE_ANON_KEY=VOTRE_CLE_ANON

VITE_API_URL=http://localhost:3001
EOF

# Éditer le fichier .env et remplacer les valeurs
nano .env  # ou votre éditeur préféré

# Lancer l'application
npm run dev
```

L'application devrait s'ouvrir sur `http://localhost:5173`

## Test rapide

1. Créez un compte depuis l'interface
2. Essayez d'ajouter une recette manuellement
3. Testez l'OCR avec une photo de recette

## Dépannage

### Le backend ne démarre pas

- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que le port 3001 n'est pas déjà utilisé
- Consultez les logs dans le terminal

### L'upload d'image échoue

- Vérifiez que le bucket `recipe-images` existe et est public
- Vérifiez que les politiques RLS sont bien configurées
- Vérifiez que la `SERVICE_ROLE_KEY` est correcte

### L'OCR ne fonctionne pas

- Vérifiez que votre clé API Anthropic est valide
- Vérifiez que le backend est bien lancé
- Consultez les logs du backend pour voir les erreurs

### Erreur de CORS

- Vérifiez que `ALLOWED_ORIGINS` dans le backend contient l'URL du frontend
- Vérifiez que `VITE_API_URL` dans le frontend pointe vers le backend

## Commandes utiles

```bash
# Frontend (depuis la racine)
npm run dev          # Développement
npm run build        # Build production
npm run preview      # Prévisualiser le build

# Backend (depuis api/)
npm run dev          # Développement avec auto-reload
npm start            # Production
```

## Prochaines étapes

- Consultez le [README.md](README.md) pour plus de détails
- Consultez [api/README.md](api/README.md) pour la doc du backend
- Explorez le code dans `src/` et `api/src/`

## Support

En cas de problème :
- Vérifiez les logs dans les terminaux
- Consultez la documentation Supabase : https://supabase.com/docs
- Consultez la documentation Claude : https://docs.anthropic.com
