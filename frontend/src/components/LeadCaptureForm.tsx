'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { leadsAPI } from '../lib/api';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  industry: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  budget_range: z.string().optional(),
  project_timeline: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  title?: string;
  description?: string;
  submitText?: string;
  source?: string;
  className?: string;
}

const budgetRanges = [
  { value: '$10k-$25k', label: '$10,000 - $25,000' },
  { value: '$25k-$50k', label: '$25,000 - $50,000' },
  { value: '$50k-$100k', label: '$50,000 - $100,000' },
  { value: '$100k+', label: '$100,000+' },
];

const timelines = [
  { value: 'immediate', label: 'Immediate (0-1 month)' },
  { value: 'short-term', label: 'Short-term (1-3 months)' },
  { value: 'medium-term', label: 'Medium-term (3-6 months)' },
  { value: 'long-term', label: 'Long-term (6+ months)' },
];

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
          <h3 className="mt-4 text-lg font-medium text-green-900">Thank you!</h3>
          <p className="mt-2 text-sm text-green-700">
            We've received your information and will get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-white p-6 shadow-lg ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
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
          <label htmlFor="industry" className="block text-sm font-medium text-slate-700">
            Industry
          </label>
          <select
            id="industry"
            {...register('industry')}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select an industry</option>
            <option value="healthcare">Healthcare & Life Sciences</option>
            <option value="financial">Financial Services & FinTech</option>
            <option value="manufacturing">Manufacturing & Industry 4.0</option>
            <option value="retail">Retail & E-commerce</option>
            <option value="technology">Technology & Software</option>
            <option value="energy">Energy & Utilities</option>
            <option value="education">Education & EdTech</option>
            <option value="government">Government & Public Sector</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="budget_range" className="block text-sm font-medium text-slate-700">
              Budget Range
            </label>
            <select
              id="budget_range"
              {...register('budget_range')}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select budget range</option>
              {budgetRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="project_timeline" className="block text-sm font-medium text-slate-700">
              Project Timeline
            </label>
            <select
              id="project_timeline"
              {...register('project_timeline')}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select timeline</option>
              {timelines.map((timeline) => (
                <option key={timeline.value} value={timeline.value}>
                  {timeline.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">
            Message *
          </label>
          <textarea
            id="message"
            rows={4}
            {...register('message')}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Tell us about your project and how we can help..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center">
          By submitting this form, you agree to our Privacy Policy and Terms of Service.
        </p>
      </form>
    </div>
  );
}