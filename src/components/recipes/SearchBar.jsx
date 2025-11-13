import { Search } from 'lucide-react'

export function SearchBar({ value, onChange, onCategoryChange, category }) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher une recette, un ingrédient..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            category === ''
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => onCategoryChange('entrée')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            category === 'entrée'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Entrées
        </button>
        <button
          onClick={() => onCategoryChange('plat')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            category === 'plat'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Plats
        </button>
        <button
          onClick={() => onCategoryChange('dessert')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            category === 'dessert'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Desserts
        </button>
      </div>
    </div>
  )
}
