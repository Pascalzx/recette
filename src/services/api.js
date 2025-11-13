import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Récupère le token JWT de l'utilisateur connecté
 */
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

/**
 * Effectue une requête vers l'API backend
 */
async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('Utilisateur non authentifié')
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Erreur lors de la requête')
  }

  return data
}

/**
 * Extrait les informations d'une recette depuis une image via Claude API
 */
export async function extractRecipeFromImage(imageBase64, mediaType = 'image/jpeg') {
  try {
    const response = await apiRequest('/api/ocr/extract', {
      method: 'POST',
      body: JSON.stringify({
        imageBase64,
        mediaType,
      }),
    })

    return response.data
  } catch (error) {
    console.error('Error extracting recipe:', error)
    throw error
  }
}

/**
 * Upload une image vers Supabase Storage via l'API backend
 */
export async function uploadRecipeImage(imageBase64, fileName, contentType = 'image/jpeg') {
  try {
    const response = await apiRequest('/api/upload/image', {
      method: 'POST',
      body: JSON.stringify({
        imageBase64,
        fileName,
        contentType,
      }),
    })

    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

/**
 * Supprime une image de Supabase Storage via l'API backend
 */
export async function deleteRecipeImage(imagePath) {
  try {
    const response = await apiRequest('/api/upload/image', {
      method: 'DELETE',
      body: JSON.stringify({
        path: imagePath,
      }),
    })

    return response
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

/**
 * Vérifie le statut de l'API
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_URL}/health`)
    return await response.json()
  } catch (error) {
    console.error('API health check failed:', error)
    return { status: 'error', error: error.message }
  }
}
