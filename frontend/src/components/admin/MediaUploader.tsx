'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  XMarkIcon,
  PhotoIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress?: number;
  error?: string;
}

interface MediaUploaderProps {
  multiple?: boolean;
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  onUpload?: (files: File[]) => Promise<UploadedFile[]>;
  onRemove?: (fileId: string) => void;
  uploadedFiles?: UploadedFile[];
  className?: string;
  disabled?: boolean;
}

export default function MediaUploader({
  multiple = true,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf', '.doc', '.docx'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  onUpload,
  onRemove,
  uploadedFiles = [],
  className = '',
  disabled = false,
}: MediaUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(uploadedFiles);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File size must be less than ${formatFileSize(maxFileSize)}`;
    }

    const isValidType = acceptedTypes.some((type) => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type.replace('*', '.*'));
    });

    if (!isValidType) {
      return 'File type not supported';
    }

    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      if (disabled || isUploading) return;

      const newFiles = Array.from(fileList);
      
      if (files.length + newFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles: File[] = [];
      const invalidFiles: { file: File; error: string }[] = [];

      newFiles.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          invalidFiles.push({ file, error });
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        const errorMessage = invalidFiles
          .map(({ file, error }) => `${file.name}: ${error}`)
          .join('\n');
        alert(`Some files could not be uploaded:\n${errorMessage}`);
      }

      if (validFiles.length === 0) return;

      setIsUploading(true);

      // Create file objects with initial state
      const newFileObjects: UploadedFile[] = validFiles.map((file) => ({
        id: generateFileId(),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFileObjects]);

      try {
        if (onUpload) {
          const uploadedFiles = await onUpload(validFiles);
          
          // Update files with uploaded URLs
          setFiles((prev) =>
            prev.map((file) => {
              const uploaded = uploadedFiles.find((up) => up.name === file.name);
              if (uploaded) {
                return { ...file, ...uploaded, progress: 100 };
              }
              return file;
            })
          );
        } else {
          // If no upload handler, create local URLs for preview
          const filesWithUrls = newFileObjects.map((fileObj) => {
            const file = validFiles.find((f) => f.name === fileObj.name);
            return {
              ...fileObj,
              url: file ? URL.createObjectURL(file) : undefined,
              progress: 100,
            };
          });

          setFiles((prev) =>
            prev.map((file) => {
              const updated = filesWithUrls.find((f) => f.id === file.id);
              return updated || file;
            })
          );
        }
      } catch (error) {
        console.error('Upload error:', error);
        // Mark files with error
        setFiles((prev) =>
          prev.map((file) => {
            if (newFileObjects.some((nf) => nf.id === file.id)) {
              return { ...file, error: 'Upload failed' };
            }
            return file;
          })
        );
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, isUploading, files, maxFiles, onUpload, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
        e.target.value = '';
      }
    },
    [handleFiles]
  );

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
    onRemove?.(fileId);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return PhotoIcon;
    return DocumentIcon;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <motion.div
          animate={isUploading ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: isUploading ? Infinity : 0, duration: 1 }}
        >
          <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400" />
        </motion.div>
        
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-700">
            {isUploading ? 'Uploading...' : 'Drop files here or click to browse'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports {acceptedTypes.join(', ')} up to {formatFileSize(maxFileSize)}
          </p>
          {multiple && (
            <p className="text-xs text-gray-400 mt-1">
              Maximum {maxFiles} files
            </p>
          )}
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-gray-700">
              Uploaded Files ({files.length})
            </h4>
            
            <div className="space-y-2">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.type);
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <FileIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        
                        {file.error && (
                          <p className="text-xs text-red-600 mt-1">{file.error}</p>
                        )}
                        
                        {file.progress !== undefined && file.progress < 100 && !file.error && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {file.url && file.type.startsWith('image/') && (
                        <div className="flex-shrink-0">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="h-12 w-12 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFile(file.id)}
                      className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}