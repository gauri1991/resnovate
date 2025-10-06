'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import { api } from '@/lib/api';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  readTime: number;
  views: number;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Top 10 Kitchen Renovation Trends for 2024',
    slug: 'top-10-kitchen-renovation-trends-2024',
    excerpt: 'Discover the latest kitchen renovation trends that are transforming homes this year.',
    status: 'published',
    author: 'Sarah Johnson',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-16',
    tags: ['Kitchen', 'Trends', 'Renovation'],
    readTime: 8,
    views: 2456,
  },
  {
    id: 2,
    title: 'Modern Bathroom Design Ideas',
    slug: 'modern-bathroom-design-ideas',
    excerpt: 'Transform your bathroom with these contemporary design concepts and smart solutions.',
    status: 'published',
    author: 'Michael Chen',
    publishedAt: '2024-01-12',
    updatedAt: '2024-01-14',
    tags: ['Bathroom', 'Modern', 'Design'],
    readTime: 6,
    views: 1892,
  },
  {
    id: 3,
    title: 'Sustainable Home Renovation Guide',
    slug: 'sustainable-home-renovation-guide',
    excerpt: 'Learn how to make your home renovation project more environmentally friendly and cost-effective.',
    status: 'draft',
    author: 'Emily Rodriguez',
    publishedAt: '',
    updatedAt: '2024-01-18',
    tags: ['Sustainability', 'Guide', 'Eco-friendly'],
    readTime: 12,
    views: 0,
  },
  {
    id: 4,
    title: 'Small Space Living Room Solutions',
    slug: 'small-space-living-room-solutions',
    excerpt: 'Maximize your small living room with these clever design tricks and space-saving ideas.',
    status: 'published',
    author: 'David Park',
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-11',
    tags: ['Living Room', 'Small Space', 'Solutions'],
    readTime: 7,
    views: 3201,
  },
  {
    id: 5,
    title: 'Home Office Design Essentials',
    slug: 'home-office-design-essentials',
    excerpt: 'Create the perfect home office space that boosts productivity and reflects your style.',
    status: 'archived',
    author: 'Anna Kim',
    publishedAt: '2023-12-20',
    updatedAt: '2024-01-05',
    tags: ['Home Office', 'Productivity', 'Design'],
    readTime: 5,
    views: 987,
  },
];

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      // In a real app, this would fetch from the API
      // const response = await api.get('/blog-posts/');
      // setPosts(response.data);
      
      // For now, use mock data
      setTimeout(() => {
        setPosts(mockBlogPosts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        // await api.delete(`/blog-posts/${postId}/`);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      published: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (value: string, row: BlogPost) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 truncate">{value}</div>
          <div className="text-sm text-gray-500 truncate">{row.excerpt}</div>
          <div className="flex items-center mt-1 space-x-4 text-xs text-gray-400">
            <div className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : 'Draft'}
            </div>
            <div className="flex items-center">
              <EyeIcon className="h-3 w-3 mr-1" />
              {row.views.toLocaleString()} views
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'author',
      title: 'Author',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'tags',
      title: 'Tags',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
          {value.length > 2 && (
            <span className="text-xs text-gray-500">+{value.length - 2} more</span>
          )}
        </div>
      ),
    },
    {
      key: 'readTime',
      title: 'Read Time',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm text-gray-600">{value} min</span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: BlogPost) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/content/blog/${row.id}`}
            className="text-blue-600 hover:text-blue-700 p-1"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <Link
            href={`/blog/${row.slug}`}
            target="_blank"
            className="text-gray-600 hover:text-gray-700 p-1"
            title="Preview"
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDeletePost(row.id)}
            className="text-red-600 hover:text-red-700 p-1"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your blog content and articles
          </p>
        </div>
        <Link
          href="/admin/content/blog/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(post => post.status === 'published').length}
              </p>
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
            <div className="p-3 bg-yellow-100 rounded-lg">
              <PencilIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter(post => post.status === 'draft').length}
              </p>
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
            <div className="p-3 bg-blue-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
              </p>
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
            <div className="p-3 bg-purple-100 rounded-lg">
              <TagIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Read Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.length > 0 
                  ? Math.round(posts.reduce((sum, post) => sum + post.readTime, 0) / posts.length)
                  : 0
                } min
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        emptyMessage="No blog posts found. Create your first post to get started."
        onRowClick={(row) => {
          // Navigate to edit page on row click
          window.location.href = `/admin/content/blog/${row.id}`;
        }}
      />
    </div>
  );
}