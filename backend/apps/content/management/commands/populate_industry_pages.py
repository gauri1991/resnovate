from django.core.management.base import BaseCommand
from apps.content.models import PageSection


class Command(BaseCommand):
    help = 'Populate industry pages with comprehensive CMS content'

    def handle(self, *args, **kwargs):
        industries = [
            {
                'slug': 'healthcare',
                'name': 'Healthcare & Life Sciences',
                'data': self.get_healthcare_data()
            },
            {
                'slug': 'financial',
                'name': 'Financial Services',
                'data': self.get_financial_data()
            },
            {
                'slug': 'manufacturing',
                'name': 'Manufacturing',
                'data': self.get_manufacturing_data()
            },
            {
                'slug': 'retail',
                'name': 'Retail & E-commerce',
                'data': self.get_retail_data()
            },
            {
                'slug': 'technology',
                'name': 'Technology & Software',
                'data': self.get_technology_data()
            },
            {
                'slug': 'energy',
                'name': 'Energy & Utilities',
                'data': self.get_energy_data()
            },
            {
                'slug': 'government',
                'name': 'Government & Public Sector',
                'data': self.get_government_data()
            },
        ]

        for industry in industries:
            self.stdout.write(f"\nPopulating {industry['name']}...")
            page_id = f"industries-{industry['slug']}"

            for section_key, section_data in industry['data'].items():
                obj, created = PageSection.objects.update_or_create(
                    page_identifier=page_id,
                    section_key=section_key,
                    defaults={
                        'section_name': section_data['section_name'],
                        'enabled': True,
                        'order': section_data.get('order', 0),
                        'content': section_data['content']
                    }
                )
                action = "Created" if created else "Updated"
                self.stdout.write(f"  {action}: {section_data['section_name']}")

        self.stdout.write(self.style.SUCCESS('\n✓ Successfully populated all industry pages!'))

    def get_healthcare_data(self):
        return {
            'hero': {
                'section_name': 'Hero Section',
                'order': 1,
                'content': {
                    'title': 'Healthcare & Life Sciences',
                    'subtitle': 'Transforming patient care through innovation',
                    'description': 'Revolutionize healthcare delivery with AI-powered solutions that improve patient outcomes, streamline operations, and advance medical research.'
                }
            },
            'overview': {
                'section_name': 'Overview Section',
                'order': 2,
                'content': {
                    'title': 'Industry Overview',
                    'description': 'Healthcare organizations face unprecedented challenges in delivering quality care while managing costs and regulatory compliance. Our AI-powered solutions help you modernize operations, improve patient outcomes, and drive medical innovation.',
                    'benefits': [
                        'Enhanced patient care and clinical outcomes',
                        'Streamlined administrative and operational workflows',
                        'Advanced medical research and drug discovery',
                        'Improved regulatory compliance and data security',
                        'Reduced operational costs and resource optimization'
                    ]
                }
            },
            'challenges': {
                'section_name': 'Challenges Section',
                'order': 3,
                'content': {
                    'title': 'Healthcare Industry Challenges',
                    'challenges': [
                        {
                            'title': 'Data Management',
                            'description': 'Managing vast amounts of patient data while ensuring privacy, security, and HIPAA compliance'
                        },
                        {
                            'title': 'Operational Efficiency',
                            'description': 'Reducing administrative burden and optimizing workflows to allow more time for patient care'
                        },
                        {
                            'title': 'Diagnostic Accuracy',
                            'description': 'Improving diagnostic accuracy and speed while managing the complexity of modern medicine'
                        }
                    ]
                }
            },
            'solutions': {
                'section_name': 'Solutions Section',
                'order': 4,
                'content': {
                    'title': 'Healthcare Solutions',
                    'description': 'Comprehensive AI-powered solutions designed specifically for healthcare organizations',
                    'solutions': [
                        {
                            'title': 'Clinical Decision Support',
                            'description': 'AI-powered diagnostic assistance and treatment recommendations to improve patient outcomes',
                            'icon': 'lightbulb'
                        },
                        {
                            'title': 'Operational Automation',
                            'description': 'Streamline administrative tasks, scheduling, and resource allocation to reduce costs',
                            'icon': 'cog'
                        },
                        {
                            'title': 'Medical Research & Analytics',
                            'description': 'Advanced analytics and AI for drug discovery, clinical trials, and research acceleration',
                            'icon': 'chart'
                        },
                        {
                            'title': 'Patient Engagement',
                            'description': 'Personalized patient communication and remote monitoring solutions',
                            'icon': 'users'
                        }
                    ]
                }
            },
            'stats': {
                'section_name': 'Statistics Section',
                'order': 5,
                'content': {
                    'subtitle': 'Healthcare Impact',
                    'title': 'Proven Healthcare Results',
                    'stats': [
                        {'label': 'Improved Diagnostic Accuracy', 'value': '95%'},
                        {'label': 'Reduction in Admin Time', 'value': '60%'},
                        {'label': 'Patient Satisfaction Increase', 'value': '40%'},
                        {'label': 'Operational Cost Savings', 'value': '$2M+'}
                    ]
                }
            },
            'case_studies': {
                'section_name': 'Case Studies Section',
                'order': 6,
                'content': {
                    'title': 'Healthcare Success Stories',
                    'description': 'See how we\'ve helped healthcare organizations transform their operations',
                    'stories': [
                        {
                            'tag': 'Patient Care',
                            'title': 'AI-Powered Diagnostics for Regional Hospital',
                            'description': 'Implemented advanced AI diagnostic tools that improved accuracy and reduced diagnosis time for complex cases.',
                            'results': [
                                '30% faster diagnosis time',
                                '25% improvement in diagnostic accuracy',
                                '$1.2M annual cost savings'
                            ],
                            'link': '/case-studies/healthcare-ai-implementation-seattle-medical'
                        },
                        {
                            'tag': 'Operations',
                            'title': 'Workflow Automation for Medical Center',
                            'description': 'Automated administrative workflows and patient scheduling, freeing up staff for direct patient care.',
                            'results': [
                                '60% reduction in administrative time',
                                '45% improvement in scheduling efficiency',
                                '40% increase in patient satisfaction'
                            ]
                        }
                    ]
                }
            },
            'cta': {
                'section_name': 'CTA Section',
                'order': 7,
                'content': {
                    'title': 'Transform Your Healthcare Operations',
                    'description': 'Discover how our AI solutions can improve patient care, reduce costs, and drive innovation in your organization.'
                }
            }
        }

    def get_financial_data(self):
        return {
            'hero': {
                'section_name': 'Hero Section',
                'order': 1,
                'content': {
                    'title': 'Financial Services',
                    'subtitle': 'Modernizing finance with intelligent solutions',
                    'description': 'Transform financial operations with cutting-edge AI solutions for fraud detection, risk management, and customer experience enhancement.'
                }
            },
            'overview': {
                'section_name': 'Overview Section',
                'order': 2,
                'content': {
                    'title': 'Industry Overview',
                    'description': 'Financial institutions must balance innovation with security, compliance, and customer satisfaction. Our AI solutions help you detect fraud, manage risk, and deliver exceptional customer experiences.',
                    'benefits': [
                        'Advanced fraud detection and prevention',
                        'Real-time risk assessment and management',
                        'Personalized customer experiences',
                        'Automated compliance and regulatory reporting',
                        'Improved operational efficiency and cost reduction'
                    ]
                }
            },
            'challenges': {
                'section_name': 'Challenges Section',
                'order': 3,
                'content': {
                    'title': 'Financial Services Challenges',
                    'challenges': [
                        {
                            'title': 'Fraud Prevention',
                            'description': 'Detecting and preventing sophisticated fraud attacks in real-time across multiple channels'
                        },
                        {
                            'title': 'Regulatory Compliance',
                            'description': 'Maintaining compliance with constantly evolving financial regulations and reporting requirements'
                        },
                        {
                            'title': 'Customer Experience',
                            'description': 'Delivering personalized, seamless experiences while maintaining security and trust'
                        }
                    ]
                }
            },
            'solutions': {
                'section_name': 'Solutions Section',
                'order': 4,
                'content': {
                    'title': 'Financial Solutions',
                    'description': 'AI-powered solutions tailored for modern financial institutions',
                    'solutions': [
                        {
                            'title': 'Fraud Detection & Prevention',
                            'description': 'Machine learning models that identify suspicious patterns and prevent fraud in real-time',
                            'icon': 'shield'
                        },
                        {
                            'title': 'Risk Management',
                            'description': 'Advanced analytics for credit risk assessment, portfolio management, and stress testing',
                            'icon': 'chart'
                        },
                        {
                            'title': 'Process Automation',
                            'description': 'Automated loan processing, KYC verification, and compliance reporting',
                            'icon': 'cog'
                        },
                        {
                            'title': 'Customer Intelligence',
                            'description': 'AI-driven customer insights for personalized product recommendations and services',
                            'icon': 'lightbulb'
                        }
                    ]
                }
            },
            'stats': {
                'section_name': 'Statistics Section',
                'order': 5,
                'content': {
                    'subtitle': 'Financial Impact',
                    'title': 'Proven Financial Results',
                    'stats': [
                        {'label': 'Fraud Detection Rate', 'value': '99.7%'},
                        {'label': 'Processing Time Reduction', 'value': '75%'},
                        {'label': 'False Positive Reduction', 'value': '80%'},
                        {'label': 'Annual Savings', 'value': '$5M+'}
                    ]
                }
            },
            'case_studies': {
                'section_name': 'Case Studies Section',
                'order': 6,
                'content': {
                    'title': 'Financial Success Stories',
                    'description': 'Real-world results from our financial services clients',
                    'stories': [
                        {
                            'tag': 'Fraud Detection',
                            'title': 'ML-Powered Fraud Detection System',
                            'description': 'Deployed advanced machine learning system that dramatically improved fraud detection while reducing false positives.',
                            'results': [
                                '99.7% fraud detection accuracy',
                                '80% reduction in false positives',
                                '$3M+ prevented fraud annually'
                            ],
                            'link': '/case-studies/financial-services-ml-fraud-detection'
                        },
                        {
                            'tag': 'Automation',
                            'title': 'Loan Processing Automation',
                            'description': 'Automated loan application processing and risk assessment for faster approvals.',
                            'results': [
                                '75% faster processing time',
                                '50% reduction in operational costs',
                                '35% increase in customer satisfaction'
                            ]
                        }
                    ]
                }
            },
            'cta': {
                'section_name': 'CTA Section',
                'order': 7,
                'content': {
                    'title': 'Modernize Your Financial Services',
                    'description': 'Protect your customers, reduce risk, and deliver exceptional experiences with our AI solutions.'
                }
            }
        }

    def get_manufacturing_data(self):
        return {
            'hero': {
                'section_name': 'Hero Section',
                'order': 1,
                'content': {
                    'title': 'Manufacturing',
                    'subtitle': 'Driving efficiency through smart automation',
                    'description': 'Optimize production processes, reduce downtime, and enhance quality control with intelligent manufacturing solutions.'
                }
            },
            'overview': {
                'section_name': 'Overview Section',
                'order': 2,
                'content': {
                    'title': 'Industry Overview',
                    'description': 'Modern manufacturing requires precision, efficiency, and adaptability. Our AI solutions optimize production, predict maintenance needs, and ensure quality control.',
                    'benefits': [
                        'Predictive maintenance to reduce downtime',
                        'Optimized production scheduling and resource allocation',
                        'Enhanced quality control and defect detection',
                        'Supply chain optimization and inventory management',
                        'Energy efficiency and sustainability improvements'
                    ]
                }
            },
            'challenges': {
                'section_name': 'Challenges Section',
                'order': 3,
                'content': {
                    'title': 'Manufacturing Challenges',
                    'challenges': [
                        {
                            'title': 'Equipment Downtime',
                            'description': 'Unexpected equipment failures leading to costly production interruptions'
                        },
                        {
                            'title': 'Quality Consistency',
                            'description': 'Maintaining consistent product quality across high-volume production'
                        },
                        {
                            'title': 'Supply Chain Complexity',
                            'description': 'Managing complex global supply chains and inventory optimization'
                        }
                    ]
                }
            },
            'solutions': {
                'section_name': 'Solutions Section',
                'order': 4,
                'content': {
                    'title': 'Manufacturing Solutions',
                    'description': 'Intelligent automation and analytics for modern manufacturing',
                    'solutions': [
                        {
                            'title': 'Predictive Maintenance',
                            'description': 'AI models that predict equipment failures before they occur, minimizing downtime',
                            'icon': 'cog'
                        },
                        {
                            'title': 'Quality Control AI',
                            'description': 'Computer vision and machine learning for automated defect detection',
                            'icon': 'shield'
                        },
                        {
                            'title': 'Production Optimization',
                            'description': 'Intelligent scheduling and resource allocation to maximize efficiency',
                            'icon': 'chart'
                        },
                        {
                            'title': 'Supply Chain Intelligence',
                            'description': 'Predictive analytics for inventory management and supply chain optimization',
                            'icon': 'lightbulb'
                        }
                    ]
                }
            },
            'stats': {
                'section_name': 'Statistics Section',
                'order': 5,
                'content': {
                    'subtitle': 'Manufacturing Impact',
                    'title': 'Proven Manufacturing Results',
                    'stats': [
                        {'label': 'Downtime Reduction', 'value': '45%'},
                        {'label': 'Quality Improvement', 'value': '35%'},
                        {'label': 'Production Efficiency', 'value': '+28%'},
                        {'label': 'Cost Savings', 'value': '$3.5M+'}
                    ]
                }
            },
            'cta': {
                'section_name': 'CTA Section',
                'order': 7,
                'content': {
                    'title': 'Optimize Your Manufacturing Operations',
                    'description': 'Reduce downtime, improve quality, and boost efficiency with our smart manufacturing solutions.'
                }
            }
        }

    def get_retail_data(self):
        return {
            'hero': {
                'section_name': 'Hero Section',
                'order': 1,
                'content': {
                    'title': 'Retail & E-commerce',
                    'subtitle': 'Enhancing customer experiences',
                    'description': 'Create personalized shopping experiences, optimize inventory, and boost sales with AI-driven retail solutions.'
                }
            },
            'overview': {
                'section_name': 'Overview Section',
                'order': 2,
                'content': {
                    'title': 'Industry Overview',
                    'description': 'Retail is evolving rapidly with changing consumer expectations. Our AI solutions help you deliver personalized experiences, optimize inventory, and increase conversions.',
                    'benefits': [
                        'Personalized product recommendations',
                        'Dynamic pricing and promotion optimization',
                        'Intelligent inventory and demand forecasting',
                        'Enhanced customer service with AI chatbots',
                        'Omnichannel experience optimization'
                    ]
                }
            },
            'challenges': {
                'section_name': 'Challenges Section',
                'order': 3,
                'content': {
                    'title': 'Retail Challenges',
                    'challenges': [
                        {
                            'title': 'Customer Personalization',
                            'description': 'Delivering personalized experiences at scale across all touchpoints'
                        },
                        {
                            'title': 'Inventory Management',
                            'description': 'Balancing inventory levels with demand forecasting and minimizing waste'
                        },
                        {
                            'title': 'Omnichannel Integration',
                            'description': 'Creating seamless experiences across online and physical stores'
                        }
                    ]
                }
            },
            'solutions': {
                'section_name': 'Solutions Section',
                'order': 4,
                'content': {
                    'title': 'Retail Solutions',
                    'description': 'AI-powered tools to transform your retail operations',
                    'solutions': [
                        {
                            'title': 'Personalization Engine',
                            'description': 'AI-driven product recommendations and personalized marketing campaigns',
                            'icon': 'lightbulb'
                        },
                        {
                            'title': 'Demand Forecasting',
                            'description': 'Predictive analytics for accurate inventory planning and optimization',
                            'icon': 'chart'
                        },
                        {
                            'title': 'Dynamic Pricing',
                            'description': 'Intelligent pricing strategies based on demand, competition, and market trends',
                            'icon': 'cog'
                        },
                        {
                            'title': 'Customer Service AI',
                            'description': 'Conversational AI and chatbots for 24/7 customer support',
                            'icon': 'users'
                        }
                    ]
                }
            },
            'cta': {
                'section_name': 'CTA Section',
                'order': 7,
                'content': {
                    'title': 'Transform Your Retail Experience',
                    'description': 'Delight customers, optimize operations, and increase revenue with our AI retail solutions.'
                }
            }
        }

    def get_technology_data(self):
        return {
            'hero': {
                'section_name': 'Hero Section',
                'order': 1,
                'content': {
                    'title': 'Technology & Software',
                    'subtitle': 'Accelerating digital transformation',
                    'description': 'Empower your technology initiatives with advanced AI integration, automation, and innovative software solutions.'
                }
            },
            'overview': {
                'section_name': 'Overview Section',
                'order': 2,
                'content': {
                    'title': 'Industry Overview',
                    'description': 'Technology companies need to stay ahead of innovation. We help you integrate AI into your products, automate development processes, and scale your operations.',
                    'benefits': [
                        'AI-powered product features and capabilities',
                        'Automated software development and testing',
                        'Intelligent DevOps and infrastructure management',
                        'Advanced analytics and business intelligence',
                        'Scalable cloud-native architectures'
                    ]
                }
            },
            'solutions': {
                'section_name': 'Solutions Section',
                'order': 4,
                'content': {
                    'title': 'Technology Solutions',
                    'description': 'Cutting-edge solutions for modern technology companies',
                    'solutions': [
                        {
                            'title': 'AI Product Integration',
                            'description': 'Embed AI capabilities into your software products and services',
                            'icon': 'rocket'
                        },
                        {
                            'title': 'DevOps Automation',
                            'description': 'Intelligent CI/CD pipelines and infrastructure automation',
                            'icon': 'cog'
                        },
                        {
                            'title': 'Data Platform Development',
                            'description': 'Build scalable data platforms and analytics solutions',
                            'icon': 'chart'
                        },
                        {
                            'title': 'Innovation Consulting',
                            'description': 'Strategic guidance on emerging technologies and innovation',
                            'icon': 'lightbulb'
                        }
                    ]
                }
            },
            'cta': {
                'section_name': 'CTA Section',
                'order': 7,
                'content': {
                    'title': 'Accelerate Your Tech Innovation',
                    'description': 'Partner with us to integrate AI, automate processes, and build next-generation technology solutions.'
                }
            }
        }

    def get_energy_data(self):
        return {
            'hero': {
                'section_name': 'Hero Section',
                'order': 1,
                'content': {
                    'title': 'Energy & Utilities',
                    'subtitle': 'Powering sustainable futures',
                    'description': 'Drive sustainability and operational efficiency with smart energy management and predictive analytics solutions.'
                }
            },
            'overview': {
                'section_name': 'Overview Section',
                'order': 2,
                'content': {
                    'title': 'Industry Overview',
                    'description': 'Energy companies face pressure to increase efficiency while transitioning to sustainable sources. Our AI solutions optimize operations, predict maintenance, and support renewable integration.',
                    'benefits': [
                        'Predictive maintenance for infrastructure',
                        'Grid optimization and demand forecasting',
                        'Renewable energy integration and management',
                        'Energy consumption optimization',
                        'Regulatory compliance and reporting automation'
                    ]
                }
            },
            'solutions': {
                'section_name': 'Solutions Section',
                'order': 4,
                'content': {
                    'title': 'Energy Solutions',
                    'description': 'Smart solutions for modern energy challenges',
                    'solutions': [
                        {
                            'title': 'Grid Management',
                            'description': 'AI-powered grid optimization and load balancing for reliable energy distribution',
                            'icon': 'cog'
                        },
                        {
                            'title': 'Demand Forecasting',
                            'description': 'Accurate energy demand prediction for efficient resource planning',
                            'icon': 'chart'
                        },
                        {
                            'title': 'Asset Management',
                            'description': 'Predictive maintenance for energy infrastructure and equipment',
                            'icon': 'shield'
                        },
                        {
                            'title': 'Sustainability Analytics',
                            'description': 'Track and optimize environmental impact and carbon emissions',
                            'icon': 'lightbulb'
                        }
                    ]
                }
            },
            'cta': {
                'section_name': 'CTA Section',
                'order': 7,
                'content': {
                    'title': 'Power Your Energy Transformation',
                    'description': 'Optimize operations, reduce costs, and drive sustainability with our energy solutions.'
                }
            }
        }

    def get_government_data(self):
        return {
            'hero': {
                'section_name': 'Hero Section',
                'order': 1,
                'content': {
                    'title': 'Government & Public Sector',
                    'subtitle': 'Modernizing public services',
                    'description': 'Enhance citizen services, improve operational efficiency, and enable data-driven policy making with modern technology solutions.'
                }
            },
            'overview': {
                'section_name': 'Overview Section',
                'order': 2,
                'content': {
                    'title': 'Industry Overview',
                    'description': 'Government agencies need to deliver efficient services while managing budgets and ensuring transparency. Our solutions modernize operations, improve citizen engagement, and enable data-driven decisions.',
                    'benefits': [
                        'Enhanced citizen service delivery',
                        'Improved operational efficiency and cost reduction',
                        'Data-driven policy and decision making',
                        'Transparent and accountable processes',
                        'Security and compliance assurance'
                    ]
                }
            },
            'solutions': {
                'section_name': 'Solutions Section',
                'order': 4,
                'content': {
                    'title': 'Government Solutions',
                    'description': 'Modern technology for public sector transformation',
                    'solutions': [
                        {
                            'title': 'Citizen Services Portal',
                            'description': 'Digital platforms for efficient, accessible public service delivery',
                            'icon': 'users'
                        },
                        {
                            'title': 'Process Automation',
                            'description': 'Streamline administrative tasks and reduce bureaucratic overhead',
                            'icon': 'cog'
                        },
                        {
                            'title': 'Policy Analytics',
                            'description': 'Data analytics and insights to inform evidence-based policy making',
                            'icon': 'chart'
                        },
                        {
                            'title': 'Security & Compliance',
                            'description': 'Robust security frameworks and regulatory compliance solutions',
                            'icon': 'shield'
                        }
                    ]
                }
            },
            'cta': {
                'section_name': 'CTA Section',
                'order': 7,
                'content': {
                    'title': 'Modernize Your Public Services',
                    'description': 'Improve citizen satisfaction, reduce costs, and enable better governance with our solutions.'
                }
            }
        }
