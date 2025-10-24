import { useState, useEffect } from 'react';
import { cmsAPI } from '@/lib/api';

export interface NavigationItem {
  name: string;
  href: string;
  dropdown?: NavigationItem[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface SiteSettings {
  id?: number;
  navigation_items: NavigationItem[];
  footer_description: string;
  footer_links: NavigationItem[];
  social_links: SocialLink[];
  copyright_text: string;
  site_title: string;
  site_description: string;
  site_keywords: string;
  og_image: string;
  twitter_handle: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await cmsAPI.getSiteSettings();
        setSettings(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch site settings:', err);
        setError(err.message || 'Failed to load site settings');
        // Set empty defaults if fetch fails
        setSettings({
          navigation_items: [],
          footer_description: '',
          footer_links: [],
          social_links: [],
          copyright_text: '',
          site_title: '',
          site_description: '',
          site_keywords: '',
          og_image: '',
          twitter_handle: '',
          contact_email: '',
          contact_phone: '',
          contact_address: '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
