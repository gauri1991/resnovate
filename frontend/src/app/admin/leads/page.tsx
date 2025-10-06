'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { adminAPI } from '@/lib/api';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
  source: 'website' | 'organic_search' | 'direct' | 'referral' | 'social' | 'linkedin' | 'ads' | 'email' | 'event' | 'other';
  projectType: string;
  budget: number;
  timeline: string;
  location: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  notes: string[];
}

const leadStatuses = [
  { key: 'new', label: 'New Leads', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  { key: 'contacted', label: 'Contacted', color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-700' },
  { key: 'qualified', label: 'Qualified', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-indigo-50 border-indigo-200', textColor: 'text-indigo-700' },
  { key: 'won', label: 'Won', color: 'bg-green-50 border-green-200', textColor: 'text-green-700' },
  { key: 'lost', label: 'Lost', color: 'bg-red-50 border-red-200', textColor: 'text-red-700' },
];

const mockLeads: Lead[] = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    status: 'new',
    source: 'website',
    projectType: 'Kitchen Renovation',
    budget: 45000,
    timeline: '3-4 months',
    location: 'Seattle, WA',
    description: 'Looking for a complete kitchen renovation with modern appliances and custom cabinets.',
    priority: 'high',
    assignedTo: 'John Smith',
    createdAt: '2024-01-18T10:30:00Z',
    updatedAt: '2024-01-18T10:30:00Z',
    notes: ['Initial inquiry from website form', 'Interested in modern design style'],
  },
  {
    id: 2,
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    status: 'contacted',
    source: 'referral',
    projectType: 'Bathroom Remodel',
    budget: 25000,
    timeline: '6-8 weeks',
    location: 'Portland, OR',
    description: 'Master bathroom renovation with luxury finishes.',
    priority: 'medium',
    assignedTo: 'Jane Doe',
    createdAt: '2024-01-16T14:15:00Z',
    updatedAt: '2024-01-17T09:22:00Z',
    lastContactDate: '2024-01-17T09:22:00Z',
    nextFollowUpDate: '2024-01-20T10:00:00Z',
    notes: ['Referred by previous client', 'Called and scheduled consultation', 'Prefers spa-like design'],
  },
  {
    id: 3,
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@email.com',
    phone: '(555) 345-6789',
    status: 'qualified',
    source: 'social',
    projectType: 'Whole Home Renovation',
    budget: 150000,
    timeline: '8-12 months',
    location: 'San Francisco, CA',
    description: 'Complete home renovation of a Victorian house.',
    priority: 'high',
    assignedTo: 'John Smith',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-16T11:30:00Z',
    lastContactDate: '2024-01-16T11:30:00Z',
    nextFollowUpDate: '2024-01-19T14:00:00Z',
    notes: ['Found us on Instagram', 'Had consultation, very interested', 'Historic home preservation important'],
  },
  {
    id: 4,
    firstName: 'David',
    lastName: 'Park',
    email: 'david.park@email.com',
    phone: '(555) 456-7890',
    status: 'proposal_sent',
    source: 'ads',
    projectType: 'Living Room Makeover',
    budget: 18000,
    timeline: '2-3 months',
    location: 'Bellevue, WA',
    description: 'Modern living room design with built-in entertainment center.',
    priority: 'medium',
    assignedTo: 'Jane Doe',
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    lastContactDate: '2024-01-15T16:45:00Z',
    nextFollowUpDate: '2024-01-22T10:00:00Z',
    notes: ['Came from Google Ads', 'Proposal sent via email', 'Waiting for decision'],
  },
  {
    id: 5,
    firstName: 'Anna',
    lastName: 'Kim',
    email: 'anna.kim@email.com',
    phone: '(555) 567-8901',
    status: 'negotiation',
    source: 'website',
    projectType: 'Home Office Setup',
    budget: 12000,
    timeline: '4-6 weeks',
    location: 'Tacoma, WA',
    description: 'Custom home office with built-in storage and desk.',
    priority: 'low',
    assignedTo: 'John Smith',
    createdAt: '2024-01-10T13:10:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    lastContactDate: '2024-01-16T14:20:00Z',
    nextFollowUpDate: '2024-01-18T15:00:00Z',
    notes: ['Website contact form', 'Negotiating timeline and budget', 'Works from home full-time'],
  },
  {
    id: 6,
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@email.com',
    phone: '(555) 678-9012',
    status: 'won',
    source: 'referral',
    projectType: 'Kitchen Renovation',
    budget: 52000,
    timeline: '3 months',
    location: 'Spokane, WA',
    description: 'Traditional kitchen renovation with custom island.',
    priority: 'high',
    assignedTo: 'Jane Doe',
    createdAt: '2024-01-08T09:30:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    lastContactDate: '2024-01-15T12:00:00Z',
    notes: ['Referred by neighbor', 'Signed contract', 'Project starts next month'],
  },
  {
    id: 7,
    firstName: 'Lisa',
    lastName: 'Martinez',
    email: 'lisa.martinez@email.com',
    phone: '(555) 789-0123',
    status: 'lost',
    source: 'website',
    projectType: 'Bathroom Remodel',
    budget: 15000,
    timeline: '2 months',
    location: 'Vancouver, WA',
    description: 'Guest bathroom renovation on a tight budget.',
    priority: 'low',
    assignedTo: 'John Smith',
    createdAt: '2024-01-05T15:45:00Z',
    updatedAt: '2024-01-12T10:30:00Z',
    lastContactDate: '2024-01-12T10:30:00Z',
    notes: ['Website inquiry', 'Decided to go with another contractor', 'Budget was too low'],
  },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    projectType: '',
    budget: '',
    timeline: '',
    location: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    source: 'website' as Lead['source'],
    assignedTo: '',
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      industry: '',
      projectType: '',
      budget: '',
      timeline: '',
      location: '',
      description: '',
      priority: 'medium',
      source: 'website',
      assignedTo: '',
    });
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        industry: formData.industry,
        project_type: formData.projectType,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        timeline: formData.timeline,
        location: formData.location,
        description: formData.description,
        priority: formData.priority,
        source: formData.source,
        assigned_to: formData.assignedTo,
      };

      await adminAPI.createLead(submitData);
      setShowLeadModal(false);
      resetForm();
      fetchLeads(); // Refresh the leads list
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await adminAPI.getLeads();
      // Handle both paginated and non-paginated responses
      const leadsData = response.data.results || response.data;
      if (!Array.isArray(leadsData)) {
        console.error('Expected array or paginated response, got:', response.data);
        setLeads([]);
        setLoading(false);
        return;
      }
      // Transform backend data to frontend format
      const transformedLeads = leadsData.map((lead: any) => ({
        id: lead.id,
        firstName: lead.first_name || lead.name?.split(' ')[0] || '',
        lastName: lead.last_name || lead.name?.split(' ')[1] || '',
        email: lead.email,
        phone: lead.phone || '',
        status: lead.status,
        source: lead.source,
        projectType: lead.project_type || lead.industry || 'AI Consulting',
        budget: parseFloat(lead.budget) || 0,
        timeline: lead.timeline || lead.project_timeline || '',
        location: lead.location || '',
        description: lead.description || lead.message || '',
        priority: lead.priority,
        assignedTo: lead.assigned_to || '',
        createdAt: lead.created_at,
        updatedAt: lead.updated_at,
        lastContactDate: lead.last_contact_date,
        nextFollowUpDate: lead.next_followup_date,
        notes: lead.notes ? [lead.notes] : [],
      }));
      setLeads(transformedLeads);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
      // Fallback to mock data if API fails
      setLeads([]);
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      // Update lead status via API
      await adminAPI.updateLead(leadId, { status: newStatus });
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus as Lead['status'], updatedAt: new Date().toISOString() } : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
      // Revert optimistic update on error
      fetchLeads();
    }
  };

  const handleDragStart = (e: any, lead: Lead) => {
    setDraggedLead(lead);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedLead && draggedLead.status !== status) {
      handleStatusChange(draggedLead.id, status);
    }
    setDraggedLead(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website':
        return '🌐';
      case 'referral':
        return '👥';
      case 'social':
        return '📱';
      case 'ads':
        return '📺';
      default:
        return '📝';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const totalLeadsValue = leads.reduce((sum, lead) => sum + lead.budget, 0);
  const qualifiedLeadsValue = leads.filter(lead => ['qualified', 'proposal_sent', 'negotiation', 'won'].includes(lead.status)).reduce((sum, lead) => sum + lead.budget, 0);
  const conversionRate = leads.length > 0 ? (leads.filter(lead => lead.status === 'won').length / leads.length) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track and manage your AI consulting leads through the sales pipeline
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedLead(null);
            resetForm();
            setShowLeadModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(qualifiedLeadsValue)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalLeadsValue)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-96">
          {leadStatuses.map((status, index) => {
            const statusLeads = getLeadsByStatus(status.key);
            const statusValue = statusLeads.reduce((sum, lead) => sum + lead.budget, 0);
            
            return (
              <motion.div
                key={status.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-lg border-2 border-dashed ${status.color} min-h-96`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status.key)}
              >
                {/* Column Header */}
                <div className={`p-4 border-b border-gray-200 ${status.textColor}`}>
                  <h3 className="font-semibold text-sm">{status.label}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs">
                      {statusLeads.length} lead{statusLeads.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs font-medium">
                      {formatCurrency(statusValue)}
                    </span>
                  </div>
                </div>

                {/* Lead Cards */}
                <div className="p-2 space-y-3">
                  <AnimatePresence>
                    {statusLeads.map((lead) => (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-lg border border-gray-200 p-3 cursor-move hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead)}
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowLeadModal(true);
                        }}
                      >
                        {/* Lead Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {lead.firstName} {lead.lastName}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <span className="text-sm">{getSourceIcon(lead.source)}</span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                              {lead.priority}
                            </span>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-1 mb-3">
                          <p className="text-xs font-medium text-gray-700 truncate">
                            {lead.projectType}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                            {formatCurrency(lead.budget)}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            {lead.location}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {lead.timeline}
                          </div>
                          <div>
                            {formatDate(lead.updatedAt)}
                          </div>
                        </div>

                        {/* Next Follow-up */}
                        {lead.nextFollowUpDate && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                            <div className="flex items-center text-yellow-600">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              Follow up: {formatDate(lead.nextFollowUpDate)}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Empty State */}
                  {statusLeads.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-xs">No leads in this stage</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {showLeadModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900 bg-opacity-50"
                onClick={() => setShowLeadModal(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}` : 'New Lead'}
                  </h3>
                  <button
                    onClick={() => setShowLeadModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {selectedLead ? (
                    <div className="space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <EnvelopeIcon className="h-4 w-4 mr-2" />
                            <a href={`mailto:${selectedLead.email}`} className="hover:text-blue-600">
                              {selectedLead.email}
                            </a>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            <a href={`tel:${selectedLead.phone}`} className="hover:text-blue-600">
                              {selectedLead.phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Project Details</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><span className="font-medium">Type:</span> {selectedLead.projectType}</p>
                          <p><span className="font-medium">Budget:</span> {formatCurrency(selectedLead.budget)}</p>
                          <p><span className="font-medium">Timeline:</span> {selectedLead.timeline}</p>
                          <p><span className="font-medium">Location:</span> {selectedLead.location}</p>
                          <p><span className="font-medium">Description:</span> {selectedLead.description}</p>
                        </div>
                      </div>

                      {/* Notes */}
                      {selectedLead.notes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Notes</h4>
                          <div className="space-y-2">
                            {selectedLead.notes.map((note, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                {note}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                        <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          Call
                        </button>
                        <button className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700">
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          Email
                        </button>
                        <button className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Schedule
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitLead} className="space-y-6">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Add New Lead</h3>
                        <p className="text-sm text-gray-600">Create a new AI consulting lead</p>
                      </div>

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Smith"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="john.smith@company.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1-555-123-4567"
                          />
                        </div>
                      </div>

                      {/* Company Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tech Solutions Inc"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry
                          </label>
                          <select
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Industry</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Financial Services">Financial Services</option>
                            <option value="Retail & E-commerce">Retail & E-commerce</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Education">Education</option>
                            <option value="Logistics">Logistics</option>
                            <option value="Media & Entertainment">Media & Entertainment</option>
                            <option value="Energy & Utilities">Energy & Utilities</option>
                            <option value="Technology">Technology</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Project Information */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Type *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="AI-powered customer analytics system"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget (USD)
                          </label>
                          <input
                            type="number"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="50000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timeline
                          </label>
                          <input
                            type="text"
                            value={formData.timeline}
                            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="3-4 months"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="San Francisco, CA"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Description *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describe the AI consulting project requirements..."
                        />
                      </div>

                      {/* Lead Management */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                          </label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Source
                          </label>
                          <select
                            value={formData.source}
                            onChange={(e) => setFormData({ ...formData, source: e.target.value as Lead['source'] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="website">Website</option>
                            <option value="organic_search">Organic Search</option>
                            <option value="direct">Direct</option>
                            <option value="referral">Referral</option>
                            <option value="social">Social Media</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="ads">Advertisements</option>
                            <option value="email">Email Campaign</option>
                            <option value="event">Event/Conference</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assigned To
                          </label>
                          <input
                            type="text"
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John Smith"
                          />
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            setShowLeadModal(false);
                            resetForm();
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Creating...' : 'Create Lead'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}