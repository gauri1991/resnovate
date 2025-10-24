'use client';

import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  LightBulbIcon,
  TrophyIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import LeadCaptureForm from '../../components/LeadCaptureForm';
import { useCMSContent } from '@/hooks/useCMSContent';

export default function About() {
  const { sections, loading } = useCMSContent('about');

  return (
    <div className="bg-white">
      {/* Hero Section */}
      {sections.hero && (
        <section className="relative bg-gradient-secondary py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                {sections.hero.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {sections.hero.description}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Mission Statement */}
      {sections.overview && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-900">Our Mission</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {sections.overview.title}
              </p>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {sections.overview.mission}
              </p>
            </div>

            {sections.values && sections.values.values && sections.values.values.length > 0 && (
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                  {sections.values.values.map((value: any, index: number) => (
                    <motion.div
                      key={`value-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col"
                    >
                      <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                        {value.icon ? <value.icon className="h-5 w-5 flex-none text-blue-900" aria-hidden="true" /> : <LightBulbIcon className="h-5 w-5 flex-none text-blue-900" />}
                        {value.name}
                      </dt>
                      <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                        <p className="flex-auto">{value.description}</p>
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Our Story/Timeline */}
      {sections.milestones && (
        <section className="bg-slate-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-900">{sections.milestones.subtitle}</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {sections.milestones.title}
              </p>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {sections.milestones.description}
              </p>
            </div>

            {sections.milestones.milestones && sections.milestones.milestones.length > 0 && (
              <div className="mx-auto mt-16 max-w-4xl">
                <div className="space-y-8">
                  {sections.milestones.milestones.map((milestone, index) => (
                    <motion.div
                      key={`milestone-${index}`}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative flex items-center space-x-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-900 text-white font-bold text-lg">
                          {milestone.year}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">{milestone.title}</h3>
                        <p className="mt-1 text-slate-600">{milestone.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Team Section */}
      {sections.team && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-900">Our Team</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {sections.team.title}
              </p>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {sections.team.description}
              </p>
            </div>

            {sections.team.team_members && sections.team.team_members.length > 0 && (
              <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                {sections.team.team_members.map((person: any, index: number) => (
                  <motion.div
                    key={`team-member-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    {person.image ? (
                      <img
                        src={person.image}
                        alt={person.name}
                        className="h-48 w-48 rounded-full object-cover bg-slate-200 mb-4"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`h-48 w-48 rounded-full bg-slate-200 mb-4 flex items-center justify-center text-slate-500 text-6xl font-bold ${person.image ? 'hidden' : ''}`}>
                      {person.name?.charAt(0) || '?'}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{person.name}</h3>
                    <p className="text-blue-900 font-medium">{person.role}</p>
                    <p className="mt-3 text-sm text-slate-600 text-center">{person.bio}</p>

                    {/* Social links */}
                    {(person.linkedin || person.twitter) && (
                      <div className="mt-4 flex items-center gap-x-4">
                        {person.linkedin && (
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        {person.twitter && (
                          <a
                            href={person.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats/Achievements */}
      {sections.stats && (
        <section className="bg-blue-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {sections.stats.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-blue-100">
                {sections.stats.description}
              </p>
            </div>

            {sections.stats.stats && sections.stats.stats.length > 0 && (
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
                  {sections.stats.stats.map((stat, index) => (
                    <motion.div
                      key={`stat-${index}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="mx-auto flex max-w-xs flex-col gap-y-4"
                    >
                      <dt className="text-base leading-7 text-blue-100">{stat.label}</dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                        {stat.value}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ready to Join Our Success Story?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Become part of the growing community of forward-thinking businesses who are leveraging 
              AI to transform their operations and achieve unprecedented results.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl">
            <LeadCaptureForm
              title="Start Your Transformation Today"
              description="Schedule a free consultation to learn how Resnovate.ai can help you achieve your business goals."
              submitText="Get Started"
              source="about_page"
            />
          </div>
        </div>
      </section>
    </div>
  );
}