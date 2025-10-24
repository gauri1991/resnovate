#!/usr/bin/env python3
"""
Seed script to create CMS content for industry pages
Run this to populate all 7 industry pages with default content
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.content.models import PageSection

def create_industry_sections():
    """Create page sections for all industry pages"""

    industries = {
        'healthcare': {
            'title': 'Healthcare & Life Sciences',
            'subtitle': 'Transforming patient care through innovation',
            'icon': '🏥',
            'overview': 'We help healthcare organizations leverage AI and digital solutions to improve patient outcomes, streamline operations, and ensure regulatory compliance.',
            'benefits': [
                'Enhanced patient care and outcomes',
                'Streamlined clinical workflows',
                'HIPAA-compliant data management',
                'Predictive analytics for better diagnostics'
            ],
            'challenges': [
                {
                    'title': 'Data Privacy & Security',
                    'description': 'Managing sensitive patient data while ensuring HIPAA compliance and cybersecurity'
                },
                {
                    'title': 'Legacy System Integration',
                    'description': 'Integrating modern AI solutions with existing healthcare IT infrastructure'
                },
                {
                    'title': 'Regulatory Compliance',
                    'description': 'Navigating complex healthcare regulations and maintaining compliance'
                }
            ],
            'solutions': [
                {
                    'title': 'AI-Powered Diagnostics',
                    'description': 'Machine learning models for early disease detection and treatment planning'
                },
                {
                    'title': 'Patient Data Analytics',
                    'description': 'Comprehensive analytics platforms for population health management'
                },
                {
                    'title': 'Clinical Workflow Automation',
                    'description': 'Automate administrative tasks to let healthcare professionals focus on patient care'
                },
                {
                    'title': 'Telemedicine Solutions',
                    'description': 'Secure, scalable platforms for remote patient care and monitoring'
                }
            ]
        },
        'financial': {
            'title': 'Financial Services',
            'subtitle': 'Modernizing finance with intelligent solutions',
            'icon': '💰',
            'overview': 'We empower financial institutions with AI-driven solutions for risk management, fraud detection, and customer experience enhancement.',
            'benefits': [
                'Advanced fraud detection and prevention',
                'Real-time risk assessment',
                'Automated compliance monitoring',
                'Personalized customer experiences'
            ],
            'challenges': [
                {
                    'title': 'Fraud Prevention',
                    'description': 'Detecting and preventing sophisticated fraud schemes in real-time'
                },
                {
                    'title': 'Regulatory Compliance',
                    'description': 'Keeping pace with evolving financial regulations and reporting requirements'
                },
                {
                    'title': 'Legacy Infrastructure',
                    'description': 'Modernizing outdated systems while maintaining service continuity'
                }
            ],
            'solutions': [
                {
                    'title': 'AI Fraud Detection',
                    'description': 'Real-time transaction monitoring and anomaly detection systems'
                },
                {
                    'title': 'Risk Analytics Platform',
                    'description': 'Comprehensive risk assessment and portfolio optimization tools'
                },
                {
                    'title': 'Regulatory Compliance Automation',
                    'description': 'Automated compliance monitoring and reporting solutions'
                },
                {
                    'title': 'Customer Intelligence',
                    'description': 'AI-powered personalization for banking and investment services'
                }
            ]
        },
        'manufacturing': {
            'title': 'Manufacturing',
            'subtitle': 'Driving efficiency through smart automation',
            'icon': '🏭',
            'overview': 'We help manufacturers implement Industry 4.0 technologies to optimize production, reduce downtime, and improve quality control.',
            'benefits': [
                'Predictive maintenance reducing downtime',
                'Quality control automation',
                'Supply chain optimization',
                'Real-time production monitoring'
            ],
            'challenges': [
                {
                    'title': 'Equipment Downtime',
                    'description': 'Unexpected failures causing costly production interruptions'
                },
                {
                    'title': 'Quality Consistency',
                    'description': 'Maintaining product quality across high-volume production'
                },
                {
                    'title': 'Supply Chain Disruptions',
                    'description': 'Managing complex global supply chains and inventory'
                }
            ],
            'solutions': [
                {
                    'title': 'Predictive Maintenance',
                    'description': 'AI models predicting equipment failures before they occur'
                },
                {
                    'title': 'Quality Control AI',
                    'description': 'Computer vision systems for automated defect detection'
                },
                {
                    'title': 'Smart Factory Solutions',
                    'description': 'IoT-enabled production monitoring and optimization'
                },
                {
                    'title': 'Supply Chain Analytics',
                    'description': 'AI-driven demand forecasting and inventory optimization'
                }
            ]
        },
        'retail': {
            'title': 'Retail & E-commerce',
            'subtitle': 'Enhancing customer experiences',
            'icon': '🛒',
            'overview': 'We help retailers create personalized shopping experiences, optimize inventory, and drive sales through data-driven insights.',
            'benefits': [
                'Personalized customer experiences',
                'Optimized inventory management',
                'Dynamic pricing strategies',
                'Omnichannel integration'
            ],
            'challenges': [
                {
                    'title': 'Customer Retention',
                    'description': 'Building loyalty in a competitive, price-sensitive market'
                },
                {
                    'title': 'Inventory Management',
                    'description': 'Balancing stock levels across multiple channels and locations'
                },
                {
                    'title': 'Personalization at Scale',
                    'description': 'Delivering individualized experiences to millions of customers'
                }
            ],
            'solutions': [
                {
                    'title': 'AI Recommendation Engine',
                    'description': 'Personalized product recommendations driving conversion'
                },
                {
                    'title': 'Demand Forecasting',
                    'description': 'Predictive analytics for optimal inventory planning'
                },
                {
                    'title': 'Customer Analytics',
                    'description': 'Deep insights into customer behavior and preferences'
                },
                {
                    'title': 'Dynamic Pricing',
                    'description': 'AI-optimized pricing strategies for maximum profitability'
                }
            ]
        },
        'technology': {
            'title': 'Technology & Software',
            'subtitle': 'Accelerating digital transformation',
            'icon': '💻',
            'overview': 'We help technology companies leverage AI to build smarter products, accelerate development, and scale efficiently.',
            'benefits': [
                'Accelerated product development',
                'Enhanced software quality',
                'Intelligent automation',
                'Scalable cloud infrastructure'
            ],
            'challenges': [
                {
                    'title': 'Rapid Innovation',
                    'description': 'Keeping pace with fast-evolving technology landscape'
                },
                {
                    'title': 'Technical Debt',
                    'description': 'Managing legacy code while building new features'
                },
                {
                    'title': 'Talent Acquisition',
                    'description': 'Finding and retaining skilled AI/ML engineers'
                }
            ],
            'solutions': [
                {
                    'title': 'AI-Powered Development',
                    'description': 'Tools and frameworks for faster, smarter coding'
                },
                {
                    'title': 'MLOps Platform',
                    'description': 'End-to-end ML model deployment and monitoring'
                },
                {
                    'title': 'Code Quality AI',
                    'description': 'Automated code review and quality assurance'
                },
                {
                    'title': 'Infrastructure Automation',
                    'description': 'AI-driven DevOps and cloud optimization'
                }
            ]
        },
        'energy': {
            'title': 'Energy & Utilities',
            'subtitle': 'Powering sustainable futures',
            'icon': '⚡',
            'overview': 'We help energy companies optimize operations, improve grid reliability, and accelerate the transition to renewable energy.',
            'benefits': [
                'Optimized energy distribution',
                'Predictive maintenance for infrastructure',
                'Renewable energy integration',
                'Demand forecasting and management'
            ],
            'challenges': [
                {
                    'title': 'Grid Reliability',
                    'description': 'Maintaining stable power delivery amid increasing complexity'
                },
                {
                    'title': 'Renewable Integration',
                    'description': 'Integrating intermittent renewable sources into the grid'
                },
                {
                    'title': 'Infrastructure Aging',
                    'description': 'Managing and modernizing aging energy infrastructure'
                }
            ],
            'solutions': [
                {
                    'title': 'Smart Grid Analytics',
                    'description': 'AI-powered grid monitoring and optimization'
                },
                {
                    'title': 'Demand Forecasting',
                    'description': 'Predictive models for energy demand and pricing'
                },
                {
                    'title': 'Asset Management',
                    'description': 'Predictive maintenance for power generation assets'
                },
                {
                    'title': 'Renewable Optimization',
                    'description': 'AI for renewable energy integration and storage'
                }
            ]
        },
        'government': {
            'title': 'Government & Public Sector',
            'subtitle': 'Modernizing public services',
            'icon': '🏛️',
            'overview': 'We help government agencies improve service delivery, enhance transparency, and make data-driven policy decisions.',
            'benefits': [
                'Enhanced citizen services',
                'Improved operational efficiency',
                'Data-driven policy making',
                'Fraud detection and prevention'
            ],
            'challenges': [
                {
                    'title': 'Legacy Systems',
                    'description': 'Modernizing outdated government IT infrastructure'
                },
                {
                    'title': 'Data Silos',
                    'description': 'Breaking down information barriers across agencies'
                },
                {
                    'title': 'Citizen Expectations',
                    'description': 'Meeting rising expectations for digital services'
                }
            ],
            'solutions': [
                {
                    'title': 'Citizen Service Portal',
                    'description': 'AI-powered platforms for efficient public service delivery'
                },
                {
                    'title': 'Fraud Detection',
                    'description': 'Machine learning for benefits and tax fraud prevention'
                },
                {
                    'title': 'Policy Analytics',
                    'description': 'Data-driven insights for evidence-based policy making'
                },
                {
                    'title': 'Smart City Solutions',
                    'description': 'IoT and AI for urban planning and management'
                }
            ]
        }
    }

    created_count = 0
    updated_count = 0

    for slug, data in industries.items():
        page_id = f'industries-{slug}'

        # Hero Section
        section, created = PageSection.objects.update_or_create(
            page_identifier=page_id,
            section_key='hero',
            defaults={
                'section_name': f'{data["title"]} - Hero',
                'enabled': True,
                'order': 1,
                'content': {
                    'title': data['title'],
                    'subtitle': data['subtitle'],
                    'description': data['overview']
                }
            }
        )
        if created:
            created_count += 1
        else:
            updated_count += 1
        print(f"✓ {'Created' if created else 'Updated'}: {page_id} - Hero")

        # Overview Section
        section, created = PageSection.objects.update_or_create(
            page_identifier=page_id,
            section_key='overview',
            defaults={
                'section_name': f'{data["title"]} - Overview',
                'enabled': True,
                'order': 2,
                'content': {
                    'title': 'Industry Overview',
                    'description': data['overview'],
                    'benefits': data['benefits']
                }
            }
        )
        if created:
            created_count += 1
        else:
            updated_count += 1
        print(f"✓ {'Created' if created else 'Updated'}: {page_id} - Overview")

        # Challenges Section
        section, created = PageSection.objects.update_or_create(
            page_identifier=page_id,
            section_key='challenges',
            defaults={
                'section_name': f'{data["title"]} - Challenges',
                'enabled': True,
                'order': 3,
                'content': {
                    'title': 'Common Challenges',
                    'challenges': data['challenges']
                }
            }
        )
        if created:
            created_count += 1
        else:
            updated_count += 1
        print(f"✓ {'Created' if created else 'Updated'}: {page_id} - Challenges")

        # Solutions Section
        section, created = PageSection.objects.update_or_create(
            page_identifier=page_id,
            section_key='solutions',
            defaults={
                'section_name': f'{data["title"]} - Solutions',
                'enabled': True,
                'order': 4,
                'content': {
                    'title': 'Our Solutions',
                    'solutions': data['solutions']
                }
            }
        )
        if created:
            created_count += 1
        else:
            updated_count += 1
        print(f"✓ {'Created' if created else 'Updated'}: {page_id} - Solutions")

        # CTA Section
        section, created = PageSection.objects.update_or_create(
            page_identifier=page_id,
            section_key='cta',
            defaults={
                'section_name': f'{data["title"]} - CTA',
                'enabled': True,
                'order': 5,
                'content': {
                    'title': f'Ready to Transform {data["title"]}?',
                    'description': f'Let\'s discuss how we can help you achieve your goals in the {data["title"].lower()} sector.'
                }
            }
        )
        if created:
            created_count += 1
        else:
            updated_count += 1
        print(f"✓ {'Created' if created else 'Updated'}: {page_id} - CTA")

        print(f"  Completed {slug} industry page\n")

    print(f"\n{'='*60}")
    print(f"✓ Successfully created {created_count} new sections")
    print(f"✓ Successfully updated {updated_count} existing sections")
    print(f"✓ Total sections in database: {PageSection.objects.count()}")
    print(f"{'='*60}\n")

    print("All 7 industry pages are now ready!")
    print("\nYou can edit them in Django Admin at:")
    print("http://localhost:8000/admin/content/pagesection/")
    print("\nIndustry page identifiers:")
    for slug in industries.keys():
        print(f"  - industries-{slug}")

if __name__ == '__main__':
    print("\n" + "="*60)
    print("  SEEDING INDUSTRY PAGES")
    print("="*60 + "\n")
    create_industry_sections()
