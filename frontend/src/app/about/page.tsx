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

const values = [
  {
    name: 'Innovation First',
    description: 'We constantly push the boundaries of what\'s possible in AI technology, delivering cutting-edge solutions that create competitive advantages for businesses across industries.',
    icon: LightBulbIcon,
  },
  {
    name: 'Client Success',
    description: 'Your success is our success. We measure our achievements by the tangible results and ROI improvements we deliver to our clients.',
    icon: TrophyIcon,
  },
  {
    name: 'Collaborative Partnership',
    description: 'We work as an extension of your team, bringing together diverse expertise to solve complex business challenges through AI innovation.',
    icon: UserGroupIcon,
  },
  {
    name: 'Global Perspective',
    description: 'Our solutions are designed to work across markets and regions, incorporating global best practices and emerging trends.',
    icon: GlobeAltIcon,
  },
];

const team = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Founder & CEO',
    bio: 'Former VP of Innovation at a Fortune 500 company with 15+ years in AI and technology transformation. PhD in Machine Learning from Stanford.',
    image: '/team-sarah.jpg',
  },
  {
    name: 'Marcus Chen',
    role: 'CTO & Co-founder',
    bio: 'Ex-Google AI researcher with expertise in computer vision and predictive analytics. Led development of three successful AI platforms for enterprise clients.',
    image: '/team-marcus.jpg',
  },
  {
    name: 'Jennifer Rodriguez',
    role: 'Head of Strategy',
    bio: '20+ years in business strategy and digital transformation. Former Director at McKinsey with extensive experience in AI-driven business solutions.',
    image: '/team-jennifer.jpg',
  },
  {
    name: 'David Kim',
    role: 'Senior Data Scientist',
    bio: 'PhD in Statistics from MIT. Specializes in predictive analytics, machine learning models, and AI-driven risk assessment for enterprises.',
    image: '/team-david.jpg',
  },
];

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
      {(sections.overview || sections.values) && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {sections.overview && (
              <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-blue-900">Our Mission</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {sections.overview.title}
                </p>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  {sections.overview.mission}
                </p>
              </div>
            )}

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
                    <div className="h-48 w-48 rounded-full bg-slate-200 mb-4"></div>
                    <h3 className="text-lg font-semibold text-slate-900">{person.name}</h3>
                    <p className="text-blue-900 font-medium">{person.role}</p>
                    <p className="mt-3 text-sm text-slate-600 text-center">{person.bio}</p>
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