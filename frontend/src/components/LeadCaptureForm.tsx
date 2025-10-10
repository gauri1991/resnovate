'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { leadsAPI } from '../lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  title?: string;
  description?: string;
  submitText?: string;
  source?: string;
  className?: string;
}

export default function LeadCaptureForm({
  title = 'Get Started Today',
  description = 'Ready to transform your business with AI solutions? Fill out the form below and we\'ll get back to you within 24 hours.',
  submitText = 'Submit',
  source = 'website',
  className = '',
}: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      await leadsAPI.createLead({
        ...data,
        source,
      });
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Lead submission failed:', error);
      alert('Failed to submit. Please try again.');
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className={`rounded-lg bg-green-50 p-6 min-h-full flex flex-col justify-center ${className}`}>
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
          <h3 className="mt-4 text-lg font-medium text-green-900">Thank you!</h3>
          <p className="mt-2 text-sm text-green-700">
            We've received your information and will get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-white p-6 shadow-lg flex flex-col min-h-full ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
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
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              type="tel"
              id="phone"
              {...register('phone')}
              placeholder="+1 (555) 000-0000"
              className="mt-1"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              rows={4}
              {...register('message')}
              placeholder="Tell us what resources would be most valuable for your business..."
              className="mt-1"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            By submitting this form, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </form>
    </div>
  );
}
