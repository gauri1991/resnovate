from django.core.management.base import BaseCommand
from apps.content.models import SiteSettings


class Command(BaseCommand):
    help = 'Seed initial site settings with default content'

    def handle(self, *args, **kwargs):
        # Get or create the singleton instance
        settings, created = SiteSettings.objects.get_or_create(setting_type='global')

        # Navigation items (from Navigation.tsx)
        settings.navigation_items = [
            {'name': 'Home', 'href': '/'},
            {'name': 'About', 'href': '/about'},
            {'name': 'Services', 'href': '/services'},
            {
                'name': 'Industries',
                'href': '/industries',
                'dropdown': [
                    {'name': 'Healthcare & Life Sciences', 'href': '/industries/healthcare'},
                    {'name': 'Financial Services', 'href': '/industries/financial'},
                    {'name': 'Retail & E-commerce', 'href': '/industries/retail'},
                    {'name': 'Manufacturing', 'href': '/industries/manufacturing'},
                    {'name': 'Technology', 'href': '/industries/technology'},
                    {'name': 'Professional Services', 'href': '/industries/professional-services'},
                    {'name': 'Education', 'href': '/industries/education'},
                ]
            },
            {'name': 'Research Insights', 'href': '/research-insights'},
            {'name': 'Case Studies', 'href': '/case-studies'},
            {'name': 'Resources', 'href': '/resources'},
            {'name': 'Contact', 'href': '/contact'},
        ]

        # Footer links (from Footer.tsx)
        settings.footer_links = [
            {'name': 'About', 'href': '/about'},
            {'name': 'Services', 'href': '/services'},
            {'name': 'Case Studies', 'href': '/case-studies'},
            {'name': 'Research Insights', 'href': '/research-insights'},
            {'name': 'Resources', 'href': '/resources'},
            {'name': 'Contact', 'href': '/contact'},
        ]

        # Social links (from Footer.tsx)
        settings.social_links = [
            {
                'name': 'LinkedIn',
                'href': '#',
                'icon': 'linkedin'
            },
            {
                'name': 'Twitter',
                'href': '#',
                'icon': 'twitter'
            },
        ]

        # Footer description (from Footer.tsx)
        settings.footer_description = (
            "Resnovate.ai is your trusted partner in AI transformation. "
            "We help businesses harness the power of artificial intelligence "
            "to drive innovation, efficiency, and growth."
        )

        # Copyright text
        settings.copyright_text = "© 2024 Resnovate.ai. All rights reserved."

        # SEO/Metadata (from layout.tsx)
        settings.site_title = "Resnovate.ai - AI Consulting & Solutions Platform"
        settings.site_description = (
            "Transform your business with AI-driven solutions from Resnovate.ai. "
            "Expert AI consulting, machine learning implementation, and digital transformation services "
            "tailored to your industry needs."
        )
        settings.site_keywords = (
            "AI consulting, machine learning, data analytics, process automation, "
            "digital transformation, AI strategy, ML implementation, business intelligence, "
            "predictive analytics, AI solutions"
        )
        settings.og_image = "https://resnovate.ai/og-image.jpg"
        settings.twitter_handle = "resnovate_ai"

        # Contact info
        settings.contact_email = "contact@resnovate.ai"
        settings.contact_phone = "+1 (555) 123-4567"
        settings.contact_address = "123 Innovation Drive, Tech City, TC 12345"

        settings.save()

        if created:
            self.stdout.write(self.style.SUCCESS('Successfully created initial site settings'))
        else:
            self.stdout.write(self.style.SUCCESS('Successfully updated existing site settings'))
