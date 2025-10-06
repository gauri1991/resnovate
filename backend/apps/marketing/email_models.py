"""
Email Marketing & Nurture Automation Models
Based on Phase 4 of the comprehensive marketing plan
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
import json


class EmailSequence(models.Model):
    """
    Advanced Email Automation Sequences
    Based on Phase 4.1 of the marketing plan
    """
    TRIGGER_EVENTS = [
        ('form_fill', 'Form Submission'),
        ('download', 'Content Download'),
        ('page_visit', 'Page Visit'),
        ('email_open', 'Email Opened'),
        ('link_click', 'Link Clicked'),
        ('score_threshold', 'Lead Score Threshold'),
        ('time_based', 'Time-Based Trigger'),
        ('behavior_based', 'Behavioral Trigger'),
        ('engagement_drop', 'Engagement Drop'),
        ('milestone', 'Customer Milestone'),
    ]
    
    SEQUENCE_STATUS = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    trigger_event = models.CharField(max_length=100, choices=TRIGGER_EVENTS)
    target_segment = models.JSONField(default=dict, help_text="Target audience segment criteria")
    personalization_rules = models.JSONField(default=dict, help_text="Dynamic personalization rules")
    
    # Email sequence configuration
    emails = models.JSONField(default=list, help_text="Array of email configurations in sequence")
    delay_between_emails = models.JSONField(default=dict, help_text="Delay configuration between emails")
    
    # Advanced settings
    send_time_optimization = models.BooleanField(default=True, help_text="AI-optimized send times")
    frequency_cap = models.IntegerField(default=1, help_text="Max emails per day")
    exclude_weekends = models.BooleanField(default=False)
    timezone_aware = models.BooleanField(default=True)
    
    # A/B testing
    ab_testing_enabled = models.BooleanField(default=False)
    test_variants = models.JSONField(default=list)
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=SEQUENCE_STATUS, default='draft')
    active = models.BooleanField(default=True)
    
    # Performance metrics
    total_sent = models.IntegerField(default=0)
    total_opened = models.IntegerField(default=0)
    total_clicked = models.IntegerField(default=0)
    total_conversions = models.IntegerField(default=0)
    total_unsubscribes = models.IntegerField(default=0)
    
    open_rate = models.FloatField(default=0.0)
    click_rate = models.FloatField(default=0.0)
    conversion_rate = models.FloatField(default=0.0)
    unsubscribe_rate = models.FloatField(default=0.0)
    
    # Revenue attribution
    revenue_generated = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='email_sequences'
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_trigger_event_display()}"


class EmailTemplate(models.Model):
    """
    Email Template with Dynamic Content
    Based on Phase 4.1 of the marketing plan
    """
    TEMPLATE_TYPES = [
        ('welcome', 'Welcome Email'),
        ('nurture', 'Nurture Email'),
        ('educational', 'Educational Content'),
        ('promotional', 'Promotional'),
        ('transactional', 'Transactional'),
        ('re_engagement', 'Re-engagement'),
        ('newsletter', 'Newsletter'),
        ('invitation', 'Event Invitation'),
        ('follow_up', 'Follow-up'),
    ]
    
    name = models.CharField(max_length=200)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPES)
    
    # Email content
    subject_line_variants = models.JSONField(default=list, help_text="Multiple subject line variants for testing")
    preheader_text = models.CharField(max_length=200, blank=True)
    from_name = models.CharField(max_length=100, default='Resnovate AI Team')
    from_email = models.EmailField(default='hello@resnovate.ai')
    reply_to = models.EmailField(blank=True)
    
    # Content blocks
    content_blocks = models.JSONField(default=dict, help_text="Modular content blocks")
    html_template = models.TextField(help_text="HTML email template")
    text_template = models.TextField(help_text="Plain text version")
    
    # Personalization
    personalization_fields = models.JSONField(default=list, help_text="Dynamic personalization fields")
    dynamic_content_rules = models.JSONField(default=dict, help_text="Rules for dynamic content")
    
    # Industry/Persona specific
    industry_specific = models.CharField(max_length=100, blank=True)
    persona_specific = models.CharField(max_length=100, blank=True)
    funnel_stage = models.CharField(max_length=50, blank=True)
    
    # AI content generation
    ai_generated = models.BooleanField(default=False)
    ai_prompts = models.JSONField(default=dict, help_text="AI prompts for content generation")
    
    # Performance tracking
    usage_count = models.IntegerField(default=0)
    avg_open_rate = models.FloatField(default=0.0)
    avg_click_rate = models.FloatField(default=0.0)
    avg_conversion_rate = models.FloatField(default=0.0)
    performance_score = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-performance_score', '-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_template_type_display()}"


class BehavioralTrigger(models.Model):
    """
    Behavioral Trigger System
    Based on Phase 4.2 of the marketing plan
    """
    TRIGGER_TYPES = [
        ('page_visit', 'Page Visit'),
        ('time_on_site', 'Time on Site'),
        ('pages_viewed', 'Pages Viewed'),
        ('form_abandonment', 'Form Abandonment'),
        ('cart_abandonment', 'Cart Abandonment'),
        ('email_engagement', 'Email Engagement'),
        ('content_download', 'Content Download'),
        ('video_watch', 'Video Watch'),
        ('webinar_attendance', 'Webinar Attendance'),
        ('score_change', 'Lead Score Change'),
        ('inactivity', 'Period of Inactivity'),
        ('milestone', 'Milestone Reached'),
    ]
    
    ACTION_TYPES = [
        ('send_email', 'Send Email'),
        ('send_sms', 'Send SMS'),
        ('create_task', 'Create Task'),
        ('notify_sales', 'Notify Sales'),
        ('update_score', 'Update Lead Score'),
        ('add_to_list', 'Add to List'),
        ('remove_from_list', 'Remove from List'),
        ('start_sequence', 'Start Email Sequence'),
        ('stop_sequence', 'Stop Email Sequence'),
        ('update_field', 'Update Contact Field'),
        ('webhook', 'Call Webhook'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Trigger configuration
    trigger_type = models.CharField(max_length=50, choices=TRIGGER_TYPES)
    conditions = models.JSONField(help_text="Trigger conditions and rules")
    
    # Action configuration
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    action_config = models.JSONField(help_text="Action configuration details")
    
    # Timing
    delay = models.DurationField(null=True, blank=True, help_text="Delay before triggering action")
    
    # Targeting
    segment_criteria = models.JSONField(default=dict, help_text="Lead segment criteria")
    
    # Email/Content association
    email_template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    email_sequence = models.ForeignKey(EmailSequence, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Priority and limits
    priority = models.IntegerField(default=0, help_text="Higher priority triggers execute first")
    max_triggers_per_lead = models.IntegerField(default=0, help_text="0 for unlimited")
    cooldown_period = models.DurationField(null=True, blank=True, help_text="Minimum time between triggers")
    
    # Status
    active = models.BooleanField(default=True)
    
    # Performance tracking
    times_triggered = models.IntegerField(default=0)
    successful_actions = models.IntegerField(default=0)
    failed_actions = models.IntegerField(default=0)
    conversion_rate = models.FloatField(default=0.0)
    revenue_attributed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', '-times_triggered']
    
    def __str__(self):
        return f"{self.name} - {self.get_trigger_type_display()}"


class EmailEngagement(models.Model):
    """
    Track individual email engagement
    """
    email_sequence = models.ForeignKey(EmailSequence, on_delete=models.CASCADE, related_name='engagements')
    lead = models.ForeignKey('leads.Lead', on_delete=models.CASCADE, related_name='email_engagements')
    email_template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True)
    
    # Engagement tracking
    sent_at = models.DateTimeField(auto_now_add=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    bounced = models.BooleanField(default=False)
    bounce_type = models.CharField(max_length=50, blank=True)
    
    # Click tracking
    clicks_count = models.IntegerField(default=0)
    clicked_links = models.JSONField(default=list)
    
    # Device/Client info
    email_client = models.CharField(max_length=100, blank=True)
    device_type = models.CharField(max_length=50, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    location = models.JSONField(default=dict, blank=True)
    
    # Conversion tracking
    converted = models.BooleanField(default=False)
    conversion_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    conversion_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-sent_at']
        unique_together = ['email_sequence', 'lead', 'email_template', 'sent_at']
    
    def __str__(self):
        return f"{self.lead} - {self.email_sequence.name} - {self.sent_at}"


class EmailAutomationRule(models.Model):
    """
    Advanced automation rules for email campaigns
    """
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Rule conditions
    if_conditions = models.JSONField(help_text="IF conditions for the rule")
    then_actions = models.JSONField(help_text="THEN actions to execute")
    else_actions = models.JSONField(default=dict, help_text="ELSE actions (optional)")
    
    # Rule scope
    applies_to_sequences = models.ManyToManyField(EmailSequence, blank=True)
    applies_to_all = models.BooleanField(default=False)
    
    # Execution settings
    execution_order = models.IntegerField(default=0)
    stop_on_match = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    
    # Performance
    times_evaluated = models.IntegerField(default=0)
    times_matched = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['execution_order', '-created_at']
    
    def __str__(self):
        return self.name


class EmailABTest(models.Model):
    """
    A/B Testing for Email Campaigns
    """
    name = models.CharField(max_length=200)
    email_sequence = models.ForeignKey(EmailSequence, on_delete=models.CASCADE, related_name='ab_tests')
    
    # Test configuration
    test_element = models.CharField(max_length=100, help_text="What element is being tested")
    variant_a = models.JSONField(help_text="Variant A configuration")
    variant_b = models.JSONField(help_text="Variant B configuration")
    variant_c = models.JSONField(null=True, blank=True, help_text="Optional Variant C")
    
    # Traffic allocation
    traffic_split = models.JSONField(default=dict, help_text="Traffic split percentages")
    sample_size = models.IntegerField(help_text="Minimum sample size for significance")
    
    # Test status
    status = models.CharField(max_length=20, default='running')
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    
    # Results
    variant_a_sent = models.IntegerField(default=0)
    variant_a_opens = models.IntegerField(default=0)
    variant_a_clicks = models.IntegerField(default=0)
    variant_a_conversions = models.IntegerField(default=0)
    
    variant_b_sent = models.IntegerField(default=0)
    variant_b_opens = models.IntegerField(default=0)
    variant_b_clicks = models.IntegerField(default=0)
    variant_b_conversions = models.IntegerField(default=0)
    
    variant_c_sent = models.IntegerField(default=0, null=True, blank=True)
    variant_c_opens = models.IntegerField(default=0, null=True, blank=True)
    variant_c_clicks = models.IntegerField(default=0, null=True, blank=True)
    variant_c_conversions = models.IntegerField(default=0, null=True, blank=True)
    
    # Statistical analysis
    confidence_level = models.FloatField(default=0.0)
    statistical_significance = models.BooleanField(default=False)
    winning_variant = models.CharField(max_length=10, blank=True)
    
    class Meta:
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.name} - {self.email_sequence.name}"