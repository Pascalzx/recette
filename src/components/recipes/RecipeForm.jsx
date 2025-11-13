import { useState } from 'react'
import { X, Plus } from 'lucide-react'

export function RecipeForm({ initialData, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'autre',
    prep_time: initialData?.prep_time || '',
    cook_time: initialData?.cook_time || '',
    ingredients: initialData?.ingredients || [{ name: '', quantity: '' }],
    steps: initialData?.steps || [''],
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    // Filter out empty ingredients and steps
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(i => i.name.trim() && i.quantity.trim()),
      steps: formData.steps.filter(s => s.trim()),
      prep_time: parseInt(formData.prep_time) || null,
      cook_time: parseInt(formData.cook_time) || null,
    }

    onSubmit(cleanedData)
  }

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }]
    })
  }

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index][field] = value
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    })
  }

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, '']
    })
  }

  const updateStep = (index, value) => {
    const newSteps = [...formData.steps]
    newSteps[index] = value
    setFormData({ ...formData, steps: newSteps })
  }

  const removeStep = (index) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom de la recette *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          placeholder="Tarte aux pommes de grand-mère"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-field"
          >
            <option value="entrée">Entrée</option>
            <option value="plat">Plat</option>
            <option value="dessert">Dessert</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temps de préparation (min)
          </label>
          <input
            type="number"
            min="0"
            value={formData.prep_time}
            onChange={(e) => setFormData({ ...formData, prep_time: e.target.value })}
            className="input-field"
            placeholder="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temps de cuisson (min)
          </label>
          <input
            type="number"
            min="0"
            value={formData.cook_time}
            onChange={(e) => setFormData({ ...formData, cook_time: e.target.value })}
            className="input-field"
            placeholder="45"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Ingrédients *
          </label>
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                required
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                className="input-field flex-1"
                placeholder="Ingrédient"
              />
              <input
                type="text"
                required
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                className="input-field w-32"
                placeholder="Quantité"
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Étapes de préparation *
          </label>
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        <div className="space-y-2">
          {formData.steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                {index + 1}.
              </div>
              <textarea
                required
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                className="input-field flex-1 min-h-[40px]"
                placeholder="Décrivez cette étape..."
                rows={2}
              />
              {formData.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg h-10"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer la recette'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}
