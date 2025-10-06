import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', response.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// API service functions
export const contentAPI = {
  getBlogPosts: () => api.get('/blog-posts/'),
  getBlogPost: (slug: string) => api.get(`/blog-posts/${slug}/`),
  getCaseStudies: () => api.get('/case-studies/'),
  getCaseStudy: (slug: string) => api.get(`/case-studies/${slug}/`),
  getServices: () => api.get('/services/'),
};

export const leadsAPI = {
  createLead: (data: any) => api.post('/leads/', data),
  quickContact: (data: any) => api.post('/leads/quick_contact/', data),
  subscribeNewsletter: (email: string) => api.post('/newsletter/subscribe/', { email }),
};

export const consultationAPI = {
  getAvailableSlots: () => api.get('/consultation-slots/available/'),
  createBooking: (data: any) => api.post('/bookings/', data),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/dashboard/stats/'),
  getBlogPosts: (params?: any) => api.get('/blog-posts/', { params }),
  createBlogPost: (data: any) => api.post('/blog-posts/', data),
  updateBlogPost: (id: number, data: any) => api.put(`/blog-posts/${id}/`, data),
  deleteBlogPost: (id: number) => api.delete(`/blog-posts/${id}/`),
  getCaseStudies: (params?: any) => api.get('/case-studies/', { params }),
  getServices: (params?: any) => api.get('/services/', { params }),
  getLeads: (params?: any) => api.get('/leads/', { params }),
  createLead: (data: any) => api.post('/leads/', data),
  updateLead: (id: number, data: any) => api.patch(`/leads/${id}/`, data),
  deleteLead: (id: number) => api.delete(`/leads/${id}/`),
  getBookings: (params?: any) => api.get('/bookings/', { params }),
  getMedia: (params?: any) => api.get('/media/', { params }),
  uploadMedia: (data: FormData) => api.post('/media/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMedia: (id: number, data: any) => api.patch(`/media/${id}/`, data),
  deleteMedia: (id: number) => api.delete(`/media/${id}/`),
};

export const marketingAPI = {
  // Campaigns
  getCampaigns: (params?: any) => api.get('/marketing/campaigns/', { params }),
  getCampaign: (id: number) => api.get(`/marketing/campaigns/${id}/`),
  createCampaign: (data: any) => api.post('/marketing/campaigns/', data),
  updateCampaign: (id: number, data: any) => api.put(`/marketing/campaigns/${id}/`, data),
  deleteCampaign: (id: number) => api.delete(`/marketing/campaigns/${id}/`),
  duplicateCampaign: (id: number) => api.post(`/marketing/campaigns/${id}/duplicate/`),
  pauseCampaign: (id: number) => api.post(`/marketing/campaigns/${id}/pause/`),
  resumeCampaign: (id: number) => api.post(`/marketing/campaigns/${id}/resume/`),
  optimizeCampaign: (id: number) => api.post(`/marketing/campaigns/${id}/optimize/`),
  getCampaignMetrics: (id: number, params?: any) => api.get(`/marketing/campaigns/${id}/performance_metrics/`, { params }),
  getCampaignSummary: () => api.get('/marketing/campaigns/dashboard_summary/'),
  
  // Content Templates
  getContentTemplates: (params?: any) => api.get('/marketing/content-templates/', { params }),
  getContentTemplate: (id: number) => api.get(`/marketing/content-templates/${id}/`),
  createContentTemplate: (data: any) => api.post('/marketing/content-templates/', data),
  updateContentTemplate: (id: number, data: any) => api.put(`/marketing/content-templates/${id}/`, data),
  deleteContentTemplate: (id: number) => api.delete(`/marketing/content-templates/${id}/`),
  getTopPerformingTemplates: () => api.get('/marketing/content-templates/top_performing/'),
  
  // Social Media Campaigns
  getSocialCampaigns: (params?: any) => api.get('/marketing/social-campaigns/', { params }),
  createSocialCampaign: (data: any) => api.post('/marketing/social-campaigns/', data),
  updateSocialCampaign: (id: number, data: any) => api.put(`/marketing/social-campaigns/${id}/`, data),
  deleteSocialCampaign: (id: number) => api.delete(`/marketing/social-campaigns/${id}/`),
  
  // Paid Campaigns
  getPaidCampaigns: (params?: any) => api.get('/marketing/paid-campaigns/', { params }),
  createPaidCampaign: (data: any) => api.post('/marketing/paid-campaigns/', data),
  updatePaidCampaign: (id: number, data: any) => api.put(`/marketing/paid-campaigns/${id}/`, data),
  deletePaidCampaign: (id: number) => api.delete(`/marketing/paid-campaigns/${id}/`),
  getPaidCampaignSummary: () => api.get('/marketing/paid-campaigns/performance_summary/'),
  
  // Performance Metrics
  getPerformanceMetrics: (params?: any) => api.get('/marketing/performance-metrics/', { params }),
  
  // Campaign Orchestration
  getOrchestrations: (params?: any) => api.get('/marketing/orchestrations/', { params }),
  createOrchestration: (data: any) => api.post('/marketing/orchestrations/', data),
  updateOrchestration: (id: number, data: any) => api.put(`/marketing/orchestrations/${id}/`, data),
  deleteOrchestration: (id: number) => api.delete(`/marketing/orchestrations/${id}/`),
  
  // Email Marketing & Automation
  getEmailSequences: (params?: any) => api.get('/marketing/email-sequences/', { params }),
  getEmailSequence: (id: number) => api.get(`/marketing/email-sequences/${id}/`),
  createEmailSequence: (data: any) => api.post('/marketing/email-sequences/', data),
  updateEmailSequence: (id: number, data: any) => api.put(`/marketing/email-sequences/${id}/`, data),
  deleteEmailSequence: (id: number) => api.delete(`/marketing/email-sequences/${id}/`),
  pauseEmailSequence: (id: number) => api.post(`/marketing/email-sequences/${id}/pause/`),
  resumeEmailSequence: (id: number) => api.post(`/marketing/email-sequences/${id}/resume/`),
  
  // Email Templates
  getEmailTemplates: (params?: any) => api.get('/marketing/email-templates/', { params }),
  getEmailTemplate: (id: number) => api.get(`/marketing/email-templates/${id}/`),
  createEmailTemplate: (data: any) => api.post('/marketing/email-templates/', data),
  updateEmailTemplate: (id: number, data: any) => api.put(`/marketing/email-templates/${id}/`, data),
  deleteEmailTemplate: (id: number) => api.delete(`/marketing/email-templates/${id}/`),
  getTopEmailTemplates: () => api.get('/marketing/email-templates/top_performing/'),
  
  // Behavioral Triggers
  getBehavioralTriggers: (params?: any) => api.get('/marketing/behavioral-triggers/', { params }),
  getBehavioralTrigger: (id: number) => api.get(`/marketing/behavioral-triggers/${id}/`),
  createBehavioralTrigger: (data: any) => api.post('/marketing/behavioral-triggers/', data),
  updateBehavioralTrigger: (id: number, data: any) => api.put(`/marketing/behavioral-triggers/${id}/`, data),
  deleteBehavioralTrigger: (id: number) => api.delete(`/marketing/behavioral-triggers/${id}/`),
  toggleBehavioralTrigger: (id: number) => api.post(`/marketing/behavioral-triggers/${id}/toggle/`),
  
  // Conversion Optimization Engine
  getLandingPages: (params?: any) => api.get('/marketing/landing-pages/', { params }),
  getLandingPage: (id: number) => api.get(`/marketing/landing-pages/${id}/`),
  createLandingPage: (data: any) => api.post('/marketing/landing-pages/', data),
  updateLandingPage: (id: number, data: any) => api.put(`/marketing/landing-pages/${id}/`, data),
  deleteLandingPage: (id: number) => api.delete(`/marketing/landing-pages/${id}/`),
  publishLandingPage: (id: number) => api.post(`/marketing/landing-pages/${id}/publish/`),
  duplicateLandingPage: (id: number) => api.post(`/marketing/landing-pages/${id}/duplicate/`),
  getLandingPageSummary: () => api.get('/marketing/landing-pages/summary/'),
  
  // Page Variants (A/B Testing)
  getPageVariants: (params?: any) => api.get('/marketing/page-variants/', { params }),
  getPageVariant: (id: number) => api.get(`/marketing/page-variants/${id}/`),
  createPageVariant: (data: any) => api.post('/marketing/page-variants/', data),
  updatePageVariant: (id: number, data: any) => api.put(`/marketing/page-variants/${id}/`, data),
  deletePageVariant: (id: number) => api.delete(`/marketing/page-variants/${id}/`),
  declareVariantWinner: (id: number) => api.post(`/marketing/page-variants/${id}/declare_winner/`),
  
  // Conversion Funnels
  getConversionFunnels: (params?: any) => api.get('/marketing/conversion-funnels/', { params }),
  getConversionFunnel: (id: number) => api.get(`/marketing/conversion-funnels/${id}/`),
  createConversionFunnel: (data: any) => api.post('/marketing/conversion-funnels/', data),
  updateConversionFunnel: (id: number, data: any) => api.put(`/marketing/conversion-funnels/${id}/`, data),
  deleteConversionFunnel: (id: number) => api.delete(`/marketing/conversion-funnels/${id}/`),
  analyzeFunnel: (id: number) => api.post(`/marketing/conversion-funnels/${id}/analyze/`),
  
  // Funnel Steps
  getFunnelSteps: (params?: any) => api.get('/marketing/funnel-steps/', { params }),
  createFunnelStep: (data: any) => api.post('/marketing/funnel-steps/', data),
  updateFunnelStep: (id: number, data: any) => api.put(`/marketing/funnel-steps/${id}/`, data),
  deleteFunnelStep: (id: number) => api.delete(`/marketing/funnel-steps/${id}/`),
  
  // Conversion Optimizations
  getConversionOptimizations: (params?: any) => api.get('/marketing/conversion-optimizations/', { params }),
  getConversionOptimization: (id: number) => api.get(`/marketing/conversion-optimizations/${id}/`),
  createConversionOptimization: (data: any) => api.post('/marketing/conversion-optimizations/', data),
  updateConversionOptimization: (id: number, data: any) => api.put(`/marketing/conversion-optimizations/${id}/`, data),
  deleteConversionOptimization: (id: number) => api.delete(`/marketing/conversion-optimizations/${id}/`),
  startOptimizationTest: (id: number) => api.post(`/marketing/conversion-optimizations/${id}/start_test/`),
  stopOptimizationTest: (id: number) => api.post(`/marketing/conversion-optimizations/${id}/stop_test/`),
  getOptimizationResults: (id: number) => api.get(`/marketing/conversion-optimizations/${id}/results/`),
  getOptimizationSummary: () => api.get('/marketing/conversion-optimizations/summary/'),
  
  // User Journeys
  getUserJourneys: (params?: any) => api.get('/marketing/user-journeys/', { params }),
  getUserJourney: (id: number) => api.get(`/marketing/user-journeys/${id}/`),
  createUserJourney: (data: any) => api.post('/marketing/user-journeys/', data),
  updateUserJourney: (id: number, data: any) => api.put(`/marketing/user-journeys/${id}/`, data),
  deleteUserJourney: (id: number) => api.delete(`/marketing/user-journeys/${id}/`),
  analyzeUserJourney: (id: number) => api.post(`/marketing/user-journeys/${id}/analyze_journey/`),
  
  // Exit Intent Triggers
  getExitIntentTriggers: (params?: any) => api.get('/marketing/exit-intent-triggers/', { params }),
  getExitIntentTrigger: (id: number) => api.get(`/marketing/exit-intent-triggers/${id}/`),
  createExitIntentTrigger: (data: any) => api.post('/marketing/exit-intent-triggers/', data),
  updateExitIntentTrigger: (id: number, data: any) => api.put(`/marketing/exit-intent-triggers/${id}/`, data),
  deleteExitIntentTrigger: (id: number) => api.delete(`/marketing/exit-intent-triggers/${id}/`),
  toggleExitIntentTrigger: (id: number) => api.post(`/marketing/exit-intent-triggers/${id}/toggle/`),
  getExitIntentSummary: () => api.get('/marketing/exit-intent-triggers/performance_summary/'),
  
  // Marketing Automation Workflows
  getWorkflowTemplates: (params?: any) => api.get('/marketing/workflow-templates/', { params }),
  getWorkflowTemplate: (id: number) => api.get(`/marketing/workflow-templates/${id}/`),
  createWorkflowTemplate: (data: any) => api.post('/marketing/workflow-templates/', data),
  updateWorkflowTemplate: (id: number, data: any) => api.put(`/marketing/workflow-templates/${id}/`, data),
  deleteWorkflowTemplate: (id: number) => api.delete(`/marketing/workflow-templates/${id}/`),
  getWorkflowTemplateCategories: () => api.get('/marketing/workflow-templates/categories/'),
  getWorkflowTemplateStats: () => api.get('/marketing/workflow-templates/stats/'),
  
  // Workflows
  getWorkflows: (params?: any) => api.get('/marketing/workflows/', { params }),
  getWorkflow: (id: number) => api.get(`/marketing/workflows/${id}/`),
  createWorkflow: (data: any) => api.post('/marketing/workflows/', data),
  updateWorkflow: (id: number, data: any) => api.put(`/marketing/workflows/${id}/`, data),
  deleteWorkflow: (id: number) => api.delete(`/marketing/workflows/${id}/`),
  activateWorkflow: (id: number) => api.post(`/marketing/workflows/${id}/activate/`),
  pauseWorkflow: (id: number) => api.post(`/marketing/workflows/${id}/pause/`),
  duplicateWorkflow: (id: number) => api.post(`/marketing/workflows/${id}/duplicate/`),
  getWorkflowSummary: () => api.get('/marketing/workflows/summary/'),
  getWorkflowPerformance: () => api.get('/marketing/workflows/performance/'),
  
  // Workflow Steps
  getWorkflowSteps: (params?: any) => api.get('/marketing/workflow-steps/', { params }),
  getWorkflowStep: (id: number) => api.get(`/marketing/workflow-steps/${id}/`),
  createWorkflowStep: (data: any) => api.post('/marketing/workflow-steps/', data),
  updateWorkflowStep: (id: number, data: any) => api.put(`/marketing/workflow-steps/${id}/`, data),
  deleteWorkflowStep: (id: number) => api.delete(`/marketing/workflow-steps/${id}/`),
  
  // Workflow Participants
  getWorkflowParticipants: (params?: any) => api.get('/marketing/workflow-participants/', { params }),
  getWorkflowParticipant: (id: number) => api.get(`/marketing/workflow-participants/${id}/`),
  createWorkflowParticipant: (data: any) => api.post('/marketing/workflow-participants/', data),
  updateWorkflowParticipant: (id: number, data: any) => api.put(`/marketing/workflow-participants/${id}/`, data),
  deleteWorkflowParticipant: (id: number) => api.delete(`/marketing/workflow-participants/${id}/`),
  
  // Workflow Executions
  getWorkflowExecutions: (params?: any) => api.get('/marketing/workflow-executions/', { params }),
  getWorkflowExecution: (id: number) => api.get(`/marketing/workflow-executions/${id}/`),
  
  // Workflow Analytics
  getWorkflowAnalytics: (params?: any) => api.get('/marketing/workflow-analytics/', { params }),
  getWorkflowAnalytic: (id: number) => api.get(`/marketing/workflow-analytics/${id}/`),
  
  // Workflow Triggers
  getWorkflowTriggers: (params?: any) => api.get('/marketing/workflow-triggers/', { params }),
  getWorkflowTrigger: (id: number) => api.get(`/marketing/workflow-triggers/${id}/`),
  createWorkflowTrigger: (data: any) => api.post('/marketing/workflow-triggers/', data),
  updateWorkflowTrigger: (id: number, data: any) => api.put(`/marketing/workflow-triggers/${id}/`, data),
  deleteWorkflowTrigger: (id: number) => api.delete(`/marketing/workflow-triggers/${id}/`),
  toggleWorkflowTrigger: (id: number) => api.post(`/marketing/workflow-triggers/${id}/toggle/`),
  
  // Workflow Actions
  getWorkflowActions: (params?: any) => api.get('/marketing/workflow-actions/', { params }),
  getWorkflowAction: (id: number) => api.get(`/marketing/workflow-actions/${id}/`),
  createWorkflowAction: (data: any) => api.post('/marketing/workflow-actions/', data),
  updateWorkflowAction: (id: number, data: any) => api.put(`/marketing/workflow-actions/${id}/`, data),
  deleteWorkflowAction: (id: number) => api.delete(`/marketing/workflow-actions/${id}/`),
};

export default api;