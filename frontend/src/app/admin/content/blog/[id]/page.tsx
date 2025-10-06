'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import {
  ArrowLeftIcon,
  EyeIcon,
  CloudArrowUpIcon,
  BookmarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  TagIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import RichTextEditor from '@/components/admin/RichTextEditor';
import MediaUploader from '@/components/admin/MediaUploader';
import { api } from '@/lib/api';

interface BlogPostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  tags: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
}

interface BlogPost extends BlogPostForm {
  id: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

const initialFormData: BlogPostForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft',
  tags: '',
  featuredImage: '',
  seoTitle: '',
  seoDescription: '',
  publishedAt: '',
};

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800' },
];

export default function BlogPostEditor() {
  const router = useRouter();
  const params = useParams();
  const isNewPost = params.id === 'new';
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(!isNewPost);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [showSeoSettings, setShowSeoSettings] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<BlogPostForm>({
    defaultValues: initialFormData,
  });

  const watchedTitle = watch('title');

  useEffect(() => {
    if (!isNewPost) {
      fetchPost();
    }
  }, [isNewPost, params.id]);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && isNewPost) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchedTitle, isNewPost, setValue]);

  const fetchPost = async () => {
    try {
      // In a real app, this would fetch from the API
      // const response = await api.get(`/blog-posts/${params.id}/`);
      // const postData = response.data;
      
      // Mock data for demonstration
      const mockPost: BlogPost = {
        id: 1,
        title: 'Top 10 Kitchen Renovation Trends for 2024',
        slug: 'top-10-kitchen-renovation-trends-2024',
        excerpt: 'Discover the latest kitchen renovation trends that are transforming homes this year.',
        content: '<h2>Introduction</h2><p>Kitchen renovations continue to be one of the most popular home improvement projects...</p>',
        status: 'published',
        tags: 'Kitchen, Trends, Renovation',
        featuredImage: '/images/kitchen-trends-2024.jpg',
        seoTitle: 'Top 10 Kitchen Renovation Trends for 2024 - Resnovate',
        seoDescription: 'Discover the latest kitchen renovation trends that are transforming homes this year. Get inspired by modern designs and innovative solutions.',
        publishedAt: '2024-01-15T10:00:00Z',
        author: 'Sarah Johnson',
        createdAt: '2024-01-14T15:30:00Z',
        updatedAt: '2024-01-16T09:15:00Z',
        views: 2456,
      };
      
      setPost(mockPost);
      
      // Populate form with post data
      Object.keys(mockPost).forEach((key) => {
        if (key in initialFormData) {
          setValue(key as keyof BlogPostForm, mockPost[key as keyof BlogPost] as any);
        }
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: BlogPostForm) => {
    setSaving(true);
    setSaveStatus('saving');
    
    try {
      if (isNewPost) {
        // Create new post
        // const response = await api.post('/blog-posts/', data);
        console.log('Creating new post:', data);
        
        setTimeout(() => {
          setSaveStatus('saved');
          router.push('/admin/content/blog');
        }, 1500);
      } else {
        // Update existing post
        // const response = await api.patch(`/blog-posts/${params.id}/`, data);
        console.log('Updating post:', data);
        
        setTimeout(() => {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus(null), 2000);
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    setValue('status', 'draft');
    handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    setValue('status', 'published');
    setValue('publishedAt', new Date().toISOString());
    handleSubmit(onSubmit)();
  };

  const handlePreview = () => {
    const currentData = getValues();
    // In a real app, this would open a preview in a new tab
    console.log('Preview post:', currentData);
    window.open(`/blog/${currentData.slug}?preview=true`, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Posts
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNewPost ? 'Create New Post' : 'Edit Post'}
            </h1>
            {post && (
              <p className="text-sm text-gray-600">
                Last updated: {new Date(post.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {saveStatus === 'saved' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center text-green-600 text-sm"
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Saved
            </motion.div>
          )}
          
          {saveStatus === 'saving' && (
            <div className="flex items-center text-blue-600 text-sm">
              <CloudArrowUpIcon className="h-4 w-4 mr-1 animate-pulse" />
              Saving...
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div className="flex items-center text-red-600 text-sm">
              <XCircleIcon className="h-4 w-4 mr-1" />
              Error saving
            </div>
          )}

          <button
            type="button"
            onClick={handlePreview}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Preview
          </button>
          
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <BookmarkIcon className="h-4 w-4 mr-2" />
            Save Draft
          </button>
          
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <CloudArrowUpIcon className="h-4 w-4 mr-2" />
            Publish
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter post title..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    {...register('slug', { required: 'Slug is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="post-url-slug"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    {...register('excerpt')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the post..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Content Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Content *
              </label>
              <Controller
                name="content"
                control={control}
                rules={{ required: 'Content is required' }}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Start writing your blog post..."
                    height={400}
                    error={errors.content?.message}
                  />
                )}
              />
            </motion.div>

            {/* SEO Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <button
                type="button"
                onClick={() => setShowSeoSettings(!showSeoSettings)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>
                <span className="text-gray-400">
                  {showSeoSettings ? '−' : '+'}
                </span>
              </button>
              
              {showSeoSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      {...register('seoTitle')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO optimized title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      {...register('seoDescription')}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO meta description..."
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="space-y-3">
                {statusOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      {...register('status')}
                      value={option.value}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span
                      className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${option.color}`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              
              {watch('status') === 'published' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register('publishedAt')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TagIcon className="h-4 w-4 inline mr-1" />
                Tags
              </label>
              <input
                type="text"
                {...register('tags')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Separate tags with commas..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple tags with commas
              </p>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <PhotoIcon className="h-4 w-4 inline mr-1" />
                Featured Image
              </label>
              <MediaUploader
                multiple={false}
                acceptedTypes={['image/*']}
                maxFiles={1}
                onUpload={async (files) => {
                  // Handle image upload
                  return files.map((file, index) => ({
                    id: `upload-${index}`,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file),
                  }));
                }}
              />
            </motion.div>

            {/* Post Stats (for existing posts) */}
            {!isNewPost && post && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Views</span>
                    <span className="text-sm font-medium">{post.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm font-medium">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Author</span>
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}