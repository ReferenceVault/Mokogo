import { useState, useRef, useEffect } from 'react'
import { Listing } from '@/types'
import { uploadApi } from '@/services/api'

interface Step1PhotosProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
  onClearError?: () => void
}

const Step1Photos = ({ data, onChange, error: stepError, onClearError }: Step1PhotosProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photos = data.photos || []

  // Clear step error when photos are valid (>= 3)
  useEffect(() => {
    if (photos.length >= 3 && stepError && onClearError) {
      onClearError()
    }
  }, [photos.length, stepError, onClearError])

  const handleFiles = async (files: FileList | null) => {
    if (!files) return

    const maxSize = 5 * 1024 * 1024 // 5MB
    const validFiles: File[] = []
    const errors: string[] = []

    // Validate all files first
    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
        errors.push(`"${file.name}" is too large (${fileSizeMB}MB). Please upload files smaller than 5MB each.`)
        return
      }

      if (!file.type.startsWith('image/')) {
        errors.push(`"${file.name}" is not a valid image file. Please upload JPEG, PNG, or WebP images only.`)
        return
      }

      validFiles.push(file)
    })

    if (errors.length > 0) {
      // Format error message nicely
      if (errors.length === 1) {
        setError(errors[0])
      } else {
        setError(`Multiple files have issues:\n${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`)
      }
      return
    }

    if (validFiles.length === 0) return

    // Upload files to S3
    setUploading(true)
    setError('')

    try {
      const urls = await uploadApi.uploadPhotos(validFiles)
      const currentPhotos = data.photos || []
      const updatedPhotos = [...currentPhotos, ...urls]
      onChange({ photos: updatedPhotos })
      setError('')
    } catch (error: any) {
      // Extract user-friendly error message from various error formats
      let errorMessage = 'Failed to upload photos. Please try again.'
      
      // Handle network errors or nginx-level errors (no response)
      if (!error.response) {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          errorMessage = 'Upload timed out. The file might be too large. Please try smaller files or check your internet connection.'
        } else if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.'
        } else {
          errorMessage = 'Unable to upload files. Please check your internet connection and try again.'
        }
      } else if (error.response) {
        // Handle HTTP response errors
        const status = error.response.status
        const responseData = error.response.data
        
        // Handle 413 Payload Too Large (from nginx or backend)
        if (status === 413) {
          errorMessage = 'File size is too large. Please upload files smaller than 5MB each. If the problem persists, the server may have size restrictions.'
        } 
        // Handle 400 Bad Request
        else if (status === 400) {
          if (responseData) {
            if (typeof responseData === 'string') {
              errorMessage = responseData
            } else if (responseData?.message) {
              errorMessage = Array.isArray(responseData.message) 
                ? responseData.message.join(', ')
                : responseData.message
            } else if (responseData?.error) {
              errorMessage = responseData.error
            } else {
              errorMessage = 'Invalid file. Please check file size and format.'
            }
          } else {
            errorMessage = 'Invalid file. Please check file size and format.'
          }
        }
        // Handle 500+ server errors
        else if (status >= 500) {
          errorMessage = 'Server error occurred. Please try again in a moment.'
        }
        // Handle other errors with response data
        else {
          if (typeof responseData === 'string') {
            errorMessage = responseData
          } else if (responseData?.message) {
            errorMessage = Array.isArray(responseData.message) 
              ? responseData.message.join(', ')
              : responseData.message
          } else if (responseData?.error) {
            errorMessage = responseData.error
          }
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removePhoto = (index: number) => {
    const currentPhotos = data.photos || []
    const updated = currentPhotos.filter((_, i) => i !== index)
    onChange({ photos: updated })
  }

  const reorderPhoto = (fromIndex: number, toIndex: number) => {
    const currentPhotos = data.photos || []
    const updated = [...currentPhotos]
    const [removed] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, removed)
    onChange({ photos: updated })
  }

  const tips = ['Room', 'Hall', 'Bathroom', 'Kitchen', 'Society gate']

  return (
    <div>
      <h2 className="text-[1.2375rem] font-semibold text-gray-900 mb-1">Photos</h2>
      <p className="text-[0.825rem] text-gray-600 mb-4">Add photos of your space</p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-red-800 whitespace-pre-line">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError('')}
              className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {stepError && photos.length < 3 && (
        <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-[0.825rem]">
          {stepError}
        </div>
      )}
      
      {!stepError && photos.length < 3 && (
        <div className="mb-3 p-2 bg-mokogo-info-bg border border-mokogo-info-border rounded-lg text-mokogo-info-text text-[0.825rem]">
          Please add at least 3 photos to continue ({photos.length}/3)
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-mokogo-primary bg-mokogo-info-bg'
            : 'border-mokogo-gray bg-gray-50 hover:border-mokogo-primary hover:bg-mokogo-info-bg/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-mokogo-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[0.9625rem] text-gray-900 font-medium mb-0.5">
              Drag photos here or click to upload
            </p>
            <p className="text-[0.825rem] text-gray-600">Maximum 5 MB per photo</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Choose Photos'}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4">
        <p className="text-[0.825rem] font-medium text-gray-700 mb-1.5">Photo tips:</p>
        <div className="flex flex-wrap gap-1.5">
          {tips.map((tip) => (
            <span
              key={tip}
              className="px-2 py-0.5 bg-mokogo-gray rounded-full text-[0.825rem] text-gray-700"
            >
              {tip}
            </span>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="mt-5">
          <p className="text-[0.9625rem] font-semibold text-gray-900 mb-3">
            Uploaded Photos ({photos.length})
          </p>
          <div className="flex flex-wrap gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative group flex-shrink-0">
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-mokogo-gray">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 rounded-lg">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => reorderPhoto(index, index - 1)}
                      className="text-white p-1.5 hover:bg-white/20 rounded"
                      title="Move left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="text-white p-1.5 hover:bg-white/20 rounded"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  {index < photos.length - 1 && (
                    <button
                      type="button"
                      onClick={() => reorderPhoto(index, index + 1)}
                      className="text-white p-1.5 hover:bg-white/20 rounded"
                      title="Move right"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
                {index === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-mokogo-primary text-white text-[0.825rem] font-semibold px-2 py-0.5 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Step1Photos

