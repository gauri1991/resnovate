#!/usr/bin/env python3
"""
Seed script to create initial CMS page sections
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.content.models import PageSection

def create_sections():
    """Create initial page sections for the CMS"""

    sections_data = [
        # Homepage sections
        {
            'page_identifier': 'homepage',
            'section_name': 'Hero Section',
            'section_key': 'hero',
            'enabled': True,
            'order': 1,
            'content': {
                'title': 'Transform Your Business with Innovation',
                'subtitle': 'We help businesses grow through strategic consulting and digital transformation',
                'cta_text': 'Get Started',
                'cta_link': '/contact',
                'background_image': '/images/hero-bg.jpg'
            }
        },
        {
            'page_identifier': 'homepage',
            'section_name': 'Services Overview',
            'section_key': 'services_overview',
            'enabled': True,
            'order': 2,
            'content': {
                'title': 'Our Services',
                'description': 'Comprehensive solutions tailored to your business needs',
                'show_all_services': True,
                'max_services': 6
            }
        },
        {
            'page_identifier': 'homepage',
            'section_name': 'Case Studies',
            'section_key': 'case_studies',
            'enabled': True,
            'order': 3,
            'content': {
                'title': 'Success Stories',
                'description': 'See how we\'ve helped businesses achieve their goals',
                'show_featured_only': True,
                'max_items': 3
            }
        },
        {
            'page_identifier': 'homepage',
            'section_name': 'Testimonials',
            'section_key': 'testimonials',
            'enabled': True,
            'order': 4,
            'content': {
                'title': 'What Our Clients Say',
                'testimonials': []
            }
        },
        {
            'page_identifier': 'homepage',
            'section_name': 'Call to Action',
            'section_key': 'cta',
            'enabled': True,
            'order': 5,
            'content': {
                'title': 'Ready to Transform Your Business?',
                'description': 'Join hundreds of business leaders who have revolutionized their operations with our AI-powered solutions.',
                'button_text': 'Schedule Consultation',
                'button_link': '/contact'
            }
        },
        {
            'page_identifier': 'homepage',
            'section_name': 'Statistics',
            'section_key': 'stats',
            'enabled': True,
            'order': 6,
            'content': {
                'stats': [
                    {'id': 1, 'name': 'Business Value Delivered', 'value': '$2.5B+'},
                    {'id': 2, 'name': 'AI Projects Completed', 'value': '150+'},
                    {'id': 3, 'name': 'Client Satisfaction', 'value': '98%'},
                    {'id': 4, 'name': 'Efficiency Improvement', 'value': '35%'}
                ]
            }
        },
        {
            'page_identifier': 'homepage',
            'section_name': 'Features',
            'section_key': 'features',
            'enabled': True,
            'order': 7,
            'content': {
                'title': 'Revolutionize Your Business Operations',
                'subtitle': 'Everything you need',
                'description': 'Our comprehensive suite of AI-powered tools and expert consulting services help you make smarter decisions, reduce costs, and maximize returns on every business investment.',
                'features': [
                    {
                        'name': 'AI-Powered Analytics',
                        'description': 'Leverage machine learning to analyze business data, performance metrics, and market opportunities with unprecedented accuracy.'
                    },
                    {
                        'name': 'Smart Automation',
                        'description': 'Automate routine tasks, streamline workflows, and reduce operational costs while improving efficiency across all business functions.'
                    },
                    {
                        'name': 'Innovation Strategy',
                        'description': 'Stay ahead of the competition with cutting-edge AI strategies tailored to your industry and business objectives.'
                    },
                    {
                        'name': 'Risk Management',
                        'description': 'Identify and mitigate risks before they impact your business using predictive analytics and intelligent monitoring systems.'
                    }
                ]
            }
        },

        # About Page sections
        {
            'page_identifier': 'about',
            'section_name': 'About Hero',
            'section_key': 'hero',
            'enabled': True,
            'order': 1,
            'content': {
                'title': 'About Resnovate',
                'description': 'We\'re on a mission to transform businesses across industries through artificial intelligence, machine learning, and innovative solutions that drive measurable results.'
            }
        },
        {
            'page_identifier': 'about',
            'section_name': 'Company Overview',
            'section_key': 'overview',
            'enabled': True,
            'order': 2,
            'content': {
                'title': 'Empowering Business Excellence Through AI',
                'description': 'Your trusted partner in business transformation',
                'mission': 'At Resnovate, we believe that artificial intelligence should not replace human expertise, but amplify it. Our mission is to provide businesses with the most advanced AI-powered tools and insights, enabling them to make better decisions, reduce risks, and maximize returns while driving digital transformation and innovation.',
                'vision': 'To be the leading consulting firm in digital transformation'
            }
        },
        {
            'page_identifier': 'about',
            'section_name': 'Team Section',
            'section_key': 'team',
            'enabled': True,
            'order': 3,
            'content': {
                'title': 'Meet the Experts Behind the Innovation',
                'description': 'Our diverse team combines decades of business expertise with cutting-edge AI research and development experience.',
                'team_members': []
            }
        },
        {
            'page_identifier': 'about',
            'section_name': 'Values',
            'section_key': 'values',
            'enabled': True,
            'order': 4,
            'content': {
                'title': 'Our Values',
                'values': [
                    {'name': 'Innovation First', 'description': 'We constantly push the boundaries of what\'s possible in AI technology, delivering cutting-edge solutions that create competitive advantages for businesses across industries.'},
                    {'name': 'Client Success', 'description': 'Your success is our success. We measure our achievements by the tangible results and ROI improvements we deliver to our clients.'},
                    {'name': 'Collaborative Partnership', 'description': 'We work as an extension of your team, bringing together diverse expertise to solve complex business challenges through AI innovation.'},
                    {'name': 'Global Perspective', 'description': 'Our solutions are designed to work across markets and regions, incorporating global best practices and emerging trends.'}
                ]
            }
        },
        {
            'page_identifier': 'about',
            'section_name': 'Milestones',
            'section_key': 'milestones',
            'enabled': True,
            'order': 5,
            'content': {
                'title': 'Building the Future of Business Through AI',
                'subtitle': 'Our Journey',
                'description': 'From a vision to revolutionize business through AI to becoming a trusted partner for hundreds of enterprises and organizations worldwide.',
                'milestones': [
                    {
                        'year': '2020',
                        'title': 'Company Founded',
                        'description': 'Resnovate.ai was established with a vision to revolutionize business through artificial intelligence.'
                    },
                    {
                        'year': '2021',
                        'title': 'First AI Platform Launch',
                        'description': 'Launched our proprietary market analysis platform, serving 50+ business professionals.'
                    },
                    {
                        'year': '2022',
                        'title': 'Series A Funding',
                        'description': 'Secured $5M in Series A funding to expand our technology and team.'
                    },
                    {
                        'year': '2023',
                        'title': 'International Expansion',
                        'description': 'Expanded operations to serve clients across North America and Europe.'
                    },
                    {
                        'year': '2024',
                        'title': 'Industry Recognition',
                        'description': 'Named "AI Consulting Firm of the Year" by Technology Innovation Awards.'
                    }
                ]
            }
        },
        {
            'page_identifier': 'about',
            'section_name': 'Stats/Achievements',
            'section_key': 'stats',
            'enabled': True,
            'order': 6,
            'content': {
                'title': 'Our Impact by the Numbers',
                'description': 'Measurable results that demonstrate our commitment to client success and industry innovation.',
                'stats': [
                    {'label': 'Clients Served', 'value': '500+'},
                    {'label': 'AI Models Deployed', 'value': '25+'},
                    {'label': 'Countries Served', 'value': '12'},
                    {'label': 'Awards Won', 'value': '8'}
                ]
            }
        },

        # Services Page sections
        {
            'page_identifier': 'services',
            'section_name': 'Services Header',
            'section_key': 'header',
            'enabled': True,
            'order': 1,
            'content': {
                'title': 'Our Services',
                'description': 'Comprehensive solutions to drive your business forward'
            }
        },
        {
            'page_identifier': 'services',
            'section_name': 'Services List',
            'section_key': 'services_list',
            'enabled': True,
            'order': 2,
            'content': {
                'title': 'Comprehensive AI Consulting Solutions',
                'subtitle': 'What We Offer',
                'description': 'Choose from our suite of specialized AI services, each designed to address specific challenges and opportunities across various industries.',
                'show_all': True,
                'layout': 'grid'
            }
        },
        {
            'page_identifier': 'services',
            'section_name': 'Core Services',
            'section_key': 'core_services',
            'enabled': True,
            'order': 3,
            'content': {
                'services': [
                    {
                        'name': 'AI Strategy & Implementation',
                        'description': 'Comprehensive AI strategy development and implementation to transform your business operations.',
                        'features': [
                            'AI readiness assessment',
                            'Strategic roadmap development',
                            'Technology stack selection',
                            'ROI optimization planning',
                            'Change management support',
                        ],
                        'priceRange': '$75,000 - $150,000',
                        'duration': '12-16 weeks',
                    },
                    {
                        'name': 'Machine Learning Solutions',
                        'description': 'Custom machine learning models and predictive analytics to drive intelligent decision-making.',
                        'features': [
                            'Predictive analytics models',
                            'Natural language processing',
                            'Computer vision solutions',
                            'Recommendation systems',
                            'Automated decision engines',
                        ],
                        'priceRange': '$50,000 - $120,000',
                        'duration': '8-12 weeks',
                    },
                    {
                        'name': 'Process Automation & RPA',
                        'description': 'Intelligent process automation using RPA and AI to streamline operations and reduce costs.',
                        'features': [
                            'Workflow optimization analysis',
                            'Robotic process automation',
                            'Document processing automation',
                            'API integration services',
                            'Performance monitoring systems',
                        ],
                        'priceRange': '$25,000 - $75,000',
                        'duration': '6-10 weeks',
                    },
                    {
                        'name': 'Data Analytics & Business Intelligence',
                        'description': 'Transform raw data into actionable insights with advanced analytics and BI solutions.',
                        'features': [
                            'Data warehouse development',
                            'Real-time dashboard creation',
                            'Advanced analytics models',
                            'Data visualization solutions',
                            'Performance KPI tracking',
                        ],
                        'priceRange': '$30,000 - $80,000',
                        'duration': '6-12 weeks',
                    },
                    {
                        'name': 'AI Training & Change Management',
                        'description': 'Comprehensive training programs and change management to ensure successful AI adoption.',
                        'features': [
                            'AI literacy training programs',
                            'Executive leadership workshops',
                            'Team skill development',
                            'Change management planning',
                            'Ongoing support and coaching',
                        ],
                        'priceRange': '$20,000 - $50,000',
                        'duration': '6-10 weeks',
                    },
                    {
                        'name': 'Custom AI Solutions Development',
                        'description': 'Bespoke AI solution development tailored to your unique business requirements and challenges.',
                        'features': [
                            'Requirements analysis & design',
                            'Custom algorithm development',
                            'Integration with existing systems',
                            'Testing and validation',
                            'Deployment and maintenance',
                        ],
                        'priceRange': '$75,000 - $200,000',
                        'duration': '12-24 weeks',
                    },
                ]
            }
        },
        {
            'page_identifier': 'services',
            'section_name': 'Process Steps',
            'section_key': 'process_steps',
            'enabled': True,
            'order': 4,
            'content': {
                'title': 'How We Deliver Results',
                'subtitle': 'Our Process',
                'description': 'Our proven methodology ensures successful implementation and measurable results for every project.',
                'steps': [
                    {
                        'step': '01',
                        'title': 'Discovery & Analysis',
                        'description': 'We begin with a comprehensive analysis of your current operations, challenges, and goals.',
                    },
                    {
                        'step': '02',
                        'title': 'Strategy Development',
                        'description': 'Our experts develop a customized strategy tailored to your specific needs and market conditions.',
                    },
                    {
                        'step': '03',
                        'title': 'Implementation',
                        'description': 'We work closely with your team to implement solutions with minimal disruption to your operations.',
                    },
                    {
                        'step': '04',
                        'title': 'Optimization & Support',
                        'description': 'Continuous monitoring, optimization, and ongoing support to ensure maximum ROI.',
                    },
                ]
            }
        },
        {
            'page_identifier': 'services',
            'section_name': 'Process',
            'section_key': 'process',
            'enabled': True,
            'order': 5,
            'content': {
                'title': 'How We Deliver Results',
                'subtitle': 'Our Process',
                'description': 'Our proven methodology ensures successful implementation and measurable results for every project.',
                'steps': [
                    {'step': 1, 'title': 'Discovery', 'description': 'Understanding your needs'},
                    {'step': 2, 'title': 'Strategy', 'description': 'Planning the solution'},
                    {'step': 3, 'title': 'Implementation', 'description': 'Executing the plan'},
                    {'step': 4, 'title': 'Support', 'description': 'Ongoing assistance'}
                ]
            }
        },
        {
            'page_identifier': 'services',
            'section_name': 'Why Choose Us',
            'section_key': 'why_choose',
            'enabled': True,
            'order': 4,
            'content': {
                'title': 'Why Choose Resnovate.ai?',
                'description': 'We combine deep industry expertise with cutting-edge AI technology to deliver solutions that drive measurable business results across all sectors.'
            }
        },
        {
            'page_identifier': 'services',
            'section_name': 'Services CTA',
            'section_key': 'cta',
            'enabled': True,
            'order': 5,
            'content': {
                'title': 'Ready to Transform Your Business?',
                'description': 'Get a free consultation to discover which of our services can deliver the biggest impact for your business.'
            }
        },

        # Contact Page sections
        {
            'page_identifier': 'contact',
            'section_name': 'Contact Hero',
            'section_key': 'hero',
            'enabled': True,
            'order': 1,
            'content': {
                'title': 'Get in Touch',
                'description': 'Ready to transform your business with AI? We\'re here to help. Schedule a consultation or reach out with any questions.'
            }
        },
        {
            'page_identifier': 'contact',
            'section_name': 'Contact Methods Header',
            'section_key': 'contact_methods_header',
            'enabled': True,
            'order': 2,
            'content': {
                'subtitle': 'Contact Information',
                'title': 'Multiple Ways to Connect'
            }
        },
        {
            'page_identifier': 'contact',
            'section_name': 'Contact Info',
            'section_key': 'contact_info',
            'enabled': True,
            'order': 3,
            'content': {
                'email': 'info@resnovate.com',
                'phone': '+1 (555) 123-4567',
                'address': '123 Business St, Suite 100',
                'hours': 'Monday - Friday: 9am - 6pm'
            }
        },
        {
            'page_identifier': 'contact',
            'section_name': 'Contact Form Section',
            'section_key': 'form_section_header',
            'enabled': True,
            'order': 4,
            'content': {
                'title': 'Let\'s Start a Conversation',
                'description': 'Choose the best way to connect with our team'
            }
        },
        {
            'page_identifier': 'contact',
            'section_name': 'Office Locations',
            'section_key': 'offices',
            'enabled': True,
            'order': 5,
            'content': {
                'title': 'Our Offices',
                'description': 'We have offices in major cities around the world to serve you better',
                'offices': [
                    {
                        'city': 'San Francisco',
                        'address': '123 Innovation Drive, Suite 100\nSan Francisco, CA 94107',
                        'phone': '+1 (555) 123-4567',
                        'email': 'sf@resnovate.ai'
                    },
                    {
                        'city': 'New York',
                        'address': '456 Tech Plaza, 25th Floor\nNew York, NY 10001',
                        'phone': '+1 (555) 234-5678',
                        'email': 'ny@resnovate.ai'
                    },
                    {
                        'city': 'London',
                        'address': '789 Financial District\nLondon EC2M 1QS, UK',
                        'phone': '+44 20 7123 4567',
                        'email': 'london@resnovate.ai'
                    }
                ]
            }
        },
        {
            'page_identifier': 'contact',
            'section_name': 'FAQs',
            'section_key': 'faqs',
            'enabled': True,
            'order': 6,
            'content': {
                'title': 'Frequently Asked Questions',
                'description': 'Quick answers to common questions about our services and process',
                'faqs': [
                    {
                        'question': 'How quickly can we get started?',
                        'answer': 'We can typically begin our discovery phase within 1-2 weeks of our initial consultation. Implementation timelines vary based on project scope, but most clients see initial results within 4-6 weeks.'
                    },
                    {
                        'question': 'Do you work with small businesses?',
                        'answer': 'Absolutely! We work with businesses of all sizes, from startups to enterprise organizations. Our AI solutions are scalable and can be tailored to fit any budget and business needs.'
                    },
                    {
                        'question': 'What kind of ROI can we expect from AI implementation?',
                        'answer': 'While results vary by client and implementation, our average client sees a 35% improvement in operational efficiency and cost savings within the first year. We provide detailed ROI projections during our consultation process.'
                    },
                    {
                        'question': 'Is training included in your AI implementation services?',
                        'answer': 'Yes, comprehensive training and ongoing support are included with all our AI solutions. We ensure your team is fully equipped to maximize the value of our AI-powered tools and achieve successful digital transformation.'
                    }
                ]
            }
        },
        {
            'page_identifier': 'contact',
            'section_name': 'Emergency Contact',
            'section_key': 'emergency_contact',
            'enabled': True,
            'order': 7,
            'content': {
                'title': 'Need Immediate Assistance?',
                'description': 'For urgent AI implementation support, call our 24/7 technical assistance line',
                'phone': '+1 (555) 123-4567'
            }
        },

        # Case Studies Page sections
        {
            'page_identifier': 'case_studies',
            'section_name': 'Case Studies Header',
            'section_key': 'header',
            'enabled': True,
            'order': 1,
            'content': {
                'title': 'Success Stories',
                'description': 'Discover how our AI-powered solutions have transformed real estate businesses across industries, delivering measurable results and competitive advantages.'
            }
        },
        {
            'page_identifier': 'case_studies',
            'section_name': 'Metrics Section',
            'section_key': 'metrics',
            'enabled': True,
            'order': 2,
            'content': {
                'title': 'Real Impact, Measurable Success',
                'subtitle': 'Proven Results'
            }
        },
        {
            'page_identifier': 'case_studies',
            'section_name': 'Metrics Data',
            'section_key': 'metrics_data',
            'enabled': True,
            'order': 3,
            'content': {
                'metrics': [
                    {
                        'label': 'Average ROI Improvement',
                        'value': '35%',
                    },
                    {
                        'label': 'Projects Completed',
                        'value': '150+',
                    },
                    {
                        'label': 'Client Satisfaction',
                        'value': '98%',
                    },
                ]
            }
        },
        {
            'page_identifier': 'case_studies',
            'section_name': 'Case Studies CTA',
            'section_key': 'cta',
            'enabled': True,
            'order': 3,
            'content': {
                'title': 'Ready to Create Your Own Success Story?',
                'description': 'Join our growing list of successful clients and discover how AI can transform your real estate business.'
            }
        },

        # Research Insights Page sections
        {
            'page_identifier': 'research_insights',
            'section_name': 'Research Insights Header',
            'section_key': 'header',
            'enabled': True,
            'order': 1,
            'content': {
                'title': 'Research Insights',
                'description': 'Stay ahead of the curve with our latest AI research, implementation guides, and industry insights. Discover trends, strategies, and innovations shaping the future of AI-driven business transformation.'
            }
        },
        {
            'page_identifier': 'research_insights',
            'section_name': 'Featured Topics',
            'section_key': 'featured',
            'enabled': True,
            'order': 2,
            'content': {
                'title': 'Explore Key Areas of Innovation',
                'subtitle': 'Featured Topics'
            }
        },
        {
            'page_identifier': 'research_insights',
            'section_name': 'Featured Topics Data',
            'section_key': 'featured_topics_data',
            'enabled': True,
            'order': 3,
            'content': {
                'topics': [
                    {
                        'title': 'AI Implementation Strategy',
                        'description': 'How to successfully implement AI solutions across different business functions and industries.',
                        'posts': 12,
                    },
                    {
                        'title': 'Machine Learning Applications',
                        'description': 'Real-world ML use cases, model deployment, and business impact measurement.',
                        'posts': 8,
                    },
                    {
                        'title': 'Data Analytics & BI',
                        'description': 'Business intelligence solutions, data visualization, and analytics-driven decision making.',
                        'posts': 15,
                    },
                ]
            }
        },
        {
            'page_identifier': 'research_insights',
            'section_name': 'Newsletter CTA',
            'section_key': 'cta',
            'enabled': True,
            'order': 3,
            'content': {
                'title': 'Stay Updated with Latest Insights',
                'description': 'Get our latest research insights and market analysis delivered to your inbox every week.'
            }
        },

        # Resources Page sections
        {
            'page_identifier': 'resources',
            'section_name': 'Resources Header',
            'section_key': 'header',
            'enabled': True,
            'order': 1,
            'content': {
                'title': 'Resources & Tools',
                'description': 'Access our comprehensive library of industry reports, tools, and educational content to accelerate your AI transformation journey and drive business innovation.'
            }
        },
        {
            'page_identifier': 'resources',
            'section_name': 'Resource Library',
            'section_key': 'library',
            'enabled': True,
            'order': 2,
            'content': {
                'title': 'Everything You Need to Succeed',
                'subtitle': 'Resource Library'
            }
        },
        {
            'page_identifier': 'resources',
            'section_name': 'Resource Categories Data',
            'section_key': 'resource_categories_data',
            'enabled': True,
            'order': 3,
            'content': {
                'categories': [
                    {
                        'name': 'Industry Reports',
                        'description': 'Comprehensive analysis of AI adoption trends and market forecasts across industries',
                        'count': 15,
                        'color': 'blue',
                    },
                    {
                        'name': 'White Papers',
                        'description': 'In-depth research on AI implementation strategies and best practices',
                        'count': 12,
                        'color': 'amber',
                    },
                    {
                        'name': 'Webinars',
                        'description': 'Educational sessions from AI experts and industry leaders',
                        'count': 8,
                        'color': 'green',
                    },
                    {
                        'name': 'Case Studies',
                        'description': 'Real-world AI transformation success stories and implementation guides',
                        'count': 25,
                        'color': 'purple',
                    },
                ]
            }
        },
        {
            'page_identifier': 'resources',
            'section_name': 'Featured Resources',
            'section_key': 'featured',
            'enabled': True,
            'order': 4,
            'content': {
                'title': 'Featured Resources',
                'description': 'Our most popular and valuable resources to help you make informed decisions'
            }
        },
        {
            'page_identifier': 'resources',
            'section_name': 'Featured Resources Data',
            'section_key': 'featured_resources_data',
            'enabled': True,
            'order': 5,
            'content': {
                'resources': [
                    {
                        'title': '2024 Enterprise AI Adoption Report',
                        'description': 'Comprehensive analysis of how AI is transforming business operations across different industries.',
                        'type': 'Industry Report',
                        'downloadUrl': '#',
                        'image': '/resources/ai-report-2024.jpg',
                    },
                    {
                        'title': 'AI Implementation Strategy Framework',
                        'description': 'Technical whitepaper on developing and executing successful AI transformation initiatives.',
                        'type': 'White Paper',
                        'downloadUrl': '#',
                        'image': '/resources/ai-framework.jpg',
                    },
                    {
                        'title': 'AI ROI Assessment Tool',
                        'description': 'Interactive calculator to evaluate potential returns on AI investments and implementations.',
                        'type': 'Tool',
                        'downloadUrl': '#',
                        'image': '/resources/ai-roi-calculator.jpg',
                    },
                    {
                        'title': 'Machine Learning Masterclass Series',
                        'description': 'Expert insights on implementing ML solutions for business process optimization.',
                        'type': 'Webinar',
                        'downloadUrl': '#',
                        'image': '/resources/ml-webinar-series.jpg',
                    },
                ]
            }
        },
        {
            'page_identifier': 'resources',
            'section_name': 'Tools & Calculators',
            'section_key': 'tools',
            'enabled': True,
            'order': 6,
            'content': {
                'title': 'Tools & Calculators',
                'description': 'Free tools and templates to help you assess AI readiness and make informed technology decisions'
            }
        },
        {
            'page_identifier': 'resources',
            'section_name': 'Tools & Calculators Data',
            'section_key': 'tools_data',
            'enabled': True,
            'order': 7,
            'content': {
                'tools': [
                    {
                        'name': 'AI Readiness Assessment',
                        'description': 'Comprehensive evaluation toolkit to assess your organization\'s AI readiness',
                        'type': 'Assessment Tool',
                        'size': '2.5 MB',
                    },
                    {
                        'name': 'AI Implementation Checklist',
                        'description': 'Step-by-step guide for planning and executing AI projects',
                        'type': 'PDF Guide',
                        'size': '1.8 MB',
                    },
                    {
                        'name': 'AI ROI Calculator',
                        'description': 'Interactive calculator for estimating AI project returns and benefits',
                        'type': 'Web Tool',
                        'size': 'Online',
                    },
                    {
                        'name': 'Data Quality Auditor',
                        'description': 'AI-powered tool for evaluating data quality and ML-readiness',
                        'type': 'Web Tool',
                        'size': 'Online',
                    },
                ]
            }
        },
        {
            'page_identifier': 'resources',
            'section_name': 'Educational Resources',
            'section_key': 'educational',
            'enabled': True,
            'order': 5,
            'content': {
                'title': 'Educational Resources',
                'subtitle': 'Learn & Grow',
                'description': 'Expand your knowledge with our comprehensive educational content library'
            }
        },
    ]

    created_count = 0
    updated_count = 0

    for section_data in sections_data:
        section, created = PageSection.objects.update_or_create(
            page_identifier=section_data['page_identifier'],
            section_key=section_data['section_key'],
            defaults={
                'section_name': section_data['section_name'],
                'enabled': section_data['enabled'],
                'order': section_data['order'],
                'content': section_data['content']
            }
        )

        if created:
            created_count += 1
            print(f"✓ Created: {section.page_identifier} - {section.section_name}")
        else:
            updated_count += 1
            print(f"✓ Updated: {section.page_identifier} - {section.section_name}")

    print(f"\n✓ Successfully created {created_count} sections")
    print(f"✓ Successfully updated {updated_count} sections")
    print(f"✓ Total sections in database: {PageSection.objects.count()}")

if __name__ == '__main__':
    create_sections()
