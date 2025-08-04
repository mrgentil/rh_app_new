import React, { useState, useRef } from 'react';
import { FaCamera, FaTrash, FaUpload } from 'react-icons/fa';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (photoUrl: string) => void;
  employeeName?: string;
  disabled?: boolean;
}

export default function PhotoUpload({ 
  currentPhotoUrl, 
  onPhotoChange, 
  employeeName = "l'employé",
  disabled = false 
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Définir une taille maximale pour l'image
        const maxWidth = 200;
        const maxHeight = 200;
        
        let { width, height } = img;
        
        // Redimensionner si nécessaire
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir en base64 avec compression plus forte
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
        
        // Vérifier la taille
        if (compressedDataUrl.length > 500000) { // ~500KB
          console.warn('Image encore trop grande, compression supplémentaire...');
          const extraCompressed = canvas.toDataURL('image/jpeg', 0.3);
          resolve(extraCompressed);
        } else {
          resolve(compressedDataUrl);
        }
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Compresser l'image
      const compressedImage = await compressImage(file);
      setPreviewUrl(compressedImage);
      onPhotoChange(compressedImage);
    } catch (error) {
      console.error('Erreur lors de la compression de l\'image:', error);
      alert('Erreur lors du traitement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onPhotoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Photo actuelle */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`Photo de ${employeeName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <FaCamera className="text-3xl mb-2" />
              <span className="text-xs text-center">Aucune photo</span>
            </div>
          )}
        </div>
        
        {/* Indicateur de chargement */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={disabled || isUploading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaUpload className="text-sm" />
          <span>Changer la photo</span>
        </button>

        {previewUrl && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            disabled={disabled || isUploading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaTrash className="text-sm" />
            <span>Supprimer</span>
          </button>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Informations */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        <p>Formats acceptés : JPG, PNG, GIF</p>
        <p>Taille maximale : 5MB</p>
        <p>L'image sera automatiquement compressée</p>
      </div>
    </div>
  );
} 