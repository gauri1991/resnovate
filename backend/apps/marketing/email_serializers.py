from rest_framework import serializers
from .email_models import (
    EmailSequence,
    EmailTemplate,
    BehavioralTrigger,
    EmailEngagement,
    EmailAutomationRule,
    EmailABTest
)


class EmailSequenceSerializer(serializers.ModelSerializer):
    """
    Serializer for Email Sequences
    """
    class Meta:
        model = EmailSequence
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by')
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class EmailSequenceCreateSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for creating email sequences
    """
    class Meta:
        model = EmailSequence
        fields = [
            'name', 'description', 'trigger_event', 'target_segment',
            'personalization_rules', 'emails', 'delay_between_emails',
            'send_time_optimization', 'frequency_cap', 'exclude_weekends',
            'timezone_aware', 'ab_testing_enabled', 'test_variants'
        ]


class EmailTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for Email Templates
    """
    class Meta:
        model = EmailTemplate
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'usage_count')


class EmailTemplateCreateSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for creating email templates
    """
    class Meta:
        model = EmailTemplate
        fields = [
            'name', 'template_type', 'subject_line_variants', 'preheader_text',
            'from_name', 'from_email', 'reply_to', 'content_blocks',
            'html_template', 'text_template', 'personalization_fields',
            'dynamic_content_rules', 'industry_specific', 'persona_specific',
            'funnel_stage', 'ai_generated', 'ai_prompts'
        ]


class BehavioralTriggerSerializer(serializers.ModelSerializer):
    """
    Serializer for Behavioral Triggers
    """
    email_template_name = serializers.CharField(source='email_template.name', read_only=True)
    email_sequence_name = serializers.CharField(source='email_sequence.name', read_only=True)
    
    class Meta:
        model = BehavioralTrigger
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'times_triggered', 
                           'successful_actions', 'failed_actions')


class BehavioralTriggerCreateSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for creating behavioral triggers
    """
    class Meta:
        model = BehavioralTrigger
        fields = [
            'name', 'description', 'trigger_type', 'conditions', 'action_type',
            'action_config', 'delay', 'segment_criteria', 'email_template',
            'email_sequence', 'priority', 'max_triggers_per_lead', 'cooldown_period'
        ]


class EmailEngagementSerializer(serializers.ModelSerializer):
    """
    Serializer for Email Engagement tracking
    """
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    email_sequence_name = serializers.CharField(source='email_sequence.name', read_only=True)
    email_template_name = serializers.CharField(source='email_template.name', read_only=True)
    
    class Meta:
        model = EmailEngagement
        fields = '__all__'
        read_only_fields = ('id', 'sent_at')


class EmailAutomationRuleSerializer(serializers.ModelSerializer):
    """
    Serializer for Email Automation Rules
    """
    applies_to_sequences_names = serializers.SerializerMethodField()
    
    class Meta:
        model = EmailAutomationRule
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'times_evaluated', 'times_matched')
    
    def get_applies_to_sequences_names(self, obj):
        return [seq.name for seq in obj.applies_to_sequences.all()]


class EmailABTestSerializer(serializers.ModelSerializer):
    """
    Serializer for Email A/B Tests
    """
    email_sequence_name = serializers.CharField(source='email_sequence.name', read_only=True)
    
    class Meta:
        model = EmailABTest
        fields = '__all__'
        read_only_fields = ('id', 'started_at', 'ended_at', 'confidence_level', 
                           'statistical_significance', 'winning_variant')


class EmailSequenceSummarySerializer(serializers.Serializer):
    """
    Summary statistics for email sequences
    """
    total_sequences = serializers.IntegerField()
    active_sequences = serializers.IntegerField()
    total_sent = serializers.IntegerField()
    total_opened = serializers.IntegerField()
    total_clicked = serializers.IntegerField()
    total_conversions = serializers.IntegerField()
    average_open_rate = serializers.FloatField()
    average_click_rate = serializers.FloatField()
    average_conversion_rate = serializers.FloatField()


class EmailPerformanceSerializer(serializers.Serializer):
    """
    Performance metrics for email campaigns
    """
    sequence_id = serializers.IntegerField()
    sequence_name = serializers.CharField()
    emails_sent = serializers.IntegerField()
    unique_opens = serializers.IntegerField()
    unique_clicks = serializers.IntegerField()
    conversions = serializers.IntegerField()
    open_rate = serializers.FloatField()
    click_rate = serializers.FloatField()
    conversion_rate = serializers.FloatField()
    revenue_generated = serializers.DecimalField(max_digits=12, decimal_places=2)