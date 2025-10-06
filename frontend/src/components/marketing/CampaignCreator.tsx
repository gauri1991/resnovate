'use client';

import { useState } from 'react';
import { marketingAPI } from '@/lib/api';
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  BeakerIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

interface CampaignCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: () => void;
}

export default function CampaignCreator({ isOpen, onClose, onCampaignCreated }: CampaignCreatorProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [campaignData, setCampaignData] = useState({
    // Basic Info
    name: '',
    description: '',
    campaign_type: 'content',
    objective: 'lead_generation',
    
    // Timeline
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    
    // Budget
    budget: '',
    daily_budget: '',
    
    // Targeting
    target_audience: {
      industries: [],
      company_size: '',
      job_titles: [],
      geographic: [],
    },
    target_keywords: [],
    channels: [],
    
    // AI Features
    ai_optimization_enabled: true,
    ab_testing_enabled: false,
    auto_bidding: false,
    ai_content_generation: false,
  });

  const campaignTypes = [
    { value: 'content', label: 'Content Marketing', icon: '📝' },
    { value: 'email', label: 'Email Marketing', icon: '✉️' },
    { value: 'social', label: 'Social Media', icon: '👥' },
    { value: 'paid_search', label: 'Paid Search', icon: '🔍' },
    { value: 'paid_social', label: 'Paid Social', icon: '📱' },
    { value: 'retargeting', label: 'Retargeting', icon: '🎯' },
    { value: 'automation', label: 'Marketing Automation', icon: '⚡' },
    { value: 'webinar', label: 'Webinar', icon: '🎥' },
  ];

  const objectives = [
    { value: 'awareness', label: 'Brand Awareness' },
    { value: 'lead_generation', label: 'Lead Generation' },
    { value: 'conversion', label: 'Conversion' },
    { value: 'retention', label: 'Customer Retention' },
    { value: 'upsell', label: 'Upsell/Cross-sell' },
    { value: 'reactivation', label: 'Reactivation' },
  ];

  const channels = [
    { value: 'content', label: 'Content/Blog' },
    { value: 'email', label: 'Email' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'facebook_ads', label: 'Facebook Ads' },
    { value: 'display', label: 'Display Ads' },
    { value: 'seo', label: 'SEO' },
    { value: 'webinar', label: 'Webinars' },
  ];

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Manufacturing', 
    'Retail', 'Education', 'Consulting', 'Real Estate'
  ];

  const companySizes = [
    { value: '1-10', label: 'Startup (1-10)' },
    { value: '11-50', label: 'Small (11-50)' },
    { value: '51-200', label: 'Medium (51-200)' },
    { value: '201-1000', label: 'Large (201-1000)' },
    { value: '1000+', label: 'Enterprise (1000+)' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTargetingChange = (field: string, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      target_audience: {
        ...prev.target_audience,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Prepare data for API
      const apiData = {
        ...campaignData,
        budget: campaignData.budget ? parseFloat(campaignData.budget) : null,
        daily_budget: campaignData.daily_budget ? parseFloat(campaignData.daily_budget) : null,
        status: 'draft',
      };

      await marketingAPI.createCampaign(apiData);
      onCampaignCreated();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCampaignData({
      name: '',
      description: '',
      campaign_type: 'content',
      objective: 'lead_generation',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      budget: '',
      daily_budget: '',
      target_audience: {
        industries: [],
        company_size: '',
        job_titles: [],
        geographic: [],
      },
      target_keywords: [],
      channels: [],
      ai_optimization_enabled: true,
      ab_testing_enabled: false,
      auto_bidding: false,
      ai_content_generation: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create New Campaign</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-between mt-6">
            {['Basic Info', 'Targeting', 'Budget & AI', 'Review'].map((label, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > index + 1 ? 'bg-white text-blue-600' : 
                  step === index + 1 ? 'bg-white text-purple-600' : 
                  'bg-white bg-opacity-30 text-white'
                }`}>
                  {step > index + 1 ? <CheckCircleIcon className="h-5 w-5" /> : index + 1}
                </div>
                <span className="ml-2 text-sm">{label}</span>
                {index < 3 && <div className="w-16 h-0.5 bg-white bg-opacity-30 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Q1 AI Transformation Campaign"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={campaignData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your campaign goals and strategy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {campaignTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('campaign_type', type.value)}
                      className={`p-3 border rounded-lg text-center transition ${
                        campaignData.campaign_type === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Objective *
                </label>
                <select
                  value={campaignData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {objectives.map((obj) => (
                    <option key={obj.value} value={obj.value}>
                      {obj.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={campaignData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={campaignData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Targeting */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Industries
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {industries.map((industry) => (
                    <label key={industry} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={campaignData.target_audience.industries.includes(industry)}
                        onChange={(e) => {
                          const newIndustries = e.target.checked
                            ? [...campaignData.target_audience.industries, industry]
                            : campaignData.target_audience.industries.filter((i: string) => i !== industry);
                          handleTargetingChange('industries', newIndustries);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={campaignData.target_audience.company_size}
                  onChange={(e) => handleTargetingChange('company_size', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sizes</option>
                  {companySizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketing Channels
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {channels.map((channel) => (
                    <label key={channel.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={campaignData.channels.includes(channel.value)}
                        onChange={(e) => {
                          const newChannels = e.target.checked
                            ? [...campaignData.channels, channel.value]
                            : campaignData.channels.filter((c: string) => c !== channel.value);
                          handleInputChange('channels', newChannels);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{channel.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Keywords (comma-separated)
                </label>
                <textarea
                  value={campaignData.target_keywords.join(', ')}
                  onChange={(e) => handleInputChange('target_keywords', e.target.value.split(',').map(k => k.trim()))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="AI consulting, business automation, AI transformation..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Budget & AI */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Budget ($)
                  </label>
                  <input
                    type="number"
                    value={campaignData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Budget ($)
                  </label>
                  <input
                    type="number"
                    value={campaignData.daily_budget}
                    onChange={(e) => handleInputChange('daily_budget', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Powered Features</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <SparklesIcon className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium">AI Optimization</div>
                        <div className="text-sm text-gray-500">Automatically optimize for best performance</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={campaignData.ai_optimization_enabled}
                      onChange={(e) => handleInputChange('ai_optimization_enabled', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <BeakerIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium">A/B Testing</div>
                        <div className="text-sm text-gray-500">Test multiple variants automatically</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={campaignData.ab_testing_enabled}
                      onChange={(e) => handleInputChange('ab_testing_enabled', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <ChartBarIcon className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium">Auto-Bidding</div>
                        <div className="text-sm text-gray-500">AI manages bid strategy for optimal ROI</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={campaignData.auto_bidding}
                      onChange={(e) => handleInputChange('auto_bidding', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <CogIcon className="h-5 w-5 text-orange-600 mr-3" />
                      <div>
                        <div className="font-medium">AI Content Generation</div>
                        <div className="text-sm text-gray-500">Generate content using AI</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={campaignData.ai_content_generation}
                      onChange={(e) => handleInputChange('ai_content_generation', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Review Campaign Details</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Campaign Name:</span>
                  <span className="font-medium">{campaignData.name || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">
                    {campaignTypes.find(t => t.value === campaignData.campaign_type)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Objective:</span>
                  <span className="font-medium">
                    {objectives.find(o => o.value === campaignData.objective)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{campaignData.start_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">
                    ${campaignData.budget || '0'} total / ${campaignData.daily_budget || '0'} daily
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Channels:</span>
                  <span className="font-medium">{campaignData.channels.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Features:</span>
                  <span className="font-medium">
                    {[
                      campaignData.ai_optimization_enabled && 'AI Optimization',
                      campaignData.ab_testing_enabled && 'A/B Testing',
                      campaignData.auto_bidding && 'Auto-Bidding',
                      campaignData.ai_content_generation && 'AI Content',
                    ].filter(Boolean).join(', ') || 'None'}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <SparklesIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">AI Recommendations</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Based on your campaign type and objective, we recommend enabling AI optimization 
                      for 35% better performance and 20% lower cost per acquisition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!campaignData.name && step === 1}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !campaignData.name}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Campaign'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}