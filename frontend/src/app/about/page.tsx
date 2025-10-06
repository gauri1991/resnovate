'use client';

import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  LightBulbIcon,
  TrophyIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import LeadCaptureForm from '../../components/LeadCaptureForm';

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

const milestones = [
  {
    year: '2020',
    title: 'Company Founded',
    description: 'Resnovate.ai was established with a vision to revolutionize business through artificial intelligence.',
  },
  {
    year: '2021',
    title: 'First AI Platform Launch',
    description: 'Launched our proprietary market analysis platform, serving 50+ business professionals.',
  },
  {
    year: '2022',
    title: 'Series A Funding',
    description: 'Secured $5M in Series A funding to expand our technology and team.',
  },
  {
    year: '2023',
    title: 'International Expansion',
    description: 'Expanded operations to serve clients across North America and Europe.',
  },
  {
    year: '2024',
    title: 'Industry Recognition',
    description: 'Named "AI Consulting Firm of the Year" by Technology Innovation Awards.',
  },
];

export default function About() {
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
              About <span className="text-gradient">Resnovate.ai</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We're on a mission to transform businesses across industries through artificial intelligence, 
              machine learning, and innovative solutions that drive measurable results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-900">Our Mission</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Empowering Business Excellence Through AI
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              At Resnovate.ai, we believe that artificial intelligence should not replace human expertise, 
              but amplify it. Our mission is to provide businesses with the most advanced 
              AI-powered tools and insights, enabling them to make better decisions, reduce risks, and 
              maximize returns while driving digital transformation and innovation.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {values.map((value) => (
                <motion.div
                  key={value.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                    <value.icon className="h-5 w-5 flex-none text-blue-900" aria-hidden="true" />
                    {value.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">{value.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Our Story/Timeline */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-900">Our Journey</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Building the Future of Business Through AI
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              From a vision to revolutionize business through AI to becoming a trusted partner 
              for hundreds of enterprises and organizations worldwide.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
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
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-900">Our Team</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Meet the Experts Behind the Innovation
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Our diverse team combines decades of business expertise with cutting-edge 
              AI research and development experience.
            </p>
          </div>

          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {team.map((person, index) => (
              <motion.div
                key={person.name}
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
        </div>
      </section>

      {/* Stats/Achievements */}
      <section className="bg-blue-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Impact by the Numbers
            </h2>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Measurable results that demonstrate our commitment to client success and industry innovation.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-blue-100">Clients Served</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  500+
                </dd>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-blue-100">AI Models Deployed</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  25+
                </dd>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-blue-100">Countries Served</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  12
                </dd>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-blue-100">Awards Won</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  8
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </section>

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