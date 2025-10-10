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
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'project_type': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
        }

    def create(self, validated_data):
        # Handle simplified form: name -> first_name/last_name, message -> description
        if 'name' in validated_data and not validated_data.get('first_name'):
            name_parts = validated_data['name'].split(' ', 1)
            validated_data['first_name'] = name_parts[0]
            validated_data['last_name'] = name_parts[1] if len(name_parts) > 1 else ''

        if 'message' in validated_data and not validated_data.get('description'):
            validated_data['description'] = validated_data['message']

        # Set project_type to 'general_inquiry' if not provided
        if not validated_data.get('project_type'):
            validated_data['project_type'] = 'General Inquiry'

        return super().create(validated_data)


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'subscribed_at', 'active']
        read_only_fields = ['subscribed_at']