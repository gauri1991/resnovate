import { useState, useEffect } from 'react';
import { cmsAPI } from '@/lib/api';

export function useCMSContent(page: string) {
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await cmsAPI.getSections(page);

        // Convert array of sections to object keyed by section_key
        const sectionsMap = response.data.reduce((acc: Record<string, any>, section: any) => {
          if (section.enabled) {
            acc[section.section_key] = section.content;
          }
          return acc;
        }, {});

        setSections(sectionsMap);
      } catch (err) {
        console.error(`Error fetching CMS content for ${page}:`, err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [page]);

  return { sections, loading, error };
}
