import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Extrait les informations d'une recette depuis une image
 */
export async function extractRecipe(req, res) {
  try {
    const { imageBase64, mediaType = 'image/jpeg' } = req.body

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 requise' })
    }

    // Valider le format base64
    if (!imageBase64.match(/^[A-Za-z0-9+/]+={0,2}$/)) {
      return res.status(400).json({ error: 'Format base64 invalide' })
    }

    console.log(`[OCR] Extraction de recette pour l'utilisateur ${req.user.id}`)

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Analyse cette image de recette et extrais les informations suivantes au format JSON strict :
{
  "name": "nom de la recette",
  "ingredients": [
    {"name": "ingrédient", "quantity": "quantité avec unité"}
  ],
  "steps": ["étape 1", "étape 2", ...],
  "prep_time": "temps en minutes (nombre uniquement)",
  "cook_time": "temps en minutes (nombre uniquement)",
  "category": "entrée|plat|dessert|autre"
}

Règles importantes :
- Retourne UNIQUEMENT le JSON, sans texte additionnel
- Si une information n'est pas visible, utilise null
- Les temps doivent être des nombres (pas de texte)
- La catégorie doit être l'une des valeurs listées
- Les étapes doivent être dans l'ordre de préparation`
            }
          ]
        }
      ]
    })

    const content = message.content[0].text

    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error('Impossible de trouver le JSON dans la réponse')
    }

    const jsonString = jsonMatch[1] || jsonMatch[0]
    const recipeData = JSON.parse(jsonString.trim())

    // Valider les données
    if (!recipeData.name || !recipeData.ingredients || !recipeData.steps) {
      throw new Error('Données de recette incomplètes')
    }

    // Normaliser les données
    const normalizedData = {
      name: recipeData.name,
      ingredients: recipeData.ingredients || [],
      steps: recipeData.steps || [],
      prep_time: recipeData.prep_time ? parseInt(recipeData.prep_time) : null,
      cook_time: recipeData.cook_time ? parseInt(recipeData.cook_time) : null,
      category: ['entrée', 'plat', 'dessert', 'autre'].includes(recipeData.category)
        ? recipeData.category
        : 'autre'
    }

    console.log(`[OCR] Extraction réussie: ${normalizedData.name}`)

    res.json({
      success: true,
      data: normalizedData
    })

  } catch (error) {
    console.error('[OCR] Error:', error)

    if (error instanceof SyntaxError) {
      return res.status(422).json({
        error: 'Impossible de parser les données de la recette',
        details: error.message
      })
    }

    res.status(500).json({
      error: 'Erreur lors de l\'extraction de la recette',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
