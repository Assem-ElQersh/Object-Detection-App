import React, { useRef, useState } from 'react';
import { FILE_UPLOAD_CONSTRAINTS } from '../utils/constants';

const ImageUploader = ({ onImageUpload, disabled }) => {
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    // Check file type
    const validTypes = FILE_UPLOAD_CONSTRAINTS.acceptedTypes.split(', ');
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      fileInputRef.current.value = '';
      return;
    }
    
    // Check file size
    const maxSizeBytes = FILE_UPLOAD_CONSTRAINTS.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Image size should be less than ${FILE_UPLOAD_CONSTRAINTS.maxSizeMB}MB`);
      fileInputRef.current.value = '';
      return;
    }
    
    // Clear previous errors
    setError(null);
    
    // Create image object
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        onImageUpload(img);
      };
      img.onerror = () => {
        setError('Failed to load image. Please try another file.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        type="file"
        accept={FILE_UPLOAD_CONSTRAINTS.acceptedTypes}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        disabled={disabled}
      />
      
      {/* Upload button */}
      <button
        onClick={handleUploadClick}
        className={`px-4 py-2 rounded font-medium ${
          disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        disabled={disabled}
      >
        Upload Image
      </button>
      
      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
