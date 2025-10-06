from rest_framework import serializers
from .models import Lead, NewsletterSubscriber


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'id', 'first_name', 'last_name', 'name', 'email', 'phone',
            'project_type', 'budget', 'timeline', 'location', 'description',
            'source', 'status', 'priority', 'assigned_to',
            'created_at', 'updated_at', 'last_contact_date', 'next_followup_date',
            'first_contacted_at', 'qualified_at', 'converted_at',
            'utm_source', 'utm_medium', 'utm_campaign',
            'company', 'industry', 'notes',
            # Legacy fields for compatibility
            'message', 'budget_range', 'project_timeline'
        ]
        read_only_fields = ['created_at', 'updated_at', 'name']


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'subscribed_at', 'active']
        read_only_fields = ['subscribed_at']