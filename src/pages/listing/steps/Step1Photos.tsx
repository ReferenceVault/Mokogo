import { useState, useRef } from 'react'
import { Listing } from '@/types'

interface Step1PhotosProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
}

const Step1Photos = ({ data, onChange }: Step1PhotosProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photos = data.photos || []

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const maxSize = 5 * 1024 * 1024 // 5MB
    const validFiles: File[] = []
    const errors: string[] = []

    // Validate all files first
    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds 5MB limit`)
        return
      }

      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image`)
        return
      }

      validFiles.push(file)
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
    }

    if (validFiles.length === 0) return

    // Compress and read all valid files
    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const maxWidth = 1200
            const maxHeight = 1200
            let width = img.width
            let height = img.height

            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height
                height = maxHeight
              }
            }

            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              reject(new Error('Could not get canvas context'))
              return
            }
            ctx.drawImage(img, 0, 0, width, height)
            const compressed = canvas.toDataURL('image/jpeg', 0.8)
            resolve(compressed)
          }
          img.onerror = () => reject(new Error('Failed to load image'))
          img.src = e.target?.result as string
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    }

    const readers = validFiles.map((file) => compressImage(file))

    // Wait for all files to be read, then update state once
    Promise.all(readers)
      .then((newPhotoUrls) => {
        const currentPhotos = data.photos || []
        const updatedPhotos = [...currentPhotos, ...newPhotoUrls]
        onChange({ photos: updatedPhotos })
        setError('')
      })
      .catch((error) => {
        setError(error.message || 'Failed to load some images')
      })
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
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {error}
        </div>
      )}

      {photos.length < 3 && (
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
            className="btn-primary text-sm px-4 py-2"
          >
            Choose Photos
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

