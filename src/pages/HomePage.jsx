import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRecipes } from '../hooks/useRecipes'
import { Layout } from '../components/layout/Layout'
import { RecipeCard } from '../components/recipes/RecipeCard'
import { SearchBar } from '../components/recipes/SearchBar'
import { Loader2 } from 'lucide-react'

export function HomePage() {
  const { user } = useAuth()
  const { recipes, loading } = useRecipes(user?.id)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing =>
          ing.name.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesCategory = !categoryFilter || recipe.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [recipes, searchQuery, categoryFilter])

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mes Recettes Familiales
          </h1>
          <p className="mt-2 text-gray-600">
            Découvrez et partagez vos recettes préférées
          </p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {recipes.length === 0
                ? "Aucune recette pour le moment. Commencez par en ajouter une !"
                : "Aucune recette ne correspond à votre recherche."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
