'use client';

import { useState, useEffect } from 'react';
import { marketingAPI } from '@/lib/api';
import {
  EnvelopeIcon,
  BoltIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon,
  BeakerIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface EmailSequence {
  id: number;
  name: string;
  description: string;
  trigger_event: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_conversions: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  created_at: string;
  ab_testing_enabled: boolean;
  send_time_optimization: boolean;
}

interface EmailTemplate {
  id: number;
  name: string;
  template_type: string;
  subject_line_variants: string[];
  usage_count: number;
  avg_open_rate: number;
  avg_click_rate: number;
  performance_score: number;
  ai_generated: boolean;
}

interface BehavioralTrigger {
  id: number;
  name: string;
  trigger_type: string;
  action_type: string;
  times_triggered: number;
  successful_actions: number;
  conversion_rate: number;
  active: boolean;
}

export default function EmailCampaignManager() {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [triggers, setTriggers] = useState<BehavioralTrigger[]>([]);
  const [selectedTab, setSelectedTab] = useState('sequences');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        setLoading(true);
        // Mock data - in real implementation, these would be API calls
        const mockSequences: EmailSequence[] = [
          {
            id: 1,
            name: 'Welcome Series - New Prospects',
            description: 'Multi-step welcome sequence for new lead prospects',
            trigger_event: 'form_fill',
            status: 'active',
            total_sent: 2456,
            total_opened: 1845,
            total_clicked: 623,
            total_conversions: 89,
            open_rate: 75.1,
            click_rate: 25.4,
            conversion_rate: 3.6,
            created_at: '2024-01-15',
            ab_testing_enabled: true,
            send_time_optimization: true,
          },
          {
            id: 2,
            name: 'AI Consultation Nurture',
            description: 'Educational series for leads interested in AI consulting',
            trigger_event: 'download',
            status: 'active',
            total_sent: 1892,
            total_opened: 1534,
            total_clicked: 512,
            total_conversions: 67,
            open_rate: 81.1,
            click_rate: 27.1,
            conversion_rate: 3.5,
            created_at: '2024-01-20',
            ab_testing_enabled: false,
            send_time_optimization: true,
          },
          {
            id: 3,
            name: 'Re-engagement Campaign',
            description: 'Win back inactive subscribers',
            trigger_event: 'engagement_drop',
            status: 'paused',
            total_sent: 892,
            total_opened: 445,
            total_clicked: 134,
            total_conversions: 23,
            open_rate: 49.9,
            click_rate: 15.0,
            conversion_rate: 2.6,
            created_at: '2024-01-25',
            ab_testing_enabled: true,
            send_time_optimization: false,
          },
        ];

        const mockTemplates: EmailTemplate[] = [
          {
            id: 1,
            name: 'Welcome Email - AI Focus',
            template_type: 'welcome',
            subject_line_variants: ['Welcome to AI Innovation', 'Transform Your Business with AI'],
            usage_count: 456,
            avg_open_rate: 78.5,
            avg_click_rate: 23.4,
            performance_score: 92,
            ai_generated: true,
          },
          {
            id: 2,
            name: 'Case Study Showcase',
            template_type: 'educational',
            subject_line_variants: ['Real AI Success Stories', 'How Companies Like Yours Benefit from AI'],
            usage_count: 324,
            avg_open_rate: 71.2,
            avg_click_rate: 19.8,
            performance_score: 87,
            ai_generated: false,
          },
          {
            id: 3,
            name: 'Consultation Invite',
            template_type: 'promotional',
            subject_line_variants: ['Free AI Assessment Available', 'Unlock Your AI Potential'],
            usage_count: 234,
            avg_open_rate: 82.1,
            avg_click_rate: 31.5,
            performance_score: 95,
            ai_generated: true,
          },
        ];

        const mockTriggers: BehavioralTrigger[] = [
          {
            id: 1,
            name: 'Pricing Page Visit',
            trigger_type: 'page_visit',
            action_type: 'send_email',
            times_triggered: 1234,
            successful_actions: 1189,
            conversion_rate: 8.5,
            active: true,
          },
          {
            id: 2,
            name: 'White Paper Download',
            trigger_type: 'content_download',
            action_type: 'start_sequence',
            times_triggered: 892,
            successful_actions: 856,
            conversion_rate: 12.3,
            active: true,
          },
          {
            id: 3,
            name: 'Email Engagement Drop',
            trigger_type: 'inactivity',
            action_type: 'send_email',
            times_triggered: 445,
            successful_actions: 398,
            conversion_rate: 5.7,
            active: true,
          },
        ];

        setSequences(mockSequences);
        setTemplates(mockTemplates);
        setTriggers(mockTriggers);
      } catch (error) {
        console.error('Error fetching email campaign data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSequenceAction = async (sequenceId: number, action: 'play' | 'pause' | 'stop') => {
    try {
      // In real implementation, this would call the API
      console.log(`${action} sequence ${sequenceId}`);
      
      // Update local state
      setSequences(prev => prev.map(seq => 
        seq.id === sequenceId 
          ? { ...seq, status: action === 'play' ? 'active' : action === 'pause' ? 'paused' : 'draft' }
          : seq
      ));
    } catch (error) {
      console.error(`Error ${action}ing sequence:`, error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <EnvelopeIcon className="h-6 w-6 mr-2 text-blue-600" />
            Email Campaign Manager
          </h2>
          <p className="text-gray-600">Manage email sequences, templates, and behavioral triggers</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create Sequence</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <EnvelopeIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Sequences</p>
              <p className="text-2xl font-bold text-gray-900">
                {sequences.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {sequences.reduce((sum, s) => sum + s.total_sent, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {(sequences.reduce((sum, s) => sum + s.open_rate, 0) / sequences.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <BoltIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Triggers</p>
              <p className="text-2xl font-bold text-gray-900">
                {triggers.filter(t => t.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'sequences', label: 'Email Sequences', icon: EnvelopeIcon },
            { id: 'templates', label: 'Templates', icon: SparklesIcon },
            { id: 'triggers', label: 'Behavioral Triggers', icon: BoltIcon },
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
      {selectedTab === 'sequences' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Email Sequences</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sequence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trigger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sequences.map((sequence) => (
                  <tr key={sequence.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{sequence.name}</div>
                          <div className="text-sm text-gray-500">{sequence.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 capitalize">
                        {sequence.trigger_event.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sequence.status)}`}>
                        {sequence.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Open: {sequence.open_rate.toFixed(1)}%</div>
                        <div>Click: {sequence.click_rate.toFixed(1)}%</div>
                        <div>Conv: {sequence.conversion_rate.toFixed(1)}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {sequence.ab_testing_enabled && (
                          <BeakerIcon className="h-4 w-4 text-blue-500" title="A/B Testing" />
                        )}
                        {sequence.send_time_optimization && (
                          <ClockIcon className="h-4 w-4 text-green-500" title="Send Time Optimization" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {sequence.status === 'active' ? (
                          <button 
                            onClick={() => handleSequenceAction(sequence.id, 'pause')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Pause Sequence"
                          >
                            <PauseIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleSequenceAction(sequence.id, 'play')}
                            className="text-green-600 hover:text-green-900"
                            title="Start Sequence"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleSequenceAction(sequence.id, 'stop')}
                          className="text-red-600 hover:text-red-900"
                          title="Stop Sequence"
                        >
                          <StopIcon className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900" title="View Details">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit Sequence">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'templates' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <PlusIcon className="h-4 w-4" />
              <span>New Template</span>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                      {template.ai_generated && (
                        <SparklesIcon className="ml-2 h-4 w-4 text-purple-500" title="AI Generated" />
                      )}
                    </div>
                    <span className={`text-xs font-medium ${getPerformanceColor(template.performance_score)}`}>
                      {template.performance_score}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-3 capitalize">
                    {template.template_type.replace('_', ' ')}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-gray-500">Subject Lines:</div>
                    {template.subject_line_variants.map((subject, index) => (
                      <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                        {subject}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 mb-4">
                    <div>
                      <div className="font-medium">{template.usage_count}</div>
                      <div>Uses</div>
                    </div>
                    <div>
                      <div className="font-medium">{template.avg_open_rate.toFixed(1)}%</div>
                      <div>Open Rate</div>
                    </div>
                    <div>
                      <div className="font-medium">{template.avg_click_rate.toFixed(1)}%</div>
                      <div>Click Rate</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 text-xs bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100">
                      Use Template
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'triggers' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Behavioral Triggers</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <PlusIcon className="h-4 w-4" />
              <span>New Trigger</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trigger Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {triggers.map((trigger) => (
                  <tr key={trigger.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trigger.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {trigger.trigger_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {trigger.action_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Triggered: {trigger.times_triggered}</div>
                        <div>Success Rate: {((trigger.successful_actions / trigger.times_triggered) * 100).toFixed(1)}%</div>
                        <div>Conversion: {trigger.conversion_rate.toFixed(1)}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        trigger.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trigger.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View Details">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit Trigger">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Delete Trigger">
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
      )}
    </div>
  );
}