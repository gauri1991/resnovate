'use client';

import { motion } from 'framer-motion';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import LeadCaptureForm from '../../components/LeadCaptureForm';
import BookingCalendar from '../../components/BookingCalendar';

const contactInfo = [
  {
    name: 'Phone',
    value: '+1 (555) 123-4567',
    icon: PhoneIcon,
    href: 'tel:+15551234567',
  },
  {
    name: 'Email',
    value: 'hello@resnovate.ai',
    icon: EnvelopeIcon,
    href: 'mailto:hello@resnovate.ai',
  },
  {
    name: 'Office',
    value: '123 Innovation Drive, Suite 100\nSan Francisco, CA 94107',
    icon: MapPinIcon,
    href: 'https://maps.google.com/?q=123+Innovation+Drive+San+Francisco+CA',
  },
  {
    name: 'Business Hours',
    value: 'Mon-Fri: 9:00 AM - 6:00 PM PST\nSat-Sun: By appointment',
    icon: ClockIcon,
    href: null,
  },
];

const faqs = [
  {
    question: 'How quickly can we get started?',
    answer: 'We can typically begin our discovery phase within 1-2 weeks of our initial consultation. Implementation timelines vary based on project scope, but most clients see initial results within 4-6 weeks.',
  },
  {
    question: 'Do you work with small businesses?',
    answer: 'Absolutely! We work with businesses of all sizes, from startups to enterprise organizations. Our AI solutions are scalable and can be tailored to fit any budget and business needs.',
  },
  {
    question: 'What kind of ROI can we expect from AI implementation?',
    answer: 'While results vary by client and implementation, our average client sees a 35% improvement in operational efficiency and cost savings within the first year. We provide detailed ROI projections during our consultation process.',
  },
  {
    question: 'Is training included in your AI implementation services?',
    answer: 'Yes, comprehensive training and ongoing support are included with all our AI solutions. We ensure your team is fully equipped to maximize the value of our AI-powered tools and achieve successful digital transformation.',
  },
];

const offices = [
  {
    city: 'San Francisco',
    address: '123 Innovation Drive, Suite 100\nSan Francisco, CA 94107',
    phone: '+1 (555) 123-4567',
    email: 'sf@resnovate.ai',
  },
  {
    city: 'New York',
    address: '456 Tech Plaza, 25th Floor\nNew York, NY 10001',
    phone: '+1 (555) 234-5678',
    email: 'ny@resnovate.ai',
  },
  {
    city: 'London',
    address: '789 Financial District\nLondon EC2M 1QS, UK',
    phone: '+44 20 7123 4567',
    email: 'london@resnovate.ai',
  },
];

export default function Contact() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-secondary py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Ready to transform your business with AI? We're here to help. 
              Schedule a consultation or reach out with any questions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-900">Contact Information</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Multiple Ways to Connect
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 sm:mt-20 lg:grid-cols-4 lg:gap-8">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900 mb-4">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-3">{item.name}</h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-slate-600 hover:text-blue-900 transition-colors duration-200 block"
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {item.value.split('\n').map((line, i) => (
                        <div key={i} className="mb-1">{line}</div>
                      ))}
                    </a>
                  ) : (
                    <div className="text-sm text-slate-600">
                      {item.value.split('\n').map((line, i) => (
                        <div key={i} className="mb-1">{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Calendar */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Let's Start a Conversation
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Choose the best way to connect with our team
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-12 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <LeadCaptureForm
                title="Send us a Message"
                description="Fill out the form below and we'll get back to you within 24 hours."
                submitText="Send Message"
                source="contact_page"
              />
            </div>
            
            {/* Booking Calendar */}
            <div>
              <BookingCalendar className="h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Our Offices
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We have offices in major cities around the world to serve you better
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{office.city}</h3>
                
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{office.address.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    <a href={`tel:${office.phone}`} className="hover:text-blue-900 transition-colors duration-200">
                      {office.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    <a href={`mailto:${office.email}`} className="hover:text-blue-900 transition-colors duration-200">
                      {office.email}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Quick answers to common questions about our services and process
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl bg-white p-8 shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-7">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="bg-blue-900 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Need Immediate Assistance?
            </h2>
            <p className="mt-4 text-lg leading-8 text-blue-100">
              For urgent AI implementation support, call our 24/7 technical assistance line
            </p>
            <div className="mt-8">
              <a
                href="tel:+15551234567"
                className="inline-flex items-center rounded-md bg-amber-500 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                <PhoneIcon className="mr-2 h-5 w-5" />
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}