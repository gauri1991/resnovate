'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { XMarkIcon, ClockIcon, VideoCameraIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ConsultationSlot } from '../types';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { consultationAPI } from '../lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface TimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  slots: ConsultationSlot[];
}

const communicationMethods = [
  { id: 'zoom', name: 'Zoom', icon: VideoCameraIcon },
  { id: 'teams', name: 'Microsoft Teams', icon: VideoCameraIcon },
  { id: 'direct_call', name: 'Direct Call', icon: PhoneIcon },
  { id: 'google_meet', name: 'Google Meet', icon: VideoCameraIcon },
];

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

export default function TimeSlotModal({ isOpen, onClose, selectedDate, slots }: TimeSlotModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('zoom');
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

  const handleClose = () => {
    setSelectedSlot(null);
    setSelectedMethod('zoom');
    setShowBookingForm(false);
    setShowPaymentForm(false);
    setClientSecret('');
    setBookingId(null);
    setBookingComplete(false);
    setError('');
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {bookingComplete ? 'Booking Confirmed!' : showPaymentForm ? 'Complete Payment' : showBookingForm ? 'Book Your Consultation' : 'Select a Time Slot'}
          </DialogTitle>
        </DialogHeader>

        <div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {bookingComplete ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                      <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-green-900 mb-2">Consultation Booked!</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      You'll receive a confirmation email with the meeting details shortly.
                    </p>
                    {selectedSlot && (
                      <div className="bg-slate-50 p-4 rounded-md text-left max-w-md mx-auto">
                        <p className="text-sm text-slate-600">
                          <strong>Date:</strong> {selectedDate && formatDate(selectedDate)}
                        </p>
                        <p className="text-sm text-slate-600">
                          <strong>Time:</strong> {formatTime(selectedSlot.date_time)}
                        </p>
                        <p className="text-sm text-slate-600">
                          <strong>Method:</strong> {communicationMethods.find(m => m.id === selectedMethod)?.name}
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={handleClose}
                      className="mt-6"
                    >
                      Close
                    </Button>
                  </div>
                ) : showPaymentForm ? (
                  <div>
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-900">
                        <strong>Refundable Booking Fee:</strong> A $10 booking fee secures your consultation slot.
                        This fee is fully refundable if you cancel at least 24 hours before your appointment.
                      </p>
                    </div>

                    {selectedSlot && (
                      <div className="mb-6 bg-slate-50 p-4 rounded-md">
                        <p className="text-sm text-slate-600">
                          <strong>Date:</strong> {selectedDate && formatDate(selectedDate)}
                        </p>
                        <p className="text-sm text-slate-600">
                          <strong>Time:</strong> {formatTime(selectedSlot.date_time)}
                        </p>
                        <p className="text-sm text-slate-600">
                          <strong>Method:</strong> {communicationMethods.find(m => m.id === selectedMethod)?.name}
                        </p>
                      </div>
                    )}

                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        clientSecret={clientSecret}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </Elements>

                    <Button
                      variant="ghost"
                      onClick={() => setShowPaymentForm(false)}
                      className="mt-4 w-full text-center text-sm text-slate-600 hover:text-slate-900"
                    >
                      ← Back to booking details
                    </Button>
                  </div>
                ) : showBookingForm && selectedSlot ? (
                  <div>
                    <div className="mb-6 p-4 bg-slate-50 rounded-md">
                      <div className="flex items-center text-sm text-slate-600 mb-2">
                        <ClockIcon className="h-5 w-5 mr-2" />
                        <span>
                          {selectedDate && formatDate(selectedDate)} at {formatTime(selectedSlot.date_time)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        Duration: {selectedSlot.duration_minutes} minutes
                      </p>
                    </div>

                    {selectedSlot.requires_payment && (
                      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="text-sm text-amber-900">
                          💳 <strong>$10 booking fee required</strong> - Fully refundable if canceled 24+ hours in advance
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <Label className="block text-sm font-medium text-slate-700 mb-2">
                          Preferred Communication Method *
                        </Label>
                        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                          <div className="grid grid-cols-2 gap-3">
                            {communicationMethods.map((method) => (
                              <Label
                                key={method.id}
                                htmlFor={method.id}
                                className={`${
                                  selectedMethod === method.id ? 'ring-2 ring-blue-900 bg-blue-50' : 'ring-1 ring-slate-200'
                                } relative flex cursor-pointer rounded-lg px-4 py-3 shadow-sm focus:outline-none`}
                              >
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center">
                                    <RadioGroupItem value={method.id} id={method.id} className="mr-2" />
                                    <method.icon className={`h-5 w-5 mr-2 ${selectedMethod === method.id ? 'text-blue-900' : 'text-slate-400'}`} />
                                    <div className="text-sm">
                                      <p className={`font-medium ${selectedMethod === method.id ? 'text-blue-900' : 'text-slate-900'}`}>
                                        {method.name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Label>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            type="text"
                            id="name"
                            {...register('name')}
                            placeholder="John Doe"
                            className="mt-1"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            type="email"
                            id="email"
                            {...register('email')}
                            placeholder="john@example.com"
                            className="mt-1"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            type="text"
                            id="company"
                            {...register('company')}
                            placeholder="Your Company"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
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
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          rows={3}
                          {...register('notes')}
                          placeholder="Tell us what you'd like to discuss..."
                          className="mt-1"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowBookingForm(false);
                            setSelectedSlot(null);
                          }}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    {selectedDate && (
                      <p className="text-sm text-slate-600 mb-4">
                        Available slots for <strong>{formatDate(selectedDate)}</strong>
                      </p>
                    )}

                    {slots.length === 0 ? (
                      <div className="text-center py-12">
                        <ClockIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <p className="text-slate-600">No available slots for this date.</p>
                        <p className="text-sm text-slate-500 mt-1">Please select a different date.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                        {slots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant="outline"
                            onClick={() => handleSlotSelect(slot)}
                            className="text-left p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 h-auto justify-start"
                          >
                            <div className="w-full">
                              <div className="flex items-center text-sm font-medium text-slate-900 mb-1">
                                <ClockIcon className="h-4 w-4 mr-2 text-blue-900" />
                                {formatTime(slot.date_time)}
                              </div>
                              <div className="text-xs text-slate-600">{slot.duration_minutes} minutes</div>
                              {slot.requires_payment && (
                                <div className="text-xs font-medium text-blue-900 mt-1">
                                  ${slot.payment_amount} booking fee
                                </div>
                              )}
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
