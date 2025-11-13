import express from 'express'
import { authenticateUser } from '../middleware/auth.js'
import { extractRecipe } from '../controllers/ocrController.js'

const router = express.Router()

/**
 * POST /api/ocr/extract
 * Extrait les informations d'une recette depuis une image
 *
 * Body:
 * - imageBase64: string (required) - Image encodée en base64
 * - mediaType: string (optional) - Type MIME de l'image (default: image/jpeg)
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
router.post('/extract', authenticateUser, extractRecipe)

export default router
