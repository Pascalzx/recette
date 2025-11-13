import { Link } from 'react-router-dom'
import { Clock, ChefHat, User } from 'lucide-react'

export function RecipeCard({ recipe }) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0)

  return (
    <Link to={`/recipes/${recipe.id}`} className="block">
      <div className="card overflow-hidden h-full flex flex-col">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <ChefHat className="h-16 w-16 text-primary-400" />
          </div>
        )}

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {recipe.name}
          </h3>

          <div className="flex items-center gap-4 text-sm text-gray-600 mt-auto">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{totalTime} min</span>
              </div>
            )}

            {recipe.category && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                {recipe.category}
              </span>
            )}
          </div>

          {recipe.user?.full_name && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
              <User className="h-3 w-3" />
              <span>{recipe.user.full_name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
