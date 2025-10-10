'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CogIcon,
  BuildingOfficeIcon,
  HomeIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import LeadCaptureForm from '../../components/LeadCaptureForm';
import { contentAPI } from '../../lib/api';
import { Service } from '../../types';
import { useCMSContent } from '@/hooks/useCMSContent';

const iconMapping: Record<string, any> = {
  'AI Strategy & Implementation': ChartBarIcon,
  'Machine Learning Solutions': CogIcon,
  'Process Automation & RPA': BuildingOfficeIcon,
  'Data Analytics & Business Intelligence': HomeIcon,
  'AI Training & Change Management': LightBulbIcon,
  'Custom AI Solutions Development': ShieldCheckIcon,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { sections, loading } = useCMSContent('services');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await contentAPI.getServices();
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      {sections.header && (
        <section className="relative bg-gradient-secondary py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                {sections.header.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {sections.header.description}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Core Services Grid */}
      {(sections.services_list || sections.core_services) && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {sections.services_list && (
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-base font-semibold leading-7 text-blue-900">{sections.services_list.subtitle}</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {sections.services_list.title}
                </p>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  {sections.services_list.description}
                </p>
              </div>
            )}

            {sections.core_services && sections.core_services.services && sections.core_services.services.length > 0 && (
              <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
                {sections.core_services.services.map((service, index) => {
                  const IconComponent = iconMapping[service.name] || ChartBarIcon;
                  return (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div>
                        <div className="mb-6">
                          <IconComponent className="h-8 w-8 text-blue-900" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">{service.name}</h3>
                        <p className="mt-4 text-sm text-slate-600">{service.description}</p>

                        <ul className="mt-6 space-y-2">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start">
                              <CheckIcon className="h-5 w-5 text-blue-900 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8">
                        <div className="mb-4">
                          <div className="text-sm text-slate-500">Starting from</div>
                          <div className="text-lg font-semibold text-slate-900">{service.priceRange}</div>
                          <div className="text-sm text-slate-500">Timeline: {service.duration}</div>
                        </div>

                        <button
                          onClick={() => setSelectedService(service.name)}
                          className="w-full rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 transition-colors duration-200"
                        >
                          Learn More
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Process Section */}
      {(sections.process || sections.process_steps) && (
        <section className="bg-slate-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {sections.process && (
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-base font-semibold leading-7 text-blue-900">{sections.process.subtitle}</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {sections.process.title}
                </p>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  {sections.process.description}
                </p>
              </div>
            )}

            {sections.process_steps && sections.process_steps.steps && sections.process_steps.steps.length > 0 && (
              <div className="mx-auto mt-16 max-w-4xl">
                <div className="space-y-12">
                  {sections.process_steps.steps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-white font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                        <p className="mt-2 text-slate-600">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* API Services Section */}
      {!isLoading && services.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-900">Additional Services</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Specialized Solutions
              </p>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Explore our additional specialized services tailored to specific industry needs.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
              {services.filter(service => service.is_active).map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{service.name}</h3>
                    <p className="mt-4 text-sm text-slate-600">{service.description}</p>
                    
                    {service.features.length > 0 && (
                      <ul className="mt-6 space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-blue-900 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <div className="mb-4">
                      <div className="text-sm text-slate-500">Price Range</div>
                      <div className="text-lg font-semibold text-slate-900">{service.price_range}</div>
                      <div className="text-sm text-slate-500">Duration: {service.duration}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {sections.why_choose && (
        <section className="bg-blue-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {sections.why_choose.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-blue-100">
                {sections.why_choose.description}
              </p>
            </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Proven ROI
                </dt>
                <dd className="mt-2 text-base leading-7 text-blue-100">
                  Our clients see an average of 35% improvement in ROI within the first year of implementation.
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <CogIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Expert Team
                </dt>
                <dd className="mt-2 text-base leading-7 text-blue-100">
                  Our team combines 50+ years of industry experience with PhD-level AI and machine learning expertise.
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <LightBulbIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Cutting-Edge Technology
                </dt>
                <dd className="mt-2 text-base leading-7 text-blue-100">
                  We use the latest AI and machine learning technologies, continuously updated with market insights.
                </dd>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Ongoing Support
                </dt>
                <dd className="mt-2 text-base leading-7 text-blue-100">
                  24/7 support and continuous optimization ensure you get maximum value from our solutions.
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </section>
      )}

      {/* CTA Section */}
      {sections.cta && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {sections.cta.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {sections.cta.description}
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl">
              <LeadCaptureForm
                title="Get Your Free Consultation"
                description="Tell us about your challenges and goals, and we'll recommend the best solutions for your needs."
                submitText="Request Consultation"
                source="services_page"
              />
            </div>
          </div>
        </section>
      )}

      {/* Service Details Modal/Popup could be added here */}
      {selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedService(null)}></div>
            
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-slate-900">
                      {selectedService}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-500">
                        Contact us to learn more about this service and how it can benefit your business.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-900 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedService(null)}
                >
                  Contact Us
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedService(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}