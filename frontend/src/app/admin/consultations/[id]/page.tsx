'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  ArrowLeftIcon,
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
  notes?: string;
}

const mockConsultation: Consultation = {
  id: 1,
  client_name: 'Sarah Johnson',
  email: 'sarah.johnson@techcorp.com',
  phone: '+1 (555) 123-4567',
  company: 'TechCorp Solutions',
  preferred_date: '2024-02-15',
  preferred_time: '10:00',
  consultation_type: 'AI Strategy',
  message: 'Looking to implement AI solutions for our customer service operations. We currently handle about 500 customer inquiries daily and want to explore how AI can help us provide faster, more accurate responses while maintaining the personal touch our customers expect.',
  status: 'confirmed',
  created_at: '2024-02-01T10:30:00Z',
  notes: 'Client seems very interested in chatbot implementation. They have a budget of $50k-100k for the initial phase.',
};

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

export default function ConsultationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConsultation(mockConsultation);
      setNotes(mockConsultation.notes || '');
      setStatus(mockConsultation.status);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // Here you would make an API call to update the status
    console.log('Updating status to:', newStatus);
  };

  const handleNotesUpdate = () => {
    // Here you would make an API call to update the notes
    console.log('Updating notes:', notes);
    if (consultation) {
      setConsultation({ ...consultation, notes });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Consultation not found.</p>
        <Link
          href="/admin/consultations"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Consultations
        </Link>
      </div>
    );
  }

  const StatusIcon = statusIcons[consultation.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/admin/consultations" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Consultations</span>
                  Consultations
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    {consultation.client_name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Consultation with {consultation.client_name}
          </h2>
        </div>
        <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Mark Complete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">{consultation.client_name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company</p>
                    <p className="text-sm text-gray-900">{consultation.company}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <a href={`mailto:${consultation.email}`} className="text-sm text-blue-600 hover:text-blue-500">
                      {consultation.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <a href={`tel:${consultation.phone}`} className="text-sm text-blue-600 hover:text-blue-500">
                      {consultation.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Consultation Details</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preferred Date</p>
                    <p className="text-sm text-gray-900">{formatDate(consultation.preferred_date)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preferred Time</p>
                    <p className="text-sm text-gray-900">{formatTime(consultation.preferred_time)}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Consultation Type</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {consultation.consultation_type}
                </span>
              </div>
              <div>
                <div className="flex items-start">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
                    <p className="text-sm text-gray-900 leading-relaxed">{consultation.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Internal Notes</h3>
            </div>
            <div className="px-6 py-4">
              <textarea
                rows={4}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Add internal notes about this consultation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleNotesUpdate}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Status</h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColors[consultation.status]}`}>
                  <StatusIcon className="w-4 h-4 mr-1.5" />
                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-blue-50 text-blue-700"
                >
                  Mark as Confirmed
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-green-50 text-green-700"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-700"
                >
                  Mark as Cancelled
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="px-6 py-4 space-y-2">
              <a
                href={`mailto:${consultation.email}?subject=Re: ${consultation.consultation_type} Consultation`}
                className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 text-gray-700"
              >
                Send Email
              </a>
              <a
                href={`tel:${consultation.phone}`}
                className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 text-gray-700"
              >
                Call Client
              </a>
              <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 text-gray-700">
                Schedule Follow-up
              </button>
              <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 text-gray-700">
                Create Proposal
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Timeline</h3>
            </div>
            <div className="px-6 py-4">
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <CalendarIcon className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Consultation requested
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {new Date(consultation.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}