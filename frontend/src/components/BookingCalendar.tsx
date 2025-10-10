'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { consultationAPI } from '../lib/api';
import { ConsultationSlot } from '../types';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VideoCameraIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const communicationMethods = [
  { id: 'zoom', name: 'Zoom', icon: VideoCameraIcon },
  { id: 'teams', name: 'Microsoft Teams', icon: VideoCameraIcon },
  { id: 'direct_call', name: 'Direct Call', icon: PhoneIcon },
  { id: 'google_meet', name: 'Google Meet', icon: VideoCameraIcon },
];

interface BookingCalendarProps {
  className?: string;
  hideCalendar?: boolean;
  refundPolicyText?: string;
}

export interface BookingCalendarRef {
  openCalendar: () => void;
}

function PaymentForm({
  clientSecret,
  onSuccess,
  onError,
}: {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      onError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-slate-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : 'Pay $10 & Book Consultation'}
      </Button>
    </form>
  );
}

const BookingCalendar = forwardRef<BookingCalendarRef, BookingCalendarProps>(
  ({ className = '', hideCalendar = false, refundPolicyText = 'Fully refundable after consultation call or if canceled 24+ hours in advance' }, ref) => {
  const [allSlots, setAllSlots] = useState<ConsultationSlot[]>([]);
  const [selectedDateSlots, setSelectedDateSlots] = useState<ConsultationSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('zoom');
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isLoadingDateSlots, setIsLoadingDateSlots] = useState(false);
  const [datesWithSlots, setDatesWithSlots] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState('');

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

  // Expose openCalendar method to parent component
  useImperativeHandle(ref, () => ({
    openCalendar: () => {
      setIsModalOpen(true);
    },
  }));

  const fetchAvailableSlots = async () => {
    try {
      const response = await consultationAPI.getAvailableSlots();
      const slots = Array.isArray(response.data) ? response.data : [];
      setAllSlots(slots);

      // Extract unique dates from slots
      const dates = new Set<string>();
      slots.forEach((slot) => {
        const date = new Date(slot.date_time);
        const dateStr = date.toISOString().split('T')[0];
        dates.add(dateStr);
      });
      setDatesWithSlots(dates);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      setAllSlots([]);
    }
    setIsLoadingSlots(false);
  };

  const handleDateClick = async (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    setSelectedSlot(null);
    setShowBookingForm(false);
    setShowPaymentForm(false);
    setBookingComplete(false);
    setIsModalOpen(true);
    setIsLoadingDateSlots(true);

    const dateStr = date.toISOString().split('T')[0];

    try {
      const response = await consultationAPI.getSlotsByDate(dateStr);
      const slots = Array.isArray(response.data) ? response.data : [];
      setSelectedDateSlots(slots);
    } catch (error) {
      console.error('Failed to fetch slots for date:', error);
      setSelectedDateSlots([]);
    } finally {
      setIsLoadingDateSlots(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setSelectedDateSlots([]);
    setShowBookingForm(false);
    setShowPaymentForm(false);
    setBookingComplete(false);
    setError('');
    reset();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSlotSelect = (slot: ConsultationSlot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Create booking
      const bookingResponse = await consultationAPI.createBooking({
        slot_id: selectedSlot.id,
        communication_method: selectedMethod,
        lead: {
          name: data.name,
          email: data.email,
          company: data.company,
          phone: data.phone,
        },
        notes: data.notes,
      });

      const newBookingId = bookingResponse.data.id;
      setBookingId(newBookingId);

      // Create payment intent if payment required
      if (selectedSlot.requires_payment) {
        const paymentResponse = await consultationAPI.createPaymentIntent(
          newBookingId,
          parseFloat(selectedSlot.payment_amount)
        );

        setClientSecret(paymentResponse.data.client_secret);
        setShowPaymentForm(true);
      } else {
        setBookingComplete(true);
      }
    } catch (error) {
      console.error('Booking failed:', error);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (clientSecret && bookingId) {
        const paymentIntentId = clientSecret.split('_secret_')[0];
        await consultationAPI.confirmPayment(paymentIntentId);
        setBookingComplete(true);
        setShowPaymentForm(false);
      }
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      setError('Payment successful but confirmation failed. Please contact support.');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleBackToSlots = () => {
    setShowBookingForm(false);
    setShowPaymentForm(false);
    setSelectedSlot(null);
    setError('');
    reset();
  };

  const handleReset = () => {
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setShowBookingForm(false);
    setShowPaymentForm(false);
    setBookingComplete(false);
    setError('');
    reset();
    fetchAvailableSlots();
  };

  // Create array of dates with slots for the modifiers
  const datesWithSlotsArray = Array.from(datesWithSlots).map(dateStr => new Date(dateStr + 'T00:00:00'));

  return (
    <>
      {!hideCalendar && (
      <div className={`rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-5 py-4">
          <h3 className="text-lg font-bold text-white">Schedule a Consultation</h3>
          <p className="mt-1 text-xs text-blue-100">
            Select an available date to view time slots
          </p>
        </div>

        {isLoadingSlots ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-sm text-slate-600">Loading available dates...</p>
          </div>
        ) : allSlots.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="text-slate-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-900 mb-1">No available slots at the moment</p>
            <p className="text-sm text-slate-500">Please check back later or contact us directly.</p>
          </div>
        ) : (
          <div className="p-5 bg-slate-50/30">
            <div className="calendar-container flex flex-col items-center">
              <div className="w-full max-w-xl">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateClick}
                  disabled={(date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Disable past dates and dates without slots
                    return date < today || !datesWithSlots.has(dateStr);
                  }}
                  modifiers={{
                    hasSlots: datesWithSlotsArray,
                  }}
                  modifiersClassNames={{
                    hasSlots: 'has-slots-day',
                  }}
                  fromDate={new Date()}
                  toDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
                  className="w-full border-none [--cell-size:2.5rem]"
                />
              </div>
              <div className="mt-5 flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="relative h-4 w-4 rounded-md border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                  </div>
                  <span className="text-slate-700 font-medium">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded-md border border-slate-300 bg-slate-100"></div>
                  <span className="text-slate-500">Unavailable</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Modal for Time Slots and Booking */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {bookingComplete ? 'Booking Confirmed!' : showPaymentForm ? 'Complete Payment' : showBookingForm ? 'Book Your Consultation' : 'Select a Time Slot'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col overflow-y-auto max-h-[calc(85vh-8rem)]">
            {bookingComplete ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircleIcon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Consultation Booked!</h3>
                <p className="text-sm text-slate-600 mb-6 max-w-md">
                  You'll receive a confirmation email with the meeting details shortly.
                </p>
                {selectedSlot && selectedDate && (
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-left w-full max-w-md mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date:</span>
                        <span className="font-medium text-slate-900">{formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Time:</span>
                        <span className="font-medium text-slate-900">{formatTime(selectedSlot.date_time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Method:</span>
                        <span className="font-medium text-slate-900">
                          {communicationMethods.find(m => m.id === selectedMethod)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <Button onClick={handleReset} variant="outline">
                  Schedule Another Meeting
                </Button>
              </div>
            ) : showPaymentForm && selectedSlot ? (
              <div className="flex-1 flex flex-col">
                <button
                  onClick={handleBackToSlots}
                  className="text-sm text-blue-900 hover:text-blue-700 flex items-center mb-6"
                >
                  ← Back
                </button>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Complete Payment</h4>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Refundable Booking Fee:</strong> A $10 fee secures your consultation slot.
                    {refundPolicyText}
                  </p>
                </div>
                {selectedDate && (
                  <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date:</span>
                        <span className="font-medium text-slate-900">{formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Time:</span>
                        <span className="font-medium text-slate-900">{formatTime(selectedSlot.date_time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Method:</span>
                        <span className="font-medium text-slate-900">
                          {communicationMethods.find(m => m.id === selectedMethod)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              </div>
            ) : showBookingForm && selectedSlot ? (
              <div className="flex-1 flex flex-col">
                <button
                  onClick={handleBackToSlots}
                  className="text-sm text-blue-900 hover:text-blue-700 flex items-center mb-6"
                >
                  ← Back
                </button>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Enter Your Details</h4>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center text-sm text-slate-600 mb-2">
                    <ClockIcon className="h-5 w-5 mr-2 text-blue-900" />
                    <span className="font-medium text-slate-900">
                      {selectedDate && formatDate(selectedDate)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 ml-7">
                    {formatTime(selectedSlot.date_time)} • {selectedSlot.duration_minutes} min
                  </p>
                </div>
                {selectedSlot.requires_payment && (
                  <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      💳 <strong>$10 booking fee required</strong> - {refundPolicyText}
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto">
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-2">
                        Preferred Communication Method *
                      </Label>
                      <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                        <div className="grid grid-cols-2 gap-2">
                          {communicationMethods.map((method) => (
                            <Label
                              key={method.id}
                              htmlFor={method.id}
                              className={`${
                                selectedMethod === method.id ? 'ring-2 ring-blue-900 bg-blue-50' : 'ring-1 ring-slate-200'
                              } relative flex cursor-pointer rounded-lg px-3 py-2 shadow-sm focus:outline-none`}
                            >
                              <div className="flex w-full items-center">
                                <RadioGroupItem value={method.id} id={method.id} className="mr-2" />
                                <method.icon className={`h-4 w-4 mr-2 ${selectedMethod === method.id ? 'text-blue-900' : 'text-slate-400'}`} />
                                <div className="text-xs">
                                  <p className={`font-medium ${selectedMethod === method.id ? 'text-blue-900' : 'text-slate-900'}`}>
                                    {method.name}
                                  </p>
                                </div>
                              </div>
                            </Label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name" className="text-sm">Full Name *</Label>
                        <Input
                          type="text"
                          id="name"
                          {...register('name')}
                          placeholder="John Doe"
                          className="mt-1"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm">Email *</Label>
                        <Input
                          type="email"
                          id="email"
                          {...register('email')}
                          placeholder="john@example.com"
                          className="mt-1"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="company" className="text-sm">Company</Label>
                        <Input
                          type="text"
                          id="company"
                          {...register('company')}
                          placeholder="Your Company"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm">Phone</Label>
                        <Input
                          type="tel"
                          id="phone"
                          {...register('phone')}
                          placeholder="+1 (555) 000-0000"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-sm">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        rows={3}
                        {...register('notes')}
                        placeholder="Tell us what you'd like to discuss..."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Processing...' : selectedSlot.requires_payment ? 'Continue to Payment' : 'Confirm Booking'}
                  </Button>
                </form>
              </div>
            ) : selectedDate ? (
              <div className="flex-1 flex flex-col">
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    Select a Time
                  </h4>
                  <p className="text-lg font-medium text-slate-900">
                    {formatDate(selectedDate)}
                  </p>
                </div>

                {isLoadingDateSlots ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mx-auto"></div>
                      <p className="mt-3 text-sm text-slate-600">Loading time slots...</p>
                    </div>
                  </div>
                ) : selectedDateSlots.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <ClockIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                      <p className="text-slate-600 font-medium">No available slots</p>
                      <p className="text-sm text-slate-500 mt-1">Please select a different date</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {selectedDateSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot)}
                        className="w-full text-left p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ClockIcon className="h-5 w-5 mr-3 text-blue-900 group-hover:text-blue-600" />
                            <div>
                              <div className="text-base font-semibold text-slate-900">
                                {formatTime(slot.date_time)}
                              </div>
                              <div className="text-xs text-slate-600">{slot.duration_minutes} minutes</div>
                            </div>
                          </div>
                          {slot.requires_payment && (
                            <div className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
                              ${slot.payment_amount}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center py-6">
                <p className="text-sm text-slate-600 mb-6">Select an available date to view time slots</p>
                <div className="calendar-container-modal flex flex-col items-center">
                  <div className="w-full max-w-xl">
                    {isLoadingSlots ? (
                      <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                        <p className="mt-4 text-sm text-slate-600">Loading available dates...</p>
                      </div>
                    ) : allSlots.length === 0 ? (
                      <div className="text-center py-16">
                        <ClockIcon className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                        <p className="text-lg font-medium text-slate-900 mb-1">No available slots</p>
                        <p className="text-sm text-slate-500">Please check back later</p>
                      </div>
                    ) : (
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateClick}
                        disabled={(date) => {
                          const dateStr = date.toISOString().split('T')[0];
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today || !datesWithSlots.has(dateStr);
                        }}
                        modifiers={{
                          hasSlots: datesWithSlotsArray,
                        }}
                        modifiersClassNames={{
                          hasSlots: 'has-slots-day',
                        }}
                        fromDate={new Date()}
                        toDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
                        className="w-full border-none [--cell-size:2.5rem]"
                      />
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="relative h-4 w-4 rounded-md border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
                        <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                      </div>
                      <span className="text-slate-700 font-medium">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded-md border border-slate-300 bg-slate-100"></div>
                      <span className="text-slate-500">Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        /* Modern minimal calendar styling */

        /* Calendar container constraints */
        .calendar-container,
        .calendar-container-modal {
          overflow: hidden;
        }

        .calendar-container [data-slot="calendar"],
        .calendar-container-modal [data-slot="calendar"] {
          width: 100%;
          max-width: 100%;
        }

        /* Available dates with subtle styling and dot indicator */
        .calendar-container .has-slots-day button,
        .calendar-container-modal .has-slots-day button {
          position: relative;
          background: rgba(239, 246, 255, 0.6) !important;
          border: 2px solid rgba(59, 130, 246, 0.3) !important;
          color: #1e3a8a !important;
          font-weight: 600;
          transition: all 0.25s ease;
        }

        .calendar-container .has-slots-day button::after,
        .calendar-container-modal .has-slots-day button::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #3b82f6;
          border-radius: 50%;
        }

        .calendar-container .has-slots-day button:hover,
        .calendar-container-modal .has-slots-day button:hover {
          background: rgba(219, 234, 254, 0.8) !important;
          border-color: #3b82f6 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        /* Today indicator - subtle ring */
        .calendar-container [data-slot="calendar"] button[data-today="true"]:not(.has-slots-day button),
        .calendar-container-modal [data-slot="calendar"] button[data-today="true"]:not(.has-slots-day button) {
          background: rgba(254, 243, 199, 0.3) !important;
          border: 2px solid rgba(251, 191, 36, 0.4) !important;
          font-weight: 600;
          color: #92400e;
        }

        .calendar-container [data-slot="calendar"] button[data-today="true"]:not(.has-slots-day button):hover,
        .calendar-container-modal [data-slot="calendar"] button[data-today="true"]:not(.has-slots-day button):hover {
          background: rgba(254, 243, 199, 0.5) !important;
          border-color: rgba(251, 191, 36, 0.6) !important;
        }

        /* Today with slots - combine both indicators */
        .calendar-container .has-slots-day button[data-today="true"],
        .calendar-container-modal .has-slots-day button[data-today="true"] {
          border: 2px solid #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
        }

        /* Navigation buttons styling */
        .calendar-container [data-slot="calendar"] .rdp-nav button,
        .calendar-container-modal [data-slot="calendar"] .rdp-nav button {
          transition: all 0.2s ease;
          border-radius: 0.5rem;
        }

        .calendar-container [data-slot="calendar"] .rdp-nav button:hover:not(:disabled),
        .calendar-container-modal [data-slot="calendar"] .rdp-nav button:hover:not(:disabled) {
          background: rgba(239, 246, 255, 0.8) !important;
          color: #1e3a8a;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        /* Month/year label styling */
        .calendar-container [data-slot="calendar"] .rdp-month_caption,
        .calendar-container-modal [data-slot="calendar"] .rdp-month_caption {
          color: #1e3a8a;
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 0.4rem;
        }

        /* Weekday headers */
        .calendar-container [data-slot="calendar"] .rdp-weekday,
        .calendar-container-modal [data-slot="calendar"] .rdp-weekday {
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.65rem;
          letter-spacing: 0.04em;
        }

        /* Day cells - clean base styling */
        .calendar-container [data-slot="calendar"] button[data-slot="button"],
        .calendar-container-modal [data-slot="calendar"] button[data-slot="button"] {
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          padding: 1.1rem 0.4rem;
          background: white;
          border: 2px solid transparent;
          font-weight: 500;
          color: #334155;
        }

        .calendar-container [data-slot="calendar"] button[data-slot="button"]:enabled:hover,
        .calendar-container-modal [data-slot="calendar"] button[data-slot="button"]:enabled:hover {
          background-color: #f8fafc;
          border-color: #e2e8f0;
          transform: translateY(-1px);
        }

        .calendar-container [data-slot="calendar"] button[data-slot="button"]:disabled,
        .calendar-container-modal [data-slot="calendar"] button[data-slot="button"]:disabled {
          background-color: transparent;
          color: #cbd5e1;
          cursor: not-allowed;
          opacity: 0.4;
          border: 1px solid transparent;
        }

        /* Selected date */
        .calendar-container [data-slot="calendar"] button[data-selected="true"],
        .calendar-container-modal [data-slot="calendar"] button[data-selected="true"] {
          background: #1e3a8a !important;
          color: white !important;
          border-color: #1e3a8a !important;
          font-weight: 700;
        }

        .calendar-container [data-slot="calendar"] button[data-selected="true"]::after,
        .calendar-container-modal [data-slot="calendar"] button[data-selected="true"]::after {
          background: white !important;
        }

        /* Add more spacing to the calendar grid */
        .calendar-container [data-slot="calendar"] .rdp-week,
        .calendar-container-modal [data-slot="calendar"] .rdp-week {
          margin-top: 0.25rem;
        }

        /* Smooth transitions */
        .calendar-container *,
        .calendar-container-modal * {
          transition-property: background-color, border-color, color, transform, box-shadow;
          transition-duration: 0.2s;
          transition-timing-function: ease-in-out;
        }
      `}</style>
    </>
  );
});

BookingCalendar.displayName = 'BookingCalendar';

export default BookingCalendar;
