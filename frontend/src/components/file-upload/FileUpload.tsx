import React, { useState, useRef } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  acceptedTypes = ['.pdf', '.docx', '.xlsx', '.eml'],
  maxSize = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    
    // File type validation
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Desteklenmeyen dosya türü. Kabul edilen türler: ${acceptedTypes.join(', ')}`);
      return;
    }

    // File size validation
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`Dosya boyutu çok büyük. Maksimum ${maxSize}MB`);
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(file);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Reset after success
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Dosya yükleme başarısız');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-dropzone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isUploading ? handleBrowseClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="upload-progress">
            <div className="progress-circle">
              <svg width="60" height="60">
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="4"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  fill="none"
                  stroke="#007bff"
                  strokeWidth="4"
                  strokeDasharray={`${uploadProgress * 1.57} 157`}
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                />
              </svg>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
            <p>Dosya yükleniyor...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <h3>Dosya Yükle</h3>
            <p>
              Dosyaları buraya sürükleyip bırakın veya <span className="browse-link">göz at</span>
            </p>
            <div className="file-info">
              <small>Desteklenen türler: {acceptedTypes.join(', ')}</small>
              <small>Maksimum boyut: {maxSize}MB</small>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};
