import React, { useState } from 'react';

const ProfileImageUpload = ({ 
  currentImage, 
  onImageUpload, 
  onImageRemove, 
  isUploading = false,
  className = "" 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onImageUpload(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove();
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Profile Picture</h3>
        <p className="text-sm text-gray-600 mt-1">Make your profile stand out</p>
      </div>

      <div className="space-y-4">
        {/* Current Profile Image Display */}
        {currentImage && currentImage.url && (
          <div className="text-center">
            <div className="relative inline-block mb-3">
              <img
                src={currentImage.url}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-3 border-blue-200 shadow-lg"
              />
              {onImageRemove && (
                <button
                  onClick={handleRemove}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove profile image"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Photo uploaded on {new Date(currentImage.uploadedAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => document.getElementById('profile-image-input').click()}
              disabled={isUploading}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Change Photo
            </button>
          </div>
        )}

        {/* File Selection - Only show when no current image */}
        {!currentImage?.url && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Upload a professional photo
            </p>
            <label className="cursor-pointer inline-block w-full">
              <input
                id="profile-image-input"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <span className={`inline-flex items-center justify-center w-full px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose Image
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              JPEG, PNG, GIF, WebP • Max 5MB
            </p>
          </div>
        )}

        {/* File Preview and Upload */}
        {selectedFile && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-center mb-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover border-2 border-green-300 mx-auto mb-2"
              />
              <p className="text-sm font-medium text-gray-900 mb-1">{selectedFile.name}</p>
              <p className="text-xs text-gray-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Upload Photo'
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="w-full px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-blue-700">Uploading...</span>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">💡 Tips:</p>
            <ul className="space-y-0.5 text-yellow-700">
              <li>• Clear, professional photo</li>
              <li>• Good lighting</li>
              <li>• Face clearly visible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
