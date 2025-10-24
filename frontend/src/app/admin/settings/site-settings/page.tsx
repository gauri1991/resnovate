'use client';

import { useState, useEffect } from 'react';
import { cmsAPI } from '@/lib/api';
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings';
import {
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

export default function SiteSettingsPage() {
  const { settings: initialSettings, loading: initialLoading } = useSiteSettings();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'navigation' | 'footer' | 'metadata'>('navigation');

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleSave = async () => {
    if (!settings || !settings.id) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      await cmsAPI.updateSiteSettings(settings.id, settings);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Navigation helpers
  const addNavItem = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      navigation_items: [
        ...settings.navigation_items,
        { name: 'New Item', href: '/' }
      ]
    });
  };

  const removeNavItem = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      navigation_items: settings.navigation_items.filter((_, i) => i !== index)
    });
  };

  const updateNavItem = (index: number, field: string, value: any) => {
    if (!settings) return;
    const updated = [...settings.navigation_items];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, navigation_items: updated });
  };

  const addDropdownItem = (navIndex: number) => {
    if (!settings) return;
    const updated = [...settings.navigation_items];
    if (!updated[navIndex].dropdown) {
      updated[navIndex].dropdown = [];
    }
    updated[navIndex].dropdown!.push({ name: 'New Dropdown Item', href: '/' });
    setSettings({ ...settings, navigation_items: updated });
  };

  const removeDropdownItem = (navIndex: number, dropdownIndex: number) => {
    if (!settings) return;
    const updated = [...settings.navigation_items];
    updated[navIndex].dropdown = updated[navIndex].dropdown!.filter((_, i) => i !== dropdownIndex);
    setSettings({ ...settings, navigation_items: updated });
  };

  const updateDropdownItem = (navIndex: number, dropdownIndex: number, field: string, value: any) => {
    if (!settings) return;
    const updated = [...settings.navigation_items];
    updated[navIndex].dropdown![dropdownIndex] = {
      ...updated[navIndex].dropdown![dropdownIndex],
      [field]: value
    };
    setSettings({ ...settings, navigation_items: updated });
  };

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    if (!settings) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= settings.navigation_items.length) return;

    const updated = [...settings.navigation_items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSettings({ ...settings, navigation_items: updated });
  };

  // Footer helpers
  const addFooterLink = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      footer_links: [
        ...settings.footer_links,
        { name: 'New Link', href: '/' }
      ]
    });
  };

  const removeFooterLink = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      footer_links: settings.footer_links.filter((_, i) => i !== index)
    });
  };

  const updateFooterLink = (index: number, field: string, value: any) => {
    if (!settings) return;
    const updated = [...settings.footer_links];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, footer_links: updated });
  };

  const addSocialLink = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      social_links: [
        ...settings.social_links,
        { name: 'New Platform', href: '#', icon: 'linkedin' }
      ]
    });
  };

  const removeSocialLink = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      social_links: settings.social_links.filter((_, i) => i !== index)
    });
  };

  const updateSocialLink = (index: number, field: string, value: any) => {
    if (!settings) return;
    const updated = [...settings.social_links];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, social_links: updated });
  };

  if (initialLoading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading site settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage global site settings including navigation, footer, and metadata
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 rounded-md p-4 ${
            saveMessage.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'navigation', label: 'Navigation' },
              { id: 'footer', label: 'Footer' },
              { id: 'metadata', label: 'SEO & Metadata' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Navigation Tab */}
        {activeTab === 'navigation' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Navigation Menu Items</h2>
              <button
                onClick={addNavItem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Menu Item
              </button>
            </div>

            <div className="space-y-4">
              {settings.navigation_items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateNavItem(index, 'name', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link (href)
                          </label>
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => updateNavItem(index, 'href', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Dropdown Items */}
                      {item.dropdown && item.dropdown.length > 0 && (
                        <div className="ml-8 mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Dropdown Items:</h4>
                          {item.dropdown.map((dropItem, dropIndex) => (
                            <div key={dropIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={dropItem.name}
                                onChange={(e) => updateDropdownItem(index, dropIndex, 'name', e.target.value)}
                                placeholder="Name"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                              <input
                                type="text"
                                value={dropItem.href}
                                onChange={(e) => updateDropdownItem(index, dropIndex, 'href', e.target.value)}
                                placeholder="Link"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                              <button
                                onClick={() => removeDropdownItem(index, dropIndex)}
                                className="p-2 text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => addDropdownItem(index)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        + Add Dropdown Item
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => moveNavItem(index, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-30"
                      >
                        <ArrowUpIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => moveNavItem(index, 'down')}
                        disabled={index === settings.navigation_items.length - 1}
                        className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-30"
                      >
                        <ArrowDownIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => removeNavItem(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            {/* Footer Description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Footer Description</h2>
              <textarea
                value={settings.footer_description}
                onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Footer Links */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Footer Links</h2>
                <button
                  onClick={addFooterLink}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Link
                </button>
              </div>
              <div className="space-y-2">
                {settings.footer_links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateFooterLink(index, 'name', e.target.value)}
                      placeholder="Name"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateFooterLink(index, 'href', e.target.value)}
                      placeholder="Link"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      onClick={() => removeFooterLink(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Social Media Links</h2>
                <button
                  onClick={addSocialLink}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Social Link
                </button>
              </div>
              <div className="space-y-2">
                {settings.social_links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                      placeholder="Platform Name"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                      placeholder="URL"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <select
                      value={link.icon}
                      onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                    </select>
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Copyright Text</h2>
              <input
                type="text"
                value={settings.copyright_text}
                onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Metadata Tab */}
        {activeTab === 'metadata' && (
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Title
              </label>
              <input
                type="text"
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Keywords
              </label>
              <textarea
                value={settings.site_keywords}
                onChange={(e) => setSettings({ ...settings, site_keywords: e.target.value })}
                rows={2}
                placeholder="keyword1, keyword2, keyword3"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Open Graph Image URL
              </label>
              <input
                type="url"
                value={settings.og_image}
                onChange={(e) => setSettings({ ...settings, og_image: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter Handle (without @)
              </label>
              <input
                type="text"
                value={settings.twitter_handle}
                onChange={(e) => setSettings({ ...settings, twitter_handle: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Address
              </label>
              <textarea
                value={settings.contact_address}
                onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
