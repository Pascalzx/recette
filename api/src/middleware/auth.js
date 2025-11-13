import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Middleware pour vérifier le token JWT Supabase
 */
export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' })
    }

    const token = authHeader.substring(7)

    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Token invalide ou expiré' })
    }

    // Attacher l'utilisateur à la requête
    req.user = user
    next()
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ error: 'Erreur lors de l\'authentification' })
  }
}
