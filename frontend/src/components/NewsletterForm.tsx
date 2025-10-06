'use client';

import { useState } from 'react';
import { leadsAPI } from '../lib/api';

interface NewsletterFormProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  inline?: boolean;
}

export default function NewsletterForm({
  title = 'Stay Updated',
  description = 'Get the latest insights and updates on real estate innovation.',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  className = '',
  inline = false,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await leadsAPI.subscribeNewsletter(email);
      setSubmitted(true);
      setEmail('');
    } catch (error: any) {
      console.error('Newsletter subscription failed:', error);
      if (error.response?.data?.email) {
        setError(error.response.data.email[0]);
      } else {
        setError('Failed to subscribe. Please try again.');
      }
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className={`rounded-lg bg-green-50 p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Successfully subscribed! Thank you for joining our newsletter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {!inline && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={inline ? 'flex gap-2' : 'space-y-3'}>
        <div className={inline ? 'flex-1' : ''}>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`
              block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 
              placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6
              ${error ? 'ring-red-300 focus:ring-red-500' : ''}
            `}
            placeholder={placeholder}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            flex justify-center rounded-md bg-blue-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm 
            hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
            ${inline ? '' : 'w-full'}
          `}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </>
          ) : (
            buttonText
          )}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {!inline && (
        <p className="mt-2 text-xs text-slate-500">
          We respect your privacy. Unsubscribe at any time.
        </p>
      )}
    </div>
  );
}