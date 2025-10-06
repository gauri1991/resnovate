"""
Conversion Optimization Engine Models
Based on Phase 6 of the comprehensive marketing plan
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal


class LandingPage(models.Model):
    """
    Dynamic Landing Page Builder
    Based on Phase 6.1 of the marketing plan
    """
    PAGE_TYPES = [
        ('lead_capture', 'Lead Capture'),
        ('product_showcase', 'Product Showcase'),
        ('consultation_booking', 'Consultation Booking'),
        ('webinar_registration', 'Webinar Registration'),
        ('demo_request', 'Demo Request'),
        ('free_trial', 'Free Trial'),
        ('contact_form', 'Contact Form'),
        ('pricing', 'Pricing Page'),
        ('thank_you', 'Thank You Page'),
        ('404_error', '404 Error Page'),
    ]
    
    OPTIMIZATION_GOALS = [
        ('conversions', 'Maximize Conversions'),
        ('engagement', 'Maximize Engagement'),
        ('form_completion', 'Form Completion Rate'),
        ('time_on_page', 'Time on Page'),
        ('scroll_depth', 'Scroll Depth'),
        ('click_through', 'Click Through Rate'),
        ('email_signup', 'Email Signups'),
        ('demo_requests', 'Demo Requests'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    page_type = models.CharField(max_length=50, choices=PAGE_TYPES)
    optimization_goal = models.CharField(max_length=50, choices=OPTIMIZATION_GOALS)
    
    # Page Content Structure
    page_structure = models.JSONField(default=dict, help_text="Page layout and components")
    content_blocks = models.JSONField(default=list, help_text="Content blocks configuration")
    design_template = models.CharField(max_length=100, blank=True)
    custom_css = models.TextField(blank=True)
    custom_js = models.TextField(blank=True)
    
    # SEO and Meta
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    keywords = models.JSONField(default=list)
    canonical_url = models.URLField(blank=True)
    
    # Forms and CTAs
    primary_cta_text = models.CharField(max_length=100, default="Get Started")
    primary_cta_color = models.CharField(max_length=20, default="#3B82F6")
    secondary_cta_text = models.CharField(max_length=100, blank=True)
    form_fields = models.JSONField(default=list, help_text="Form field configurations")
    
    # Personalization
    personalization_rules = models.JSONField(default=dict, help_text="Dynamic content rules")
    audience_segments = models.JSONField(default=list, help_text="Target audience segments")
    dynamic_content = models.JSONField(default=dict, help_text="Dynamic content variations")
    
    # A/B Testing
    ab_testing_enabled = models.BooleanField(default=False)
    test_variants = models.JSONField(default=list, help_text="A/B test variants")
    
    # Performance Settings
    mobile_optimized = models.BooleanField(default=True)
    page_speed_score = models.IntegerField(default=0, help_text="Page speed score 1-100")
    loading_strategy = models.CharField(max_length=50, default="lazy")
    
    # Analytics and Tracking
    tracking_enabled = models.BooleanField(default=True)
    conversion_tracking = models.JSONField(default=dict, help_text="Conversion tracking setup")
    heatmap_enabled = models.BooleanField(default=False)
    
    # Status and Publishing
    status = models.CharField(max_length=20, choices=[
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
        ('testing', 'A/B Testing'),
    ], default='draft')
    published_at = models.DateTimeField(null=True, blank=True)
    
    # Performance Metrics
    views = models.IntegerField(default=0)
    unique_visitors = models.IntegerField(default=0)
    conversions = models.IntegerField(default=0)
    conversion_rate = models.FloatField(default=0.0)
    bounce_rate = models.FloatField(default=0.0)
    avg_time_on_page = models.DurationField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='landing_pages'
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.page_type})"


class PageVariant(models.Model):
    """
    A/B Test Variants for Landing Pages
    """
    landing_page = models.ForeignKey(LandingPage, on_delete=models.CASCADE, related_name='variants')
    
    # Variant Configuration
    name = models.CharField(max_length=200)
    variant_key = models.CharField(max_length=50)  # A, B, C, etc.
    traffic_allocation = models.FloatField(default=50.0, help_text="Percentage of traffic")
    
    # Content Changes
    content_changes = models.JSONField(default=dict, help_text="What's different in this variant")
    cta_text = models.CharField(max_length=100, blank=True)
    cta_color = models.CharField(max_length=20, blank=True)
    headline = models.CharField(max_length=200, blank=True)
    subheadline = models.CharField(max_length=300, blank=True)
    
    # Performance Metrics
    views = models.IntegerField(default=0)
    conversions = models.IntegerField(default=0)
    conversion_rate = models.FloatField(default=0.0)
    confidence_level = models.FloatField(default=0.0)
    statistical_significance = models.BooleanField(default=False)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_winner = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['landing_page', 'variant_key']
        ordering = ['variant_key']
    
    def __str__(self):
        return f"{self.landing_page.name} - Variant {self.variant_key}"


class ConversionFunnel(models.Model):
    """
    Conversion Funnel Analysis
    Based on Phase 6.3 of the marketing plan
    """
    FUNNEL_TYPES = [
        ('lead_generation', 'Lead Generation'),
        ('sales', 'Sales Funnel'),
        ('onboarding', 'User Onboarding'),
        ('engagement', 'Engagement Funnel'),
        ('retention', 'Retention Funnel'),
        ('upsell', 'Upsell Funnel'),
    ]
    
    name = models.CharField(max_length=200)
    funnel_type = models.CharField(max_length=50, choices=FUNNEL_TYPES)
    description = models.TextField(blank=True)
    
    # Funnel Steps Configuration
    steps = models.JSONField(default=list, help_text="Funnel steps configuration")
    step_names = models.JSONField(default=list, help_text="Human-readable step names")
    
    # Goal and Success Metrics
    primary_goal = models.CharField(max_length=100)
    success_events = models.JSONField(default=list, help_text="Events that indicate success")
    
    # Analysis Settings
    time_window = models.IntegerField(default=30, help_text="Analysis time window in days")
    minimum_sample_size = models.IntegerField(default=100)
    
    # Performance Metrics
    total_entries = models.IntegerField(default=0)
    total_completions = models.IntegerField(default=0)
    completion_rate = models.FloatField(default=0.0)
    avg_time_to_complete = models.DurationField(null=True, blank=True)
    
    # Drop-off Analysis
    biggest_dropoff_step = models.IntegerField(null=True, blank=True)
    dropoff_rate = models.FloatField(default=0.0)
    
    # Optimization Opportunities
    optimization_suggestions = models.JSONField(default=list)
    last_analyzed = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.funnel_type})"


class FunnelStep(models.Model):
    """
    Individual steps in a conversion funnel
    """
    funnel = models.ForeignKey(ConversionFunnel, on_delete=models.CASCADE, related_name='funnel_steps')
    
    # Step Configuration
    step_number = models.IntegerField()
    step_name = models.CharField(max_length=200)
    step_description = models.TextField(blank=True)
    
    # Tracking Configuration
    tracking_event = models.CharField(max_length=100, help_text="Event to track for this step")
    required_parameters = models.JSONField(default=dict)
    
    # Performance Metrics
    entries = models.IntegerField(default=0)
    completions = models.IntegerField(default=0)
    completion_rate = models.FloatField(default=0.0)
    avg_time_on_step = models.DurationField(null=True, blank=True)
    
    # Drop-off Analysis
    dropoff_count = models.IntegerField(default=0)
    dropoff_rate = models.FloatField(default=0.0)
    common_exit_points = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['funnel', 'step_number']
        ordering = ['step_number']
    
    def __str__(self):
        return f"{self.funnel.name} - Step {self.step_number}: {self.step_name}"


class ConversionOptimization(models.Model):
    """
    Conversion Rate Optimization Experiments
    Based on Phase 6.2 of the marketing plan
    """
    EXPERIMENT_TYPES = [
        ('ab_test', 'A/B Test'),
        ('multivariate', 'Multivariate Test'),
        ('split_url', 'Split URL Test'),
        ('redirect', 'Redirect Test'),
        ('personalization', 'Personalization'),
    ]
    
    HYPOTHESIS_STATUS = [
        ('hypothesis', 'Hypothesis'),
        ('testing', 'Testing'),
        ('winner', 'Winner Found'),
        ('inconclusive', 'Inconclusive'),
        ('failed', 'Failed'),
    ]
    
    # Experiment Configuration
    name = models.CharField(max_length=200)
    experiment_type = models.CharField(max_length=50, choices=EXPERIMENT_TYPES)
    hypothesis = models.TextField(help_text="What we're testing and why")
    
    # Target Configuration
    target_page = models.ForeignKey(LandingPage, on_delete=models.CASCADE, related_name='optimizations')
    target_elements = models.JSONField(default=list, help_text="Elements being tested")
    
    # Test Configuration
    variations = models.JSONField(default=list, help_text="Test variations")
    traffic_allocation = models.JSONField(default=dict, help_text="Traffic split")
    
    # Success Metrics
    primary_metric = models.CharField(max_length=100)
    secondary_metrics = models.JSONField(default=list)
    minimum_detectable_effect = models.FloatField(default=5.0, help_text="Minimum % improvement to detect")
    
    # Test Status and Duration
    status = models.CharField(max_length=20, choices=HYPOTHESIS_STATUS, default='hypothesis')
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    duration_days = models.IntegerField(default=14)
    
    # Results
    winning_variation = models.CharField(max_length=50, blank=True)
    confidence_level = models.FloatField(default=0.0)
    improvement_percentage = models.FloatField(default=0.0)
    statistical_significance = models.BooleanField(default=False)
    
    # Implementation
    implemented = models.BooleanField(default=False)
    implementation_date = models.DateTimeField(null=True, blank=True)
    estimated_impact = models.JSONField(default=dict, help_text="Estimated business impact")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='conversion_optimizations'
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.target_page.name}"


class UserJourney(models.Model):
    """
    Customer Journey Tracking and Optimization
    """
    JOURNEY_TYPES = [
        ('awareness', 'Awareness Journey'),
        ('consideration', 'Consideration Journey'),
        ('decision', 'Decision Journey'),
        ('onboarding', 'Onboarding Journey'),
        ('retention', 'Retention Journey'),
        ('advocacy', 'Advocacy Journey'),
    ]
    
    # Journey Configuration
    name = models.CharField(max_length=200)
    journey_type = models.CharField(max_length=50, choices=JOURNEY_TYPES)
    description = models.TextField(blank=True)
    
    # Journey Mapping
    touchpoints = models.JSONField(default=list, help_text="Customer touchpoints")
    stages = models.JSONField(default=list, help_text="Journey stages")
    expected_path = models.JSONField(default=list, help_text="Expected customer path")
    
    # Goals and Success Metrics
    success_criteria = models.JSONField(default=dict)
    conversion_goals = models.JSONField(default=list)
    
    # Analysis Results
    common_paths = models.JSONField(default=list, help_text="Most common user paths")
    friction_points = models.JSONField(default=list, help_text="Identified friction points")
    optimization_opportunities = models.JSONField(default=list)
    
    # Performance Metrics
    completion_rate = models.FloatField(default=0.0)
    avg_journey_time = models.DurationField(null=True, blank=True)
    abandonment_rate = models.FloatField(default=0.0)
    
    # Personalization
    personalization_rules = models.JSONField(default=dict)
    segment_performance = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.journey_type})"


class ExitIntentTrigger(models.Model):
    """
    Exit Intent and Engagement Triggers
    """
    TRIGGER_TYPES = [
        ('exit_intent', 'Exit Intent'),
        ('scroll_depth', 'Scroll Depth'),
        ('time_on_page', 'Time on Page'),
        ('inactivity', 'Inactivity'),
        ('click_pattern', 'Click Pattern'),
        ('form_abandonment', 'Form Abandonment'),
    ]
    
    ACTION_TYPES = [
        ('popup_modal', 'Popup Modal'),
        ('slide_in', 'Slide-in Banner'),
        ('top_bar', 'Top Bar Notification'),
        ('overlay', 'Full Screen Overlay'),
        ('redirect', 'Page Redirect'),
        ('email_capture', 'Email Capture'),
        ('discount_offer', 'Discount Offer'),
        ('content_gate', 'Content Gate'),
    ]
    
    # Trigger Configuration
    name = models.CharField(max_length=200)
    trigger_type = models.CharField(max_length=50, choices=TRIGGER_TYPES)
    trigger_conditions = models.JSONField(default=dict, help_text="Trigger conditions")
    
    # Action Configuration
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    action_config = models.JSONField(default=dict, help_text="Action configuration")
    
    # Content
    headline = models.CharField(max_length=200, blank=True)
    message = models.TextField(blank=True)
    cta_text = models.CharField(max_length=100, blank=True)
    offer_details = models.JSONField(default=dict)
    
    # Targeting
    target_pages = models.ManyToManyField(LandingPage, blank=True)
    audience_segments = models.JSONField(default=list)
    device_targeting = models.JSONField(default=dict)
    
    # Settings
    frequency_cap = models.IntegerField(default=1, help_text="Max times to show per user")
    cooldown_period = models.IntegerField(default=24, help_text="Hours between triggers")
    
    # Performance
    triggers_fired = models.IntegerField(default=0)
    conversions = models.IntegerField(default=0)
    conversion_rate = models.FloatField(default=0.0)
    
    # Status
    active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.trigger_type})"