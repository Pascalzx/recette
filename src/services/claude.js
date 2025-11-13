import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // Note: En production, utilisez un backend
})

export async function extractRecipeFromImage(imageBase64) {
  try {
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
                media_type: "image/jpeg",
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

Retourne UNIQUEMENT le JSON, sans texte additionnel. Si une information n'est pas visible, utilise null.`
            }
          ]
        }
      ]
    })

    const content = message.content[0].text
    // Extract JSON from potential markdown code blocks
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/)
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content

    return JSON.parse(jsonString.trim())
  } catch (error) {
    console.error('Error extracting recipe:', error)
    throw new Error('Impossible d\'extraire la recette de l\'image')
  }
}
