'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  UsersIcon,
  ShieldCheckIcon,
  BellIcon,
  PaintBrushIcon,
  CurrencyDollarIcon,
  CloudIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  DocumentTextIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { api, cmsAPI } from '@/lib/api';
import { PageSection, CMSPages } from '@/types';
import DynamicFormBuilder from '@/components/cms/DynamicFormBuilder';
import FieldEditor from '@/components/cms/FieldEditor';
import SectionFormEditor from '@/components/cms/SectionFormEditor';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    googleAnalyticsId: string;
    googleTagManagerId: string;
  };
  business: {
    companyName: string;
    licenseNumber: string;
    insuranceInfo: string;
    serviceAreas: string[];
  };
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  templates: {
    welcome: string;
    consultation: string;
    proposal: string;
    invoice: string;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user';
  isActive: boolean;
  lastLogin: string;
  dateJoined: string;
}

const mockSiteSettings: SiteSettings = {
  siteName: 'Resnovate',
  siteDescription: 'Transform your space with AI-powered renovation solutions',
  siteUrl: 'https://resnovate.ai',
  contactEmail: 'hello@resnovate.ai',
  contactPhone: '(555) 123-4567',
  address: '123 Innovation Drive, Seattle, WA 98101',
  socialMedia: {
    facebook: 'https://facebook.com/resnovate',
    twitter: 'https://twitter.com/resnovate',
    instagram: 'https://instagram.com/resnovate',
    linkedin: 'https://linkedin.com/company/resnovate',
  },
  seo: {
    metaTitle: 'Resnovate - AI-Powered Home Renovation Solutions',
    metaDescription: 'Transform your home with intelligent renovation planning, expert contractors, and seamless project management.',
    googleAnalyticsId: 'G-XXXXXXXXXX',
    googleTagManagerId: 'GTM-XXXXXXX',
  },
  business: {
    companyName: 'Resnovate LLC',
    licenseNumber: 'CCB-123456',
    insuranceInfo: 'General Liability: $2M, Workers Comp: $1M',
    serviceAreas: ['Seattle, WA', 'Portland, OR', 'San Francisco, CA', 'Vancouver, WA'],
  },
};

const mockEmailSettings: EmailSettings = {
  smtpHost: 'smtp.mailgun.org',
  smtpPort: 587,
  smtpUsername: 'postmaster@resnovate.ai',
  smtpPassword: '••••••••••••',
  fromEmail: 'noreply@resnovate.ai',
  fromName: 'Resnovate Team',
  templates: {
    welcome: 'Welcome to Resnovate! We\'re excited to help you transform your space.',
    consultation: 'Thank you for booking a consultation. We\'ll be in touch soon.',
    proposal: 'Your renovation proposal is ready for review.',
    invoice: 'Your invoice is attached. Payment is due within 30 days.',
  },
};

const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@resnovate.ai',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin',
    isActive: true,
    lastLogin: '2024-01-18T10:30:00Z',
    dateJoined: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'sarah.johnson',
    email: 'sarah@resnovate.ai',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'manager',
    isActive: true,
    lastLogin: '2024-01-17T15:45:00Z',
    dateJoined: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    username: 'mike.chen',
    email: 'mike@resnovate.ai',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'user',
    isActive: true,
    lastLogin: '2024-01-16T09:20:00Z',
    dateJoined: '2024-01-05T00:00:00Z',
  },
  {
    id: 4,
    username: 'emma.davis',
    email: 'emma@resnovate.ai',
    firstName: 'Emma',
    lastName: 'Davis',
    role: 'user',
    isActive: false,
    lastLogin: '2024-01-10T14:30:00Z',
    dateJoined: '2024-01-08T00:00:00Z',
  },
];

const settingsTabs = [
  { id: 'general', name: 'General', icon: Cog6ToothIcon },
  { id: 'cms', name: 'CMS', icon: DocumentTextIcon },
  { id: 'users', name: 'Users', icon: UsersIcon },
  { id: 'email', name: 'Email', icon: EnvelopeIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  { id: 'integrations', name: 'Integrations', icon: CloudIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(mockSiteSettings);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(mockEmailSettings);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // CMS state
  const [cmsPages, setCmsPages] = useState<CMSPages>({});
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [showSectionEditor, setShowSectionEditor] = useState(false);
  const [editorViewMode, setEditorViewMode] = useState<'form' | 'json'>('form');
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const {
    register: registerSite,
    handleSubmit: handleSubmitSite,
    formState: { errors: errorsEmail },
  } = useForm<SiteSettings>({
    defaultValues: siteSettings,
  });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsSite },
  } = useForm<EmailSettings>({
    defaultValues: emailSettings,
  });

  const handleSaveSettings = async (data: any) => {
    setSaveStatus('saving');
    try {
      // await api.patch('/settings/', data);
      console.log('Saving settings:', data);
      
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      }, 1500);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      // await api.patch(`/users/${userId}/`, { isActive: !user.isActive });
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        // await api.delete(`/users/${userId}/`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleBadge = (role: string) => {
    const roleClasses = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleClasses[role as keyof typeof roleClasses]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fetch CMS pages when CMS tab is active
  useEffect(() => {
    if (activeTab === 'cms') {
      fetchCMSPages();
    }
  }, [activeTab]);

  const fetchCMSPages = async () => {
    try {
      setLoading(true);
      console.log('Fetching CMS pages...');
      console.log('Auth token:', localStorage.getItem('access_token'));
      const response = await cmsAPI.getPages();
      console.log('CMS API Response:', response.data);
      setCmsPages(response.data);
    } catch (error) {
      console.error('Error fetching CMS pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = async (section: PageSection) => {
    try {
      const updatedSection = await cmsAPI.updateSection(section.id, {
        enabled: !section.enabled
      });
      // Update local state
      fetchCMSPages();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error toggling section:', error);
      setSaveStatus('error');
    }
  };

  const handleEditSection = (section: PageSection) => {
    setEditingSection(section);
    setShowSectionEditor(true);
  };

  const handleSaveSection = async () => {
    if (!editingSection) return;

    // Validate section data
    if (!editingSection.section_name?.trim()) {
      setSaveStatus('error');
      alert('Section name is required');
      return;
    }

    // Validate JSON content
    if (editorViewMode === 'json') {
      try {
        JSON.parse(JSON.stringify(editingSection.content));
      } catch (err) {
        setSaveStatus('error');
        alert('Invalid JSON content');
        return;
      }
    }

    try {
      setSaveStatus('saving');

      // Only send editable fields
      const updateData = {
        section_name: editingSection.section_name,
        enabled: editingSection.enabled,
        order: editingSection.order,
        content: editingSection.content
      };

      await cmsAPI.updateSection(editingSection.id, updateData);
      setShowSectionEditor(false);
      setEditingSection(null);
      setEditorViewMode('form');
      setJsonError(null);
      await fetchCMSPages();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error: any) {
      console.error('Error saving section:', error);
      setSaveStatus('error');
      alert(error.response?.data?.message || 'Failed to save section. Please try again.');
    }
  };

  const handleAddField = (fieldName: string, fieldValue: any) => {
    if (!editingSection) return;

    setEditingSection({
      ...editingSection,
      content: {
        ...editingSection.content,
        [fieldName]: fieldValue
      }
    });
    setShowFieldEditor(false);
  };

  const handleContentChange = (newContent: Record<string, any>) => {
    if (!editingSection) return;

    setEditingSection({
      ...editingSection,
      content: newContent
    });
  };

  const handleJsonChange = (value: string) => {
    if (!editingSection) return;

    try {
      const parsed = JSON.parse(value);
      setEditingSection({
        ...editingSection,
        content: parsed
      });
      setJsonError(null);
    } catch (err) {
      setJsonError('Invalid JSON format');
    }
  };

  const renderGeneralSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Global Site Settings Link Card */}
      <Link href="/admin/settings/site-settings">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-sm border border-blue-600 hover:shadow-lg transition-all duration-200 cursor-pointer hover:from-blue-600 hover:to-blue-700">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
            <Cog6ToothIcon className="h-6 w-6 mr-2" />
            Global Site Settings
          </h3>
          <p className="text-blue-50 text-sm mb-3">
            Edit navigation menu, footer content, social links, and SEO metadata for your entire website
          </p>
          <div className="inline-flex items-center text-sm font-medium text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Manage Site Settings
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </div>
        </div>
      </Link>

      <form onSubmit={handleSubmitSite(handleSaveSettings)} className="space-y-6">
        {/* Site Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GlobeAltIcon className="h-5 w-5 mr-2" />
            Site Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                {...registerSite('siteName')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site URL
              </label>
              <input
                type="url"
                {...registerSite('siteUrl')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                {...registerSite('siteDescription')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                {...registerSite('contactEmail')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                {...registerSite('contactPhone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <input
                type="text"
                {...registerSite('address')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                {...registerSite('business.companyName')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                {...registerSite('business.licenseNumber')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Information
              </label>
              <input
                type="text"
                {...registerSite('business.insuranceInfo')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end space-x-4">
          {saveStatus === 'saved' && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Settings saved successfully
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderUsersSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button
          onClick={() => setShowAddUser(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Team Members</h4>
          <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getRoleBadge(user.role)}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right text-sm text-gray-500">
                  <p>Last login: {formatDate(user.lastLogin)}</p>
                  <p>Joined: {formatDate(user.dateJoined)}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleUserStatus(user.id)}
                    className={`p-2 rounded-lg text-sm font-medium ${
                      user.isActive 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={user.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderEmailSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmitEmail(handleSaveSettings)} className="space-y-6">
        {/* SMTP Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            SMTP Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                {...registerEmail('smtpHost')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
              </label>
              <input
                type="number"
                {...registerEmail('smtpPort')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                {...registerEmail('smtpUsername')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...registerEmail('smtpPassword')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Email
              </label>
              <input
                type="email"
                {...registerEmail('fromEmail')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <input
                type="text"
                {...registerEmail('fromName')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h3>
          <div className="space-y-4">
            {Object.entries(emailSettings.templates).map(([key, template]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)} Template
                </label>
                <textarea
                  {...registerEmail(`templates.${key}` as any)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Email Settings'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderSecuritySettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ShieldCheckIcon className="h-5 w-5 mr-2" />
          Security Settings
        </h3>
        <div className="space-y-6">
          {/* Password Policy */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Password Policy</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Require minimum 8 characters</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Require uppercase and lowercase letters</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Require at least one number</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Require special characters</span>
              </label>
            </div>
          </div>

          {/* Session Settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Session Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  defaultValue={60}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-700">Enable 2FA for all admin users</span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderCMSSettings = () => {
    const allSections = cmsPages[selectedPage]?.sections || [];
    const currentPageSections = allSections; // Always show all sections

    const disabledCount = allSections.filter(section => !section.enabled).length;

    // Debug logging
    console.log('CMS Debug - Selected Page:', selectedPage);
    console.log('CMS Debug - All Sections:', allSections);
    console.log('CMS Debug - Disabled Count:', disabledCount);
    console.log('CMS Debug - Current Page Sections:', currentPageSections);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Selector */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Content Management System
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Enable or disable sections on your website pages and edit their content.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Page
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="homepage">Homepage</option>
              <option value="about">About Page</option>
              <option value="services">Services Page</option>
              <option value="case_studies">Case Studies Page</option>
              <option value="research_insights">Research Insights Page</option>
              <option value="contact">Contact Page</option>
              <option value="resources">Resources Page</option>
              <optgroup label="Industry Pages">
                <option value="industries-healthcare">Healthcare & Life Sciences</option>
                <option value="industries-financial">Financial Services</option>
                <option value="industries-manufacturing">Manufacturing</option>
                <option value="industries-retail">Retail & E-commerce</option>
                <option value="industries-technology">Technology & Software</option>
                <option value="industries-energy">Energy & Utilities</option>
                <option value="industries-government">Government & Public Sector</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Sections List */}
        {loading ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading sections...</span>
            </div>
          </div>
        ) : allSections.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {cmsPages[selectedPage]?.name} Sections
                  </h4>
                  <p className="text-sm text-gray-600">
                    Manage sections for this page {disabledCount > 0 && `(${disabledCount} disabled)`}
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {currentPageSections.map((section) => (
              <div
                key={section.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center">
                    <ArrowsUpDownIcon className="h-5 w-5 text-gray-400 cursor-move" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h5 className="text-sm font-medium text-gray-900">
                        {section.section_name}
                      </h5>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {section.section_key}
                      </span>
                    </div>
                    {section.content && Object.keys(section.content).length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {Object.keys(section.content).length} content field(s)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      section.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {section.enabled ? 'Enabled' : 'Disabled'}
                  </span>

                  {/* Toggle Button */}
                  <button
                    onClick={() => handleToggleSection(section)}
                    className={`p-2 rounded-lg transition-colors ${
                      section.enabled
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={section.enabled ? 'Disable section' : 'Enable section'}
                  >
                    {section.enabled ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditSection(section)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit section content"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              No sections found
            </h4>
            <p className="text-sm text-gray-500">
              This page doesn't have any sections configured yet.
            </p>
          </div>
        )}

        {/* Enhanced Section Editor Modal */}
        {showSectionEditor && editingSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Edit Section: {editingSection.section_name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowSectionEditor(false);
                      setEditingSection(null);
                      setEditorViewMode('form');
                      setJsonError(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setEditorViewMode('form')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      editorViewMode === 'form'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Form Editor
                  </button>
                  <button
                    onClick={() => setEditorViewMode('json')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      editorViewMode === 'json'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    JSON Editor
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
                <div className="space-y-4">
                  {/* Basic Fields */}
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Key
                      </label>
                      <input
                        type="text"
                        value={editingSection.section_key}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Name
                      </label>
                      <input
                        type="text"
                        value={editingSection.section_name}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, section_name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSection.enabled}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, enabled: e.target.checked })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Section Enabled</span>
                    </label>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Section Content
                      </label>
                      {Object.keys(editingSection.content || {}).length > 0 && (
                        <span className="text-xs text-gray-500">
                          {Object.keys(editingSection.content).length} field(s)
                        </span>
                      )}
                    </div>

                    {editorViewMode === 'form' ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        {Object.keys(editingSection.content || {}).length > 0 ? (
                          <>
                            {/* Try custom form editor first */}
                            {(() => {
                              const customFormSections = [
                                'hero', 'header', 'stats', 'metrics', 'metrics_data',
                                'features', 'values', 'core_services', 'cta',
                                'milestones', 'process_steps', 'process',
                                'overview', 'faqs', 'offices', 'contact_info',
                                'testimonials', 'team',
                                'contact_methods_header', 'form_section_header', 'emergency_contact',
                                'why_choose', 'library', 'educational', 'featured',
                                'services_overview', 'case_studies', 'services_list', 'tools',
                                'featured_topics_data', 'featured_resources_data',
                                'resource_categories_data', 'tools_data'
                              ];
                              const hasCustomForm = customFormSections.includes(editingSection.section_key);
                              const customForm = (
                                <SectionFormEditor
                                  sectionKey={editingSection.section_key}
                                  content={editingSection.content || {}}
                                  onChange={handleContentChange}
                                />
                              );

                              if (hasCustomForm) {
                                return customForm;
                              } else {
                                // Fallback to DynamicFormBuilder for sections without custom forms
                                return (
                                  <div>
                                    <div className="mb-3 flex items-center justify-between pb-3 border-b border-gray-200">
                                      <h4 className="text-sm font-semibold text-gray-700">Section Content</h4>
                                      <span className="text-xs text-gray-500 bg-blue-100 text-blue-700 px-2 py-1 rounded">Generic Form Editor</span>
                                    </div>
                                    <DynamicFormBuilder
                                      content={editingSection.content || {}}
                                      onChange={handleContentChange}
                                      onAddField={() => setShowFieldEditor(true)}
                                    />
                                  </div>
                                );
                              }
                            })()}
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-sm text-gray-500 mb-4">No content fields yet</p>
                            <button
                              onClick={() => setShowFieldEditor(true)}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                            >
                              <PlusIcon className="h-4 w-4 mr-2" />
                              Add First Field
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <textarea
                          value={JSON.stringify(editingSection.content, null, 2)}
                          onChange={(e) => handleJsonChange(e.target.value)}
                          rows={16}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                            jsonError ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder='{"title": "Section Title", "description": "Section description"}'
                        />
                        {jsonError ? (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            {jsonError}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-gray-500">
                            Enter valid JSON format for section content
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-4">
                  {saveStatus && (
                    <div
                      className={`flex items-center text-sm ${
                        saveStatus === 'saved' ? 'text-green-600' : saveStatus === 'error' ? 'text-red-600' : 'text-blue-600'
                      }`}
                    >
                      {saveStatus === 'saved' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                      {saveStatus === 'error' && <XCircleIcon className="h-4 w-4 mr-1" />}
                      {saveStatus === 'saved' && 'Saved successfully'}
                      {saveStatus === 'saving' && 'Saving...'}
                      {saveStatus === 'error' && 'Error saving section'}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setShowSectionEditor(false);
                      setEditingSection(null);
                      setEditorViewMode('form');
                      setJsonError(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSection}
                    disabled={saveStatus === 'saving' || !!jsonError}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Field Editor Modal */}
        {showFieldEditor && (
          <FieldEditor
            onAdd={handleAddField}
            onClose={() => setShowFieldEditor(false)}
          />
        )}
      </motion.div>
    );
  };

  const renderIntegrationsSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CloudIcon className="h-5 w-5 mr-2" />
          Third-Party Integrations
        </h3>
        
        <div className="space-y-6">
          {/* Google Analytics */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900">Google Analytics</h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking ID
              </label>
              <input
                type="text"
                defaultValue="G-XXXXXXXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stripe */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900">Stripe Payments</h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publishable Key
                </label>
                <input
                  type="text"
                  placeholder="pk_live_..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Key
                </label>
                <input
                  type="password"
                  placeholder="sk_live_..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Mailchimp */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900">Mailchimp</h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                placeholder="Enter Mailchimp API key"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'cms':
        return renderCMSSettings();
      case 'users':
        return renderUsersSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      case 'integrations':
        return renderIntegrationsSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your site configuration and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}