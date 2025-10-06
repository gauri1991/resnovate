'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  FolderIcon,
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import MediaUploader from '@/components/admin/MediaUploader';
import { adminAPI } from '@/lib/api';

interface MediaFile {
  id: number;
  name: string;
  original_name: string;
  url: string;
  thumbnail_url?: string;
  type: string;
  size: number;
  category: 'image' | 'video' | 'document' | 'audio' | 'other';
  tags: string[];
  alt_text: string;
  description: string;
  uploaded_at: string;
  uploaded_by_name: string;
  usage_count: number;
  is_public: boolean;
  folder?: string;
}

interface Folder {
  id: number;
  name: string;
  description: string;
  fileCount: number;
  createdAt: string;
}


const categories = ['all', 'image', 'video', 'document', 'audio'];
const sortOptions = [
  { value: 'uploaded_at-desc', label: 'Newest First' },
  { value: 'uploaded_at-asc', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'size-desc', label: 'Largest First' },
  { value: 'size-asc', label: 'Smallest First' },
  { value: 'usage_count-desc', label: 'Most Used' },
];

export default function MediaLibraryPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [sortBy, setSortBy] = useState('uploaded_at-desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState(false);

  useEffect(() => {
    fetchMediaFiles();
    fetchFolders();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      const response = await adminAPI.getMedia();
      // Handle both paginated and non-paginated responses
      const mediaData = response.data.results || response.data;
      setMediaFiles(mediaData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching media files:', error);
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      // Generate folders dynamically from media files
      const response = await adminAPI.getMedia();
      const mediaData = response.data.results || response.data;
      
      // Extract unique folders
      const folderMap: { [key: string]: number } = {};
      mediaData.forEach((file: MediaFile) => {
        if (file.folder) {
          folderMap[file.folder] = (folderMap[file.folder] || 0) + 1;
        }
      });
      
      const dynamicFolders = Object.entries(folderMap).map(([name, count], index) => ({
        id: index + 1,
        name,
        description: `${name} folder`,
        fileCount: count,
        createdAt: new Date().toISOString(),
      }));
      
      setFolders(dynamicFolders);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setFolders([]);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      // In a real app, upload files to the server
      const uploadedFiles = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name.toLowerCase().replace(/\s+/g, '-'),
        original_name: file.name,
        url: URL.createObjectURL(file),
        thumbnail_url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        type: file.type,
        size: file.size,
        category: getFileCategory(file.type),
        tags: [],
        alt_text: '',
        description: '',
        uploaded_at: new Date().toISOString(),
        uploaded_by_name: 'Current User',
        usage_count: 0,
        is_public: true,
        folder: selectedFolder || undefined,
      }));

      setMediaFiles([...uploadedFiles, ...mediaFiles]);
      setShowUploader(false);
      
      return uploadedFiles;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };

  const getFileCategory = (mimeType: string): MediaFile['category'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
    return 'other';
  };

  const handleDeleteFiles = async () => {
    if (confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
      try {
        // await Promise.all(selectedFiles.map(id => api.delete(`/media/${id}/`)));
        setMediaFiles(mediaFiles.filter(file => !selectedFiles.includes(file.id)));
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error deleting files:', error);
      }
    }
  };

  const getFileIcon = (category: string, type: string) => {
    switch (category) {
      case 'image':
        return <PhotoIcon className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <VideoCameraIcon className="h-8 w-8 text-purple-500" />;
      case 'audio':
        return <MusicalNoteIcon className="h-8 w-8 text-green-500" />;
      case 'document':
        return <DocumentIcon className="h-8 w-8 text-red-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter and sort files
  const filteredFiles = mediaFiles.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesFolder = !selectedFolder || file.folder === selectedFolder;
    const matchesSearch = !searchTerm || 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesFolder && matchesSearch;
  }).sort((a, b) => {
    const [field, direction] = sortBy.split('-');
    const modifier = direction === 'asc' ? 1 : -1;
    
    if (field === 'uploaded_at') {
      return (new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime()) * modifier;
    }
    
    if (field === 'name') {
      return a.name.localeCompare(b.name) * modifier;
    }
    
    if (field === 'size' || field === 'usage_count') {
      return (a[field as keyof MediaFile] as number - (b[field as keyof MediaFile] as number)) * modifier;
    }
    
    return 0;
  });

  const totalFiles = mediaFiles.length;
  const totalSize = mediaFiles.reduce((sum, file) => sum + file.size, 0);
  const imageFiles = mediaFiles.filter(file => file.category === 'image').length;
  const videoFiles = mediaFiles.filter(file => file.category === 'video').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your images, videos, and documents
          </p>
        </div>
        <button
          onClick={() => setShowUploader(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <CloudArrowUpIcon className="h-5 w-5 mr-2" />
          Upload Files
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <PhotoIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{totalFiles}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FolderIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <PhotoIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="text-2xl font-bold text-gray-900">{imageFiles}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <VideoCameraIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">{videoFiles}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="audio">Audio</option>
            </select>

            {/* Folder Filter */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Folders</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.name}>
                  {folder.name} ({folder.fileCount})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-3">
            {selectedFiles.length > 0 && (
              <>
                <span className="text-sm text-gray-600">
                  {selectedFiles.length} selected
                </span>
                <button
                  onClick={handleDeleteFiles}
                  className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </>
            )}
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Files Grid/List */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory !== 'all' || selectedFolder
                ? 'Try adjusting your filters or search terms.'
                : 'Upload your first file to get started.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative group bg-white border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  if (selectedFiles.includes(file.id)) {
                    setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                  } else {
                    setSelectedFiles([...selectedFiles, file.id]);
                  }
                }}
              >
                {/* File Thumbnail */}
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  {file.category === 'image' ? (
                    <>
                      <img
                        src={file.thumbnail_url || file.url}
                        alt={file.alt_text || file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const fallback = (e.target as HTMLImageElement).nextElementSibling;
                          if (fallback) {
                            fallback.classList.remove('hidden');
                          }
                        }}
                      />
                      <div className="hidden w-full h-full flex items-center justify-center">
                        {getFileIcon('image', file.type)}
                      </div>
                    </>
                  ) : (
                    getFileIcon(file.category, file.type)
                  )}
                </div>

                {/* File Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 truncate" title={file.original_name}>
                    {file.original_name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)} • {formatDate(file.uploaded_at)}
                  </p>
                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {file.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {file.tags.length > 2 && (
                        <span className="text-xs text-gray-400">+{file.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(file);
                      setShowFileDetails(true);
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle download
                      const link = document.createElement('a');
                      link.href = file.url;
                      link.download = file.original_name;
                      link.click();
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Download"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Selection Indicator */}
                {selectedFiles.includes(file.id) && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  if (selectedFiles.includes(file.id)) {
                    setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                  } else {
                    setSelectedFiles([...selectedFiles, file.id]);
                  }
                }}
              >
                <div className="flex-shrink-0">
                  {selectedFiles.includes(file.id) ? (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  {file.category === 'image' ? (
                    <img
                      src={file.thumbnail_url || file.url}
                      alt={file.alt_text || file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      {getFileIcon(file.category, file.type)}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {file.original_name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.uploaded_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 truncate">
                      {file.description || 'No description'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        Used {file.usage_count} times
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(file);
                          setShowFileDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploader && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900 bg-opacity-50"
                onClick={() => setShowUploader(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
                  <button
                    onClick={() => setShowUploader(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6">
                  <MediaUploader
                    multiple={true}
                    onUpload={handleFileUpload}
                    acceptedTypes={['image/*', 'video/*', 'application/pdf', '.doc', '.docx']}
                    maxFileSize={50 * 1024 * 1024} // 50MB
                    maxFiles={20}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* File Details Modal */}
      <AnimatePresence>
        {showFileDetails && selectedFile && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900 bg-opacity-50"
                onClick={() => setShowFileDetails(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">File Details</h3>
                  <button
                    onClick={() => setShowFileDetails(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* File Preview */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center h-64">
                        {selectedFile.category === 'image' ? (
                          <img
                            src={selectedFile.url}
                            alt={selectedFile.alt || selectedFile.name}
                            className="max-w-full max-h-full object-contain rounded"
                          />
                        ) : selectedFile.category === 'video' ? (
                          <video
                            src={selectedFile.url}
                            controls
                            className="max-w-full max-h-full rounded"
                          />
                        ) : (
                          <div className="text-center">
                            {getFileIcon(selectedFile.category, selectedFile.type)}
                            <p className="mt-2 text-sm text-gray-600">{selectedFile.originalName}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* File Information */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Information</h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">File Name:</dt>
                            <dd className="text-gray-900 truncate max-w-xs">{selectedFile.originalName}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Size:</dt>
                            <dd className="text-gray-900">{formatFileSize(selectedFile.size)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Type:</dt>
                            <dd className="text-gray-900">{selectedFile.type}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Uploaded:</dt>
                            <dd className="text-gray-900">{formatDate(selectedFile.uploadedAt)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Usage:</dt>
                            <dd className="text-gray-900">{selectedFile.usageCount} times</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Visibility:</dt>
                            <dd className="text-gray-900">{selectedFile.is_public ? 'Public' : 'Private'}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Tags */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedFile.tags.length > 0 ? (
                            selectedFile.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                <TagIcon className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">No tags</span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-600">
                          {selectedFile.description || 'No description available'}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedFile.url;
                            link.download = selectedFile.originalName;
                            link.click();
                          }}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                          Download
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedFile.url);
                            // Show toast notification
                          }}
                          className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
                        >
                          <ShareIcon className="h-4 w-4 mr-2" />
                          Copy URL
                        </button>
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}