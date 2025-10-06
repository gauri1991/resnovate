'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { consultationAPI } from '../lib/api';
import { ConsultationSlot, Lead } from '../types';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingCalendarProps {
  className?: string;
}

export default function BookingCalendar({ className = '' }: BookingCalendarProps) {
  const [availableSlots, setAvailableSlots] = useState<ConsultationSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await consultationAPI.getAvailableSlots();
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
    }
    setIsLoadingSlots(false);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const handleSlotSelect = (slot: ConsultationSlot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    try {
      const lead: Lead = {
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        source: 'consultation_booking',
      };

      await consultationAPI.createBooking({
        lead,
        slot: selectedSlot,
        notes: data.notes,
      });

      setBookingComplete(true);
      reset();
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book consultation. Please try again.');
    }
    setIsSubmitting(false);
  };

  if (bookingComplete) {
    return (
      <div className={`rounded-lg bg-green-50 p-6 ${className}`}>
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-green-900">Booking Confirmed!</h3>
          <p className="mt-2 text-sm text-green-700">
            Your consultation has been booked successfully. You'll receive a confirmation email with the meeting details shortly.
          </p>
          <button
            onClick={() => {
              setBookingComplete(false);
              setShowBookingForm(false);
              setSelectedSlot(null);
              fetchAvailableSlots();
            }}
            className="mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            Book Another Consultation
          </button>
        </div>
      </div>
    );
  }

  if (showBookingForm && selectedSlot) {
    const { date, time } = formatDateTime(selectedSlot.date_time);
    
    return (
      <div className={`rounded-lg bg-white p-6 shadow-lg ${className}`}>
        <div className="mb-6">
          <button
            onClick={() => setShowBookingForm(false)}
            className="mb-4 flex items-center text-sm text-slate-600 hover:text-slate-900"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to calendar
          </button>
          <h3 className="text-xl font-bold text-slate-900">Book Your Consultation</h3>
          <div className="mt-2 rounded-md bg-blue-50 p-3">
            <p className="text-sm text-blue-900">
              <strong>{date}</strong> at <strong>{time}</strong>
            </p>
            <p className="text-sm text-blue-700">
              Duration: {selectedSlot.duration_minutes} minutes | Type: {selectedSlot.meeting_type}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700">
                Company
              </label>
              <input
                type="text"
                id="company"
                {...register('company')}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Your Company"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              {...register('notes')}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Tell us about what you'd like to discuss..."
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-white p-6 shadow-lg ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Schedule a Consultation</h3>
        <p className="mt-2 text-sm text-slate-600">
          Select an available time slot to book your free consultation with our experts.
        </p>
      </div>

      {isLoadingSlots ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-2 text-sm text-slate-600">Loading available slots...</p>
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-slate-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
            </svg>
          </div>
          <p className="text-slate-600">No available slots at the moment.</p>
          <p className="text-sm text-slate-500 mt-1">Please check back later or contact us directly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {availableSlots.map((slot) => {
            const { date, time } = formatDateTime(slot.date_time);
            return (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                className="text-left p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="font-medium text-slate-900">{date}</div>
                <div className="text-sm text-slate-600">{time}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {slot.duration_minutes} min • {slot.meeting_type}
                </div>
                {slot.price !== '0.00' && (
                  <div className="text-sm font-medium text-blue-900 mt-1">
                    ${slot.price}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}