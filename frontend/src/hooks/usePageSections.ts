import { useState, useEffect } from 'react';
import { cmsAPI } from '@/lib/api';

interface PageSection {
  id: number;
  page_identifier: string;
  section_name: string;
  section_key: string;
  enabled: boolean;
  order: number;
  content: any;
  created_at: string;
  updated_at: string;
}

export function usePageSections(page: string) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await cmsAPI.getSections(page);

        // Filter only enabled sections and sort by order
        const enabledSections = response.data
          .filter((section: PageSection) => section.enabled)
          .sort((a: PageSection, b: PageSection) => a.order - b.order);

        setSections(enabledSections);
      } catch (err) {
        console.error(`Error fetching page sections for ${page}:`, err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (page) {
      fetchSections();
    }
  }, [page]);

  return { sections, loading, error };
}
