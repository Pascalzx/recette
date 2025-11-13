# Recette API - Backend

API backend pour l'application de gestion de recettes familiales. Gère l'extraction OCR via Claude API et l'upload d'images vers Supabase Storage.

## Installation

```bash
cd api
npm install
```

## Configuration

Créez un fichier `.env` à partir de `.env.example` :

```env
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Important** : Utilisez la clé `SUPABASE_SERVICE_ROLE_KEY` (pas la clé anonyme) pour le backend.

## Supabase Storage Configuration

### 1. Créer le bucket

Dans votre projet Supabase, allez dans Storage et créez un nouveau bucket :
- Nom : `recipe-images`
- Public : Oui (pour permettre l'accès aux images)

### 2. Configurer les politiques RLS

Exécutez ce SQL dans l'éditeur SQL de Supabase :

```sql
-- Politique pour permettre aux utilisateurs d'uploader leurs propres images
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'recipe-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique pour permettre aux utilisateurs de lire toutes les images
CREATE POLICY "Anyone can view recipe images"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');

-- Politique pour permettre aux utilisateurs de supprimer leurs propres images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'recipe-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Démarrage

### Développement (avec auto-reload)

```bash
npm run dev
```

### Production

```bash
npm start
```

Le serveur démarre sur `http://localhost:3001` par défaut.

## Endpoints

### Health Check

```http
GET /health
```

Réponse :
```json
{
  "status": "ok",
  "timestamp": "2025-11-13T21:00:00.000Z"
}
```

### Extraction OCR

```http
POST /api/ocr/extract
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json

{
  "imageBase64": "base64_encoded_image",
  "mediaType": "image/jpeg"
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "name": "Tarte aux pommes",
    "ingredients": [
      {"name": "pommes", "quantity": "4"},
      {"name": "sucre", "quantity": "100g"}
    ],
    "steps": ["Éplucher les pommes", "..."],
    "prep_time": 30,
    "cook_time": 45,
    "category": "dessert"
  }
}
```

### Upload d'image

```http
POST /api/upload/image
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json

{
  "imageBase64": "base64_encoded_image",
  "fileName": "recipe.jpg",
  "contentType": "image/jpeg"
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "path": "user-id/hash-recipe.jpg",
    "url": "https://your-project.supabase.co/storage/v1/object/public/recipe-images/..."
  }
}
```

### Suppression d'image

```http
DELETE /api/upload/image
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json

{
  "path": "user-id/hash-recipe.jpg"
}
```

Réponse :
```json
{
  "success": true,
  "message": "Image supprimée avec succès"
}
```

## Sécurité

### Authentification

Tous les endpoints (sauf `/health`) nécessitent un token JWT Supabase valide dans le header `Authorization`.

Le token est vérifié via le middleware `authenticateUser` qui :
1. Extrait le token du header Authorization
2. Vérifie sa validité avec Supabase
3. Attache l'utilisateur à `req.user`

### Rate Limiting

L'API implémente un rate limiting global :
- 100 requêtes par 15 minutes par IP
- Configurable dans `server.js`

### Validation des données

- Les images sont limitées à 5MB
- Les formats base64 sont validés
- Les chemins de fichiers sont vérifiés pour éviter les accès non autorisés

### CORS

Le CORS est configuré pour accepter uniquement les origines définies dans `ALLOWED_ORIGINS`.

## Architecture

```
api/
├── src/
│   ├── controllers/       # Logique métier
│   │   ├── ocrController.js
│   │   └── uploadController.js
│   ├── middleware/        # Middlewares Express
│   │   └── auth.js
│   ├── routes/            # Définition des routes
│   │   ├── ocr.js
│   │   └── upload.js
│   └── server.js          # Point d'entrée
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Erreurs courantes

### 401 Unauthorized

- Vérifiez que le token JWT est valide
- Vérifiez que le token n'est pas expiré
- Vérifiez que le header `Authorization` est bien formaté : `Bearer <token>`

### 500 Internal Server Error

- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez les logs du serveur pour plus de détails
- En développement, les détails de l'erreur sont inclus dans la réponse

### Image trop volumineuse

- La taille maximale est de 5MB
- Compressez l'image avant l'upload
- Utilisez un format optimisé (JPEG avec compression)

## Déploiement

### Variables d'environnement

Assurez-vous de définir toutes les variables d'environnement sur votre plateforme de déploiement :
- `PORT`
- `NODE_ENV=production`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `ALLOWED_ORIGINS`

### Recommandations

1. **Utilisez HTTPS** en production
2. **Configurez des logs** appropriés (Winston, Pino, etc.)
3. **Ajoutez une surveillance** (Sentry, DataDog, etc.)
4. **Configurez des backups** pour Supabase
5. **Mettez en place un CDN** pour les images (Supabase Storage supporte nativement)

## Développement

### Ajouter un nouveau endpoint

1. Créer le controller dans `src/controllers/`
2. Créer la route dans `src/routes/`
3. Importer la route dans `src/server.js`
4. Documenter l'endpoint dans ce README

### Tests

```bash
# À implémenter
npm test
```

## Support

Pour toute question :
- Documentation Supabase : https://supabase.com/docs
- Documentation Claude API : https://docs.anthropic.com
- Documentation Express : https://expressjs.com

## Licence

MIT
