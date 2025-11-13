import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { supabase } from '../services/supabase'
import { Clock, ChefHat, User, Trash2, Edit, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

export function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          user:profiles(full_name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setRecipe(data)
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)

      if (error) throw error

      navigate('/')
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Erreur lors de la suppression de la recette')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </Layout>
    )
  }

  if (!recipe) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Recette non trouvée</p>
        </div>
      </Layout>
    )
  }

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0)
  const isOwner = user?.id === recipe.user_id

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour aux recettes
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <ChefHat className="h-24 w-24 text-primary-400" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {recipe.name}
                </h1>

                {recipe.user?.full_name && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Par {recipe.user.full_name}</span>
                  </div>
                )}
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/recipes/${id}/edit`)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                    title="Modifier"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200">
              {totalTime > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5" />
                  <div className="text-sm">
                    <span className="font-medium">{totalTime} min</span>
                    {recipe.prep_time > 0 && recipe.cook_time > 0 && (
                      <span className="text-gray-500 ml-1">
                        ({recipe.prep_time} + {recipe.cook_time})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {recipe.category && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {recipe.category}
                </span>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ingrédients
              </h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-gray-700">
                      <span className="font-medium">{ingredient.quantity}</span>
                      {' '}
                      {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Préparation
              </h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
