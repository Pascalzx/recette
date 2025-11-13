import express from 'express'
import { authenticateUser } from '../middleware/auth.js'
import { uploadImage, deleteImage } from '../controllers/uploadController.js'

const router = express.Router()

/**
 * POST /api/upload/image
 * Upload une image vers Supabase Storage
 *
 * Body:
 * - imageBase64: string (required) - Image encodée en base64
 * - fileName: string (optional) - Nom du fichier
 * - contentType: string (optional) - Type MIME (default: image/jpeg)
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
router.post('/image', authenticateUser, uploadImage)

/**
 * DELETE /api/upload/image
 * Supprime une image de Supabase Storage
 *
 * Body:
 * - path: string (required) - Chemin de l'image dans le storage
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
router.delete('/image', authenticateUser, deleteImage)

export default router
