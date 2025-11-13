import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Upload une image vers Supabase Storage
 */
export async function uploadImage(req, res) {
  try {
    const { imageBase64, fileName, contentType = 'image/jpeg' } = req.body

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 requise' })
    }

    // Valider la taille (max 5MB)
    const sizeInBytes = (imageBase64.length * 3) / 4
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (sizeInBytes > maxSize) {
      return res.status(400).json({
        error: 'Image trop volumineuse',
        maxSize: '5MB',
        currentSize: `${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`
      })
    }

    // Générer un nom de fichier unique
    const fileExt = contentType.split('/')[1] || 'jpg'
    const hash = crypto.randomBytes(16).toString('hex')
    const uniqueFileName = fileName
      ? `${hash}-${fileName}`
      : `${hash}-${Date.now()}.${fileExt}`

    // Convertir base64 en Buffer
    const buffer = Buffer.from(imageBase64, 'base64')

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(`${req.user.id}/${uniqueFileName}`, buffer, {
        contentType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('[Upload] Supabase error:', error)
      throw error
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path)

    console.log(`[Upload] Image uploadée: ${publicUrl}`)

    res.json({
      success: true,
      data: {
        path: data.path,
        url: publicUrl
      }
    })

  } catch (error) {
    console.error('[Upload] Error:', error)

    res.status(500).json({
      error: 'Erreur lors de l\'upload de l\'image',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

/**
 * Supprime une image de Supabase Storage
 */
export async function deleteImage(req, res) {
  try {
    const { path } = req.body

    if (!path) {
      return res.status(400).json({ error: 'Chemin de l\'image requis' })
    }

    // Vérifier que l'utilisateur est propriétaire de l'image
    if (!path.startsWith(req.user.id)) {
      return res.status(403).json({ error: 'Non autorisé à supprimer cette image' })
    }

    const { error } = await supabase.storage
      .from('recipe-images')
      .remove([path])

    if (error) {
      throw error
    }

    console.log(`[Upload] Image supprimée: ${path}`)

    res.json({
      success: true,
      message: 'Image supprimée avec succès'
    })

  } catch (error) {
    console.error('[Upload] Delete error:', error)

    res.status(500).json({
      error: 'Erreur lors de la suppression de l\'image',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
