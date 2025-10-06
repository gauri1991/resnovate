'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI, consultationAPI } from '@/lib/api';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Consultation {
  id: number;
  client_name: string;
  email: string;
  phone: string;
  company: string;
  preferred_date: string;
  preferred_time: string;
  consultation_type: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

const mockConsultations: Consultation[] = [
  {
    id: 1,
    client_name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    preferred_date: '2024-02-15',
    preferred_time: '10:00',
    consultation_type: 'AI Strategy',
    message: 'Looking to implement AI solutions for our customer service operations.',
    status: 'confirmed',
    created_at: '2024-02-01T10:30:00Z',
  },
  {
    id: 2,
    client_name: 'Michael Chen',
    email: 'mchen@retailplus.com',
    phone: '+1 (555) 987-6543',
    company: 'Retail Plus',
    preferred_date: '2024-02-20',
    preferred_time: '14:00',
    consultation_type: 'Process Automation',
    message: 'Need help automating our inventory management system.',
    status: 'pending',
    created_at: '2024-02-02T15:45:00Z',
  },
  {
    id: 3,
    client_name: 'Emily Rodriguez',
    email: 'emily.r@healthtech.io',
    phone: '+1 (555) 456-7890',
    company: 'HealthTech Innovations',
    preferred_date: '2024-02-25',
    preferred_time: '09:00',
    consultation_type: 'Data Analytics',
    message: 'Interested in AI-powered analytics for patient data insights.',
    status: 'completed',
    created_at: '2024-01-28T11:20:00Z',
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: ClockIcon,
  confirmed: CheckCircleIcon,
  completed: CheckCircleIcon,
  cancelled: XCircleIcon,
};

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Schedule Consultation Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    selectedLeadId: '',
    selectedSlotId: '',
    notes: '',
    // For new lead creation
    newLead: {
      name: '',
      email: '',
      phone: '',
      company: '',
    }
  });

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await consultationAPI.getAvailableSlots();
      setAvailableSlots(response.data || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await adminAPI.getLeads();
      const leadsData = response.data.results || response.data;
      setLeads(Array.isArray(leadsData) ? leadsData : []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    }
  };

  const openScheduleModal = async () => {
    setShowScheduleModal(true);
    await Promise.all([fetchAvailableSlots(), fetchLeads()]);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setScheduleForm({
      selectedLeadId: '',
      selectedSlotId: '',
      notes: '',
      newLead: {
        name: '',
        email: '',
        phone: '',
        company: '',
      }
    });
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        slot_id: parseInt(scheduleForm.selectedSlotId),
        lead: scheduleForm.selectedLeadId === 'new' ? scheduleForm.newLead : { id: parseInt(scheduleForm.selectedLeadId) },
        notes: scheduleForm.notes,
      };

      await consultationAPI.createBooking(bookingData);
      closeScheduleModal();
      fetchConsultations(); // Refresh the consultations list
      alert('Consultation scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      alert('Failed to schedule consultation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchConsultations = async () => {
    try {
      const response = await adminAPI.getBookings();
      // Handle both paginated and non-paginated responses
      const bookingsData = response.data.results || response.data;
      if (!Array.isArray(bookingsData)) {
        console.error('Expected array or paginated response, got:', response.data);
        setConsultations([]);
        setLoading(false);
        return;
      }
      
      // Transform backend booking data to frontend consultation format
      const transformedConsultations = bookingsData.map((booking: any) => ({
        id: booking.id,
        client_name: booking.lead?.name || `${booking.lead?.first_name} ${booking.lead?.last_name}`.trim() || 'Unknown Client',
        email: booking.lead?.email || '',
        phone: booking.lead?.phone || '',
        company: booking.lead?.company || '',
        preferred_date: booking.slot?.date_time?.split('T')[0] || '',
        preferred_time: booking.slot?.date_time?.split('T')[1]?.substring(0, 5) || '',
        consultation_type: booking.lead?.project_type || booking.lead?.industry || 'General Consultation',
        message: booking.notes || booking.lead?.description || '',
        status: booking.status,
        created_at: booking.created_at,
      }));
      
      setConsultations(transformedConsultations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      // Fallback to mock data if API fails
      setConsultations(mockConsultations);
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Consultation Requests
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track consultation requests from potential clients
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            onClick={openScheduleModal}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Schedule Consultation
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search consultations..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {consultations.filter(c => c.status === 'pending').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Confirmed</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {consultations.filter(c => c.status === 'confirmed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {consultations.filter(c => c.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd className="text-lg font-medium text-gray-900">{consultations.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredConsultations.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500">
              No consultations found matching your criteria.
            </li>
          ) : (
            filteredConsultations.map((consultation) => {
              const StatusIcon = statusIcons[consultation.status];
              return (
                <li key={consultation.id}>
                  <Link 
                    href={`/admin/consultations/${consultation.id}`}
                    className="block hover:bg-gray-50 px-6 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {consultation.client_name}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[consultation.status]}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">
                              {consultation.company} • {consultation.consultation_type}
                            </p>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                              {formatDate(consultation.preferred_date)} at {formatTime(consultation.preferred_time)}
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                              {consultation.email}
                              <PhoneIcon className="flex-shrink-0 ml-4 mr-1.5 h-4 w-4" />
                              {consultation.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Schedule Consultation Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Schedule Consultation</h3>
                <button
                  onClick={closeScheduleModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleScheduleSubmit} className="px-6 py-4 space-y-6">
              {/* Lead Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Client/Lead
                </label>
                <select
                  value={scheduleForm.selectedLeadId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, selectedLeadId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a lead...</option>
                  <option value="new">Create New Lead</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name || `${lead.first_name} ${lead.last_name}`} - {lead.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* New Lead Creation Form */}
              {scheduleForm.selectedLeadId === 'new' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.newLead.name}
                      onChange={(e) => setScheduleForm({
                        ...scheduleForm,
                        newLead: { ...scheduleForm.newLead, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={scheduleForm.newLead.email}
                      onChange={(e) => setScheduleForm({
                        ...scheduleForm,
                        newLead: { ...scheduleForm.newLead, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={scheduleForm.newLead.phone}
                      onChange={(e) => setScheduleForm({
                        ...scheduleForm,
                        newLead: { ...scheduleForm.newLead, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1-555-123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.newLead.company}
                      onChange={(e) => setScheduleForm({
                        ...scheduleForm,
                        newLead: { ...scheduleForm.newLead, company: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tech Solutions Inc"
                    />
                  </div>
                </div>
              )}

              {/* Available Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {availableSlots.length === 0 ? (
                      <p className="text-gray-500 text-sm col-span-2">No available slots found</p>
                    ) : (
                      availableSlots.map((slot) => (
                        <label
                          key={slot.id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            scheduleForm.selectedSlotId === slot.id.toString()
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="selectedSlot"
                            value={slot.id}
                            checked={scheduleForm.selectedSlotId === slot.id.toString()}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, selectedSlotId: e.target.value })}
                            className="mr-3"
                            required
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(slot.date_time).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(slot.date_time).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })} ({slot.duration_minutes} min)
                            </div>
                            <div className="text-xs text-gray-500">
                              ${slot.price}
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any specific requirements or notes about this consultation..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeScheduleModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !scheduleForm.selectedSlotId || !scheduleForm.selectedLeadId}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}