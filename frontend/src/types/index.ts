export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: number;
  author_name: string;
  featured_image: string | null;
  published_at: string;
  updated_at: string;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  tags: string[];
}

export interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  client_industry: string;
  challenge: string;
  solution: string;
  results: string;
  metrics: Record<string, any>;
  featured_image: string | null;
  created_at: string;
  is_featured: boolean;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price_range: string;
  duration: string;
  features: string[];
  icon: string;
  order: number;
  is_active: boolean;
}

export interface Lead {
  id?: number;
  name: string;
  email: string;
  company?: string;
  industry?: string;
  phone?: string;
  source?: string;
  message?: string;
  budget_range?: string;
  project_timeline?: string;
}

export interface ConsultationSlot {
  id: number;
  date_time: string;
  duration_minutes: number;
  is_available: boolean;
  price: string;
  meeting_type: string;
}

export interface Booking {
  id?: number;
  lead: Lead;
  slot: ConsultationSlot;
  status: string;
  paid: boolean;
  meeting_link?: string;
  notes?: string;
}

export interface PageSection {
  id: number;
  page_identifier: string;
  page_display_name: string;
  section_name: string;
  section_key: string;
  enabled: boolean;
  order: number;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CMSPage {
  name: string;
  sections: PageSection[];
}

export interface CMSPages {
  [key: string]: CMSPage;
}