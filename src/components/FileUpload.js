// frontend/src/components/FileUpload.js
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import './FileUpload.css';

const FileUpload = ({ 
  onFileSelect, 
  acceptedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  preview = true,
  label = "Upload File"
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    const validFiles = [];
    const fileArray = Array.from(fileList);

    fileArray.forEach(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.split('/')[0]);
        }
        return file.type === type || file.name.toLowerCase().endsWith(type);
      });

      if (!isValidType) {
        toast.error(`File ${file.name} is not a supported format`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(newFiles);
      if (onFileSelect) {
        onFileSelect(multiple ? newFiles : newFiles[0]);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFileSelect) {
      onFileSelect(multiple ? newFiles : null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    const type = file.type.split('/')[0];
    switch (type) {
      case 'image':
        return 'fas fa-image';
      case 'video':
        return 'fas fa-video';
      case 'audio':
        return 'fas fa-music';
      case 'application':
        if (file.type.includes('pdf')) return 'fas fa-file-pdf';
        if (file.type.includes('word')) return 'fas fa-file-word';
        return 'fas fa-file';
      default:
        return 'fas fa-file';
    }
  };

  const renderPreview = (file, index) => {
    const fileType = file.type.split('/')[0];
    
    if (fileType === 'image') {
      return (
        <img 
          src={URL.createObjectURL(file)} 
          alt={file.name}
          className="file-preview-image"
        />
      );
    }
    
    return (
      <div className="file-preview-icon">
        <i className={getFileIcon(file)}></i>
      </div>
    );
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          <div className="upload-icon">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <div className="upload-text">
            <p><strong>Click to upload</strong> or drag and drop</p>
            <p className="upload-hint">
              {acceptedTypes.join(', ')} up to {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="uploaded-files">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              {preview && renderPreview(file, index)}
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatFileSize(file.size)}</div>
                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="remove-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;