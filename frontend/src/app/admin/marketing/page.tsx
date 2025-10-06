'use client';

import { useState, useEffect } from 'react';
import { marketingAPI } from '@/lib/api';
import CampaignCreator from '@/components/marketing/CampaignCreator';
import EmailCampaignManager from '@/components/marketing/EmailCampaignManager';
import LandingPageBuilder from '@/components/marketing/LandingPageBuilder';
import WorkflowBuilder from '@/components/marketing/WorkflowBuilder';
import {
  MegaphoneIcon,
  ChartBarIcon,
  UsersIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  BeakerIcon,
  FunnelIcon,
  BoltIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  ShieldCheckIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface Campaign {
  id: number;
  name: string;
  type: 'email' | 'social' | 'content' | 'ads' | 'automation' | 'retargeting';
  status: 'active' | 'paused' | 'draft' | 'completed';
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  ctr: number;
  created_at: string;
  ai_score: number;
  ab_test: boolean;
  funnel_stage: string;
  attribution_model: string;
}

interface MarketingStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalLeads: number;
  totalConversions: number;
  totalSpent: number;
  averageCTR: number;
  leadScore: number;
  conversionProbability: number;
  aiOptimization: number;
  churnRisk: number;
}

interface AutomationWorkflow {
  id: number;
  name: string;
  type: 'lead_nurturing' | 'onboarding' | 'reactivation' | 'upsell';
  status: 'active' | 'paused';
  triggers: string[];
  actions: string[];
  leads_processed: number;
  conversion_rate: number;
}

interface LeadScoringRule {
  id: number;
  criteria: string;
  points: number;
  category: 'demographic' | 'behavioral' | 'engagement' | 'intent';
  enabled: boolean;
}

interface ABTest {
  id: number;
  name: string;
  campaign_id: number;
  variant_a: string;
  variant_b: string;
  traffic_split: number;
  status: 'running' | 'completed' | 'paused';
  confidence: number;
  winner: 'a' | 'b' | 'none';
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([]);
  const [leadScoringRules, setLeadScoringRules] = useState<LeadScoringRule[]>([]);
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [stats, setStats] = useState<MarketingStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalLeads: 0,
    totalConversions: 0,
    totalSpent: 0,
    averageCTR: 0,
    leadScore: 0,
    conversionProbability: 0,
    aiOptimization: 0,
    churnRisk: 0,
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showCampaignCreator, setShowCampaignCreator] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real campaign data from API
        const [campaignResponse, summaryResponse] = await Promise.all([
          marketingAPI.getCampaigns(),
          marketingAPI.getCampaignSummary()
        ]);
        
        // Transform API data to match our interface
        const transformedCampaigns: Campaign[] = campaignResponse.data.map((campaign: any) => ({
          id: campaign.id,
          name: campaign.name,
          type: campaign.campaign_type,
          status: campaign.status,
          budget: parseFloat(campaign.budget || 0),
          spent: parseFloat(campaign.spent || 0),
          leads: campaign.leads_generated || 0,
          conversions: campaign.conversions || 0,
          ctr: campaign.click_through_rate || 0,
          created_at: campaign.created_at,
          ai_score: campaign.ai_performance_score || 0,
          ab_test: campaign.ab_testing_enabled || false,
          funnel_stage: campaign.objective || 'awareness',
          attribution_model: campaign.attribution_model || 'last_touch',
        }));
        
        setCampaigns(transformedCampaigns);
        
        // Update stats with real data
        if (summaryResponse.data) {
          const realStats: MarketingStats = {
            totalCampaigns: summaryResponse.data.total_campaigns || 0,
            activeCampaigns: summaryResponse.data.active_campaigns || 0,
            totalLeads: summaryResponse.data.total_leads || 0,
            totalConversions: summaryResponse.data.total_conversions || 0,
            totalSpent: parseFloat(summaryResponse.data.total_spend || 0),
            averageCTR: summaryResponse.data.average_roas || 0,
            leadScore: 78.5, // Mock for now
            conversionProbability: 82.3, // Mock for now
            aiOptimization: 91.2, // Mock for now
            churnRisk: 15.7, // Mock for now
          };
          setStats(realStats);
        }
        
      } catch (error) {
        console.error('Error fetching marketing data:', error);
        // Fallback to mock data if API fails
        const mockCampaigns: Campaign[] = [
          {
            id: 1,
            name: 'AI Consulting Lead Generation',
            type: 'content',
            status: 'active',
            budget: 5000,
            spent: 2340,
            leads: 45,
            conversions: 12,
            ctr: 3.2,
            created_at: '2024-01-15',
            ai_score: 87,
            ab_test: true,
            funnel_stage: 'awareness',
            attribution_model: 'first_touch',
          },
          {
            id: 2,
            name: 'LinkedIn Professional Outreach',
            type: 'social',
            status: 'active',
            budget: 3000,
            spent: 1890,
            leads: 28,
            conversions: 8,
            ctr: 2.8,
            created_at: '2024-01-20',
            ai_score: 92,
            ab_test: false,
            funnel_stage: 'consideration',
            attribution_model: 'last_touch',
          },
          {
            id: 3,
            name: 'Newsletter Automation Series',
            type: 'automation',
            status: 'active',
            budget: 2000,
            spent: 450,
            leads: 67,
            conversions: 19,
            ctr: 4.1,
            created_at: '2024-01-25',
            ai_score: 95,
            ab_test: true,
            funnel_stage: 'conversion',
            attribution_model: 'multi_touch',
          },
          {
            id: 4,
            name: 'Retargeting - High Intent Visitors',
            type: 'retargeting',
            status: 'active',
            budget: 3500,
            spent: 2100,
            leads: 52,
            conversions: 23,
            ctr: 5.2,
            created_at: '2024-01-30',
            ai_score: 89,
            ab_test: true,
            funnel_stage: 'conversion',
            attribution_model: 'data_driven',
          },
        ];
        setCampaigns(mockCampaigns);
        
        // Set default stats for fallback
        const mockStats: MarketingStats = {
          totalCampaigns: mockCampaigns.length,
          activeCampaigns: mockCampaigns.filter(c => c.status === 'active').length,
          totalLeads: mockCampaigns.reduce((sum, c) => sum + c.leads, 0),
          totalConversions: mockCampaigns.reduce((sum, c) => sum + c.conversions, 0),
          totalSpent: mockCampaigns.reduce((sum, c) => sum + c.spent, 0),
          averageCTR: mockCampaigns.reduce((sum, c) => sum + c.ctr, 0) / mockCampaigns.length,
          leadScore: 78.5,
          conversionProbability: 82.3,
          aiOptimization: 91.2,
          churnRisk: 15.7,
        };
        setStats(mockStats);
      }
    };
    
    fetchData();

    const mockAutomationWorkflows: AutomationWorkflow[] = [
      {
        id: 1,
        name: 'Welcome & Onboarding Sequence',
        type: 'onboarding',
        status: 'active',
        triggers: ['form_submission', 'email_signup'],
        actions: ['send_welcome_email', 'add_to_nurture_list', 'schedule_demo'],
        leads_processed: 234,
        conversion_rate: 18.5,
      },
      {
        id: 2,
        name: 'AI Consultation Nurture',
        type: 'lead_nurturing',
        status: 'active',
        triggers: ['downloaded_whitepaper', 'visited_pricing'],
        actions: ['send_case_study', 'schedule_consultation', 'lead_scoring_update'],
        leads_processed: 156,
        conversion_rate: 24.3,
      },
      {
        id: 3,
        name: 'Churn Prevention',
        type: 'reactivation',
        status: 'active',
        triggers: ['no_engagement_30_days', 'low_activity_score'],
        actions: ['send_reactivation_email', 'offer_consultation', 'update_lead_score'],
        leads_processed: 89,
        conversion_rate: 12.4,
      },
    ];

    const mockLeadScoringRules: LeadScoringRule[] = [
      { id: 1, criteria: 'Company Size: 100+ employees', points: 20, category: 'demographic', enabled: true },
      { id: 2, criteria: 'Job Title: C-Level/VP', points: 25, category: 'demographic', enabled: true },
      { id: 3, criteria: 'Downloaded AI Whitepaper', points: 15, category: 'behavioral', enabled: true },
      { id: 4, criteria: 'Visited Pricing Page', points: 30, category: 'intent', enabled: true },
      { id: 5, criteria: 'Email Open Rate > 50%', points: 10, category: 'engagement', enabled: true },
      { id: 6, criteria: 'Attended Webinar', points: 35, category: 'behavioral', enabled: true },
    ];

    const mockAbTests: ABTest[] = [
      {
        id: 1,
        name: 'Email Subject Line Test',
        campaign_id: 1,
        variant_a: 'Transform Your Business with AI',
        variant_b: 'AI Solutions That Actually Work',
        traffic_split: 50,
        status: 'running',
        confidence: 78,
        winner: 'none',
      },
      {
        id: 2,
        name: 'Landing Page CTA Test',
        campaign_id: 3,
        variant_a: 'Get Free Consultation',
        variant_b: 'Schedule AI Assessment',
        traffic_split: 50,
        status: 'completed',
        confidence: 95,
        winner: 'b',
      },
    ];

    setAutomationWorkflows(mockAutomationWorkflows);
    setLeadScoringRules(mockLeadScoringRules);
    setAbTests(mockAbTests);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <EnvelopeIcon className="h-4 w-4" />;
      case 'social': return <UsersIcon className="h-4 w-4" />;
      case 'content': return <MegaphoneIcon className="h-4 w-4" />;
      case 'ads': return <GlobeAltIcon className="h-4 w-4" />;
      case 'automation': return <BoltIcon className="h-4 w-4" />;
      case 'retargeting': return <FunnelIcon className="h-4 w-4" />;
      default: return <MegaphoneIcon className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const handleCampaignCreated = async () => {
    setShowCampaignCreator(false);
    // Refresh campaigns data
    try {
      const [campaignResponse, summaryResponse] = await Promise.all([
        marketingAPI.getCampaigns(),
        marketingAPI.getCampaignSummary()
      ]);
      
      const transformedCampaigns: Campaign[] = campaignResponse.data.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        type: campaign.campaign_type,
        status: campaign.status,
        budget: parseFloat(campaign.budget || 0),
        spent: parseFloat(campaign.spent || 0),
        leads: campaign.leads_generated || 0,
        conversions: campaign.conversions || 0,
        ctr: campaign.click_through_rate || 0,
        created_at: campaign.created_at,
        ai_score: campaign.ai_performance_score || 0,
        ab_test: campaign.ab_testing_enabled || false,
        funnel_stage: campaign.objective || 'awareness',
        attribution_model: campaign.attribution_model || 'last_touch',
      }));
      
      setCampaigns(transformedCampaigns);
      
      if (summaryResponse.data) {
        const realStats: MarketingStats = {
          totalCampaigns: summaryResponse.data.total_campaigns || 0,
          activeCampaigns: summaryResponse.data.active_campaigns || 0,
          totalLeads: summaryResponse.data.total_leads || 0,
          totalConversions: summaryResponse.data.total_conversions || 0,
          totalSpent: parseFloat(summaryResponse.data.total_spend || 0),
          averageCTR: summaryResponse.data.average_roas || 0,
          leadScore: 78.5,
          conversionProbability: 82.3,
          aiOptimization: 91.2,
          churnRisk: 15.7,
        };
        setStats(realStats);
      }
    } catch (error) {
      console.error('Error refreshing campaign data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Center</h1>
          <p className="text-gray-600">Manage campaigns and track marketing performance</p>
        </div>
        <button 
          onClick={() => setShowCampaignCreator(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Enhanced AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <RocketLaunchIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Optimization Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(stats.aiOptimization)}`}>
                  {stats.aiOptimization.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <ArrowTrendingUpIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Probability</p>
                <p className={`text-2xl font-bold ${getScoreColor(stats.conversionProbability)}`}>
                  {stats.conversionProbability.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="text-xs text-green-500">
              <StarIcon className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FireIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Lead Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(stats.leadScore)}`}>
                  {stats.leadScore.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="text-xs text-purple-500">
              <LightBulbIcon className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Churn Risk</p>
                <p className={`text-2xl font-bold ${stats.churnRisk < 20 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.churnRisk.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="text-xs text-orange-500">
              <ClockIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <MegaphoneIcon className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-blue-600">Total Campaigns</p>
              <p className="text-lg font-bold text-blue-900">{stats.totalCampaigns}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <UsersIcon className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-green-600">Total Leads</p>
              <p className="text-lg font-bold text-green-900">{stats.totalLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-purple-600">Conversions</p>
              <p className="text-lg font-bold text-purple-900">{stats.totalConversions}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center">
            <GlobeAltIcon className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-orange-600">Total Spent</p>
              <p className="text-lg font-bold text-orange-900">${stats.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'campaigns', label: 'Campaigns', icon: MegaphoneIcon },
            { id: 'email', label: 'Email Marketing', icon: EnvelopeIcon },
            { id: 'landing-pages', label: 'Landing Pages', icon: GlobeAltIcon },
            { id: 'workflows', label: 'Workflows', icon: ArrowPathIcon },
            { id: 'automation', label: 'Automation', icon: BoltIcon },
            { id: 'lead-scoring', label: 'Lead Scoring', icon: StarIcon },
            { id: 'ab-testing', label: 'A/B Testing', icon: BeakerIcon },
            { id: 'analytics', label: 'Analytics', icon: DocumentChartBarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.averageCTR.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Average CTR</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {((stats.totalConversions / stats.totalLeads) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  ${(stats.totalSpent / stats.totalConversions).toFixed(0)}
                </p>
                <p className="text-sm text-gray-600">Cost per Conversion</p>
              </div>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Campaigns</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conv Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          {campaign.ab_test && (
                            <BeakerIcon className="ml-2 h-4 w-4 text-blue-500" title="A/B Test Active" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{campaign.funnel_stage} • {campaign.attribution_model.replace('_', ' ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          {getTypeIcon(campaign.type)}
                          <span className="ml-2 capitalize">{campaign.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${getScoreColor(campaign.ai_score)}`}>
                            {campaign.ai_score}
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${campaign.ai_score}%`}}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.leads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {((campaign.conversions / campaign.leads) * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${campaign.spent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900" title="View Details">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="Edit Campaign">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900" title="AI Optimize">
                            <RocketLaunchIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Delete">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Campaign Management</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowCampaignCreator(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>New Campaign</span>
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2">
                  <RocketLaunchIcon className="h-4 w-4" />
                  <span>AI Optimize All</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Content Marketing</h4>
                  <p className="text-sm text-blue-700 mb-3">Blog posts, whitepapers, case studies</p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Create Campaign →</button>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Email Automation</h4>
                  <p className="text-sm text-green-700 mb-3">Drip campaigns, newsletters, nurturing</p>
                  <button 
                    onClick={() => setSelectedTab('email')}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Manage Email Campaigns →
                  </button>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Paid Advertising</h4>
                  <p className="text-sm text-purple-700 mb-3">Google Ads, LinkedIn, retargeting</p>
                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">Create Campaign →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'email' && (
        <EmailCampaignManager />
      )}

      {selectedTab === 'landing-pages' && (
        <LandingPageBuilder />
      )}

      {selectedTab === 'workflows' && (
        <WorkflowBuilder />
      )}

      {selectedTab === 'automation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Active Automation Workflows</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <PlusIcon className="h-4 w-4" />
                <span>New Workflow</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads Processed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {automationWorkflows.map((workflow) => (
                    <tr key={workflow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                        <div className="text-xs text-gray-500">
                          Triggers: {workflow.triggers.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize text-sm text-gray-500">{workflow.type.replace('_', ' ')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workflow.leads_processed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {workflow.conversion_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900" title="View Workflow">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="Edit Workflow">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900" title="AI Optimize">
                            <RocketLaunchIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'lead-scoring' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Lead Scoring Rules</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <PlusIcon className="h-4 w-4" />
                <span>New Rule</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {['demographic', 'behavioral', 'engagement', 'intent'].map((category) => (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 capitalize mb-2">{category}</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {leadScoringRules.filter(rule => rule.category === category && rule.enabled).length}
                    </div>
                    <p className="text-xs text-gray-500">Active Rules</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criteria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leadScoringRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.criteria}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize text-sm text-gray-500">{rule.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">+{rule.points}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-gray-600 hover:text-gray-900" title="Edit Rule">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900" title="Delete Rule">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'ab-testing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">A/B Testing Dashboard</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <BeakerIcon className="h-4 w-4" />
                <span>New Test</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Running Tests</h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {abTests.filter(test => test.status === 'running').length}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Completed Tests</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {abTests.filter(test => test.status === 'completed').length}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Avg Confidence</h4>
                  <div className="text-2xl font-bold text-purple-600">
                    {(abTests.reduce((sum, test) => sum + test.confidence, 0) / abTests.length).toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {abTests.map((test) => (
                      <tr key={test.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.name}</td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-500">
                            <div className="mb-1"><strong>A:</strong> {test.variant_a}</div>
                            <div><strong>B:</strong> {test.variant_b}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getConfidenceColor(test.confidence)}`}>
                            {test.confidence}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.winner === 'none' ? '-' : `Variant ${test.winner.toUpperCase()}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900" title="View Results">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900" title="Edit Test">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            {test.status === 'completed' && (
                              <button className="text-green-600 hover:text-green-900" title="Implement Winner">
                                <TrophyIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DocumentChartBarIcon className="h-5 w-5 mr-2" />
              Advanced Analytics & Attribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Customer Journey Analytics</h4>
                <p className="text-sm text-blue-700">Track touchpoints and attribution</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Predictive Scoring</h4>
                <p className="text-sm text-green-700">AI-powered lead qualification</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">ROI Attribution</h4>
                <p className="text-sm text-purple-700">Multi-touch attribution modeling</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Churn Prevention</h4>
                <p className="text-sm text-orange-700">Early warning system</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Creator Modal */}
      {showCampaignCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CampaignCreator
              isOpen={true}
              onClose={() => setShowCampaignCreator(false)}
              onCampaignCreated={handleCampaignCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
}