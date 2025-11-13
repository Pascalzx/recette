import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export function useRecipes(userId) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setRecipes([])
      setLoading(false)
      return
    }

    fetchRecipes()
  }, [userId])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      setError(null)

      // Récupérer les recettes de l'utilisateur et de sa famille
      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select(`
          *,
          user:profiles(full_name)
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setRecipes(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  const createRecipe = async (recipeData) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipeData])
        .select()
        .single()

      if (error) throw error

      setRecipes([data, ...recipes])
      return data
    } catch (err) {
      console.error('Error creating recipe:', err)
      throw err
    }
  }

  const updateRecipe = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setRecipes(recipes.map(r => r.id === id ? data : r))
      return data
    } catch (err) {
      console.error('Error updating recipe:', err)
      throw err
    }
  }

  const deleteRecipe = async (id) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)

      if (error) throw error

      setRecipes(recipes.filter(r => r.id !== id))
    } catch (err) {
      console.error('Error deleting recipe:', err)
      throw err
    }
  }

  return {
    recipes,
    loading,
    error,
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  }
}
