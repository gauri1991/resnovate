# Generated migration to add booking refund policy CMS section

from django.db import migrations


def create_refund_policy_section(apps, schema_editor):
    """Add a booking refund policy section to the contact page"""
    PageSection = apps.get_model('content', 'PageSection')

    # Create the booking settings section
    PageSection.objects.get_or_create(
        page_identifier='contact',
        section_key='booking_settings',
        defaults={
            'section_name': 'Booking Settings',
            'enabled': True,
            'order': 100,  # Place it at the end
            'content': {
                'booking_fee_amount': 10,
                'booking_fee_currency': 'USD',
                'refund_policy_text': 'Fully refundable after consultation call or if canceled 24+ hours in advance',
                'cancellation_hours_required': 24,
            }
        }
    )


def remove_refund_policy_section(apps, schema_editor):
    """Remove the booking refund policy section"""
    PageSection = apps.get_model('content', 'PageSection')

    PageSection.objects.filter(
        page_identifier='contact',
        section_key='booking_settings'
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0003_pagesection'),
    ]

    operations = [
        migrations.RunPython(create_refund_policy_section, remove_refund_policy_section),
    ]
