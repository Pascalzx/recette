import { Link, useNavigate } from 'react-router-dom'
import { ChefHat, LogOut, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Recettes Familiales</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              <Link
                to="/recipes/new"
                className="btn-primary text-sm"
              >
                Ajouter une recette
              </Link>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
