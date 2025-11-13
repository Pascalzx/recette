import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { RecipeForm } from '../components/recipes/RecipeForm'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../services/supabase'
import { extractRecipeFromImage, uploadRecipeImage } from '../services/api'
import { Camera, Upload, Loader2, ArrowLeft } from 'lucide-react'

export function AddRecipePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setExtracting(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Convert to base64 for API
      const base64Reader = new FileReader()
      base64Reader.onloadend = async () => {
        const base64String = base64Reader.result.split(',')[1]
        const mediaType = file.type || 'image/jpeg'

        try {
          // Extract recipe via API
          const data = await extractRecipeFromImage(base64String, mediaType)
          setExtractedData(data)

          // Upload image to Supabase Storage via API
          const uploadResult = await uploadRecipeImage(base64String, file.name, mediaType)
          setUploadedImageUrl(uploadResult.url)
        } catch (error) {
          alert('Erreur lors de l\'extraction de la recette. Veuillez réessayer.')
          console.error(error)
          setImagePreview(null)
          setUploadedImageUrl(null)
        } finally {
          setExtracting(false)
        }
      }
      base64Reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      setExtracting(false)
    }
  }

  const handleSubmit = async (formData) => {
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([
          {
            ...formData,
            user_id: user.id,
            image_url: uploadedImageUrl || null,
          }
        ])
        .select()
        .single()

      if (error) throw error

      navigate(`/recipes/${data.id}`)
    } catch (error) {
      console.error('Error creating recipe:', error)
      alert('Erreur lors de la création de la recette')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Ajouter une recette
          </h1>

          {!extractedData ? (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {extracting ? (
                  <div className="py-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Extraction de la recette en cours...
                    </p>
                  </div>
                ) : imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg mb-4"
                    />
                  </div>
                ) : (
                  <div>
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Prendre une photo ou importer
                    </h3>
                    <p className="text-gray-500 mb-6">
                      L'IA extraira automatiquement les informations de votre recette
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5" />
                      Choisir une image
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    ou saisir manuellement
                  </span>
                </div>
              </div>

              <RecipeForm
                onSubmit={handleSubmit}
                onCancel={() => navigate('/')}
                loading={loading}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Recette extraite avec succès ! Vérifiez et modifiez si nécessaire.
                </p>
              </div>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
              )}

              <RecipeForm
                initialData={extractedData}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setExtractedData(null)
                  setImagePreview(null)
                  setUploadedImageUrl(null)
                }}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
