from django.db import models
from django.conf import settings
from django.utils import timezone

# Import email and lead intelligence models
from .email_models import *
from .lead_intelligence_models import *
from .conversion_models import *
from .workflow_models import *
from .analytics_models import *


class MarketingCampaign(models.Model):
    """
    Comprehensive campaign model supporting multi-channel marketing orchestration
    Based on Phase 3 & 7 of the marketing plan
    """
    CAMPAIGN_TYPES = [
        ('content', 'Content Marketing'),
        ('email', 'Email Marketing'),
        ('social', 'Social Media'),
        ('paid_search', 'Paid Search'),
        ('paid_social', 'Paid Social'),
        ('display', 'Display Advertising'),
        ('retargeting', 'Retargeting'),
        ('automation', 'Marketing Automation'),
        ('seo', 'SEO Content'),
        ('webinar', 'Webinar'),
        ('video', 'Video Marketing'),
    ]
    
    CAMPAIGN_STATUS = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    CAMPAIGN_OBJECTIVES = [
        ('awareness', 'Brand Awareness'),
        ('lead_generation', 'Lead Generation'),
        ('conversion', 'Conversion'),
        ('retention', 'Customer Retention'),
        ('upsell', 'Upsell/Cross-sell'),
        ('reactivation', 'Reactivation'),
    ]

    # Basic Campaign Info
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    campaign_type = models.CharField(max_length=50, choices=CAMPAIGN_TYPES)
    objective = models.CharField(max_length=50, choices=CAMPAIGN_OBJECTIVES)
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS, default='draft')
    
    # Targeting & Audience
    target_audience = models.JSONField(default=dict, help_text="Audience targeting criteria")
    target_keywords = models.JSONField(default=list, help_text="Target keywords for SEO/SEM")
    target_personas = models.JSONField(default=list, help_text="Target buyer personas")
    geographic_targeting = models.JSONField(default=dict, help_text="Geographic targeting settings")
    
    # Campaign Timeline
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='created_campaigns'
    )
    
    # Budget & Performance
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    daily_budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    target_cpa = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Target Cost Per Acquisition")
    target_roas = models.FloatField(null=True, blank=True, help_text="Target Return on Ad Spend")
    
    # Channel Configuration
    channels = models.JSONField(default=list, help_text="Marketing channels used in this campaign")
    channel_allocation = models.JSONField(default=dict, help_text="Budget allocation across channels")
    
    # Content & Creative
    content_templates = models.JSONField(default=list, help_text="Content templates used")
    creative_assets = models.JSONField(default=list, help_text="Creative assets and media")
    messaging_variants = models.JSONField(default=list, help_text="Different messaging variants")
    
    # Automation & AI
    ai_optimization_enabled = models.BooleanField(default=False)
    auto_bidding = models.BooleanField(default=False)
    auto_targeting = models.BooleanField(default=False)
    ai_content_generation = models.BooleanField(default=False)
    optimization_goal = models.CharField(max_length=100, blank=True)
    
    # A/B Testing
    ab_testing_enabled = models.BooleanField(default=False)
    ab_test_variants = models.JSONField(default=list, help_text="A/B test variants configuration")
    traffic_split = models.JSONField(default=dict, help_text="Traffic split between variants")
    
    # Attribution & Tracking
    attribution_model = models.CharField(max_length=50, default='last_touch')
    conversion_tracking = models.JSONField(default=dict, help_text="Conversion tracking setup")
    utm_parameters = models.JSONField(default=dict, help_text="UTM tracking parameters")
    
    # Performance Metrics (updated automatically)
    impressions = models.BigIntegerField(default=0)
    clicks = models.IntegerField(default=0)
    leads_generated = models.IntegerField(default=0)
    conversions = models.IntegerField(default=0)
    revenue_generated = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Calculated Performance Metrics
    click_through_rate = models.FloatField(default=0.0)
    conversion_rate = models.FloatField(default=0.0)
    cost_per_click = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_per_lead = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_per_acquisition = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    return_on_ad_spend = models.FloatField(default=0.0)
    
    # AI Scores (updated by ML models)
    ai_performance_score = models.IntegerField(default=0, help_text="AI-calculated performance score (0-100)")
    optimization_suggestions = models.JSONField(default=list, help_text="AI-generated optimization suggestions")
    predicted_performance = models.JSONField(default=dict, help_text="AI-predicted performance metrics")
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.name} ({self.get_campaign_type_display()})"
    
    def calculate_performance_metrics(self):
        """Calculate and update performance metrics"""
        if self.impressions > 0:
            self.click_through_rate = (self.clicks / self.impressions) * 100
        
        if self.clicks > 0:
            self.cost_per_click = float(self.spent / self.clicks) if self.clicks > 0 else 0
        
        if self.leads_generated > 0:
            self.conversion_rate = (self.conversions / self.leads_generated) * 100
            self.cost_per_lead = float(self.spent / self.leads_generated)
        
        if self.conversions > 0:
            self.cost_per_acquisition = float(self.spent / self.conversions)
        
        if self.spent > 0:
            self.return_on_ad_spend = float(self.revenue_generated / self.spent)
        
        self.save()


class ContentTemplate(models.Model):
    """
    Content templates for campaign content generation
    Based on Phase 2 of the marketing plan
    """
    CONTENT_TYPES = [
        ('blog', 'Blog Post'),
        ('email', 'Email'),
        ('social', 'Social Media Post'),
        ('ad_copy', 'Ad Copy'),
        ('landing_page', 'Landing Page'),
        ('case_study', 'Case Study'),
        ('whitepaper', 'Whitepaper'),
        ('webinar', 'Webinar'),
        ('video_script', 'Video Script'),
    ]
    
    CONTENT_STAGES = [
        ('awareness', 'Awareness'),
        ('consideration', 'Consideration'),
        ('decision', 'Decision'),
        ('retention', 'Retention'),
        ('advocacy', 'Advocacy'),
    ]

    name = models.CharField(max_length=200)
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPES)
    industry = models.CharField(max_length=100, blank=True)
    persona = models.CharField(max_length=100, blank=True)
    stage = models.CharField(max_length=50, choices=CONTENT_STAGES)
    
    # Template Content
    template_content = models.TextField()
    ai_prompts = models.JSONField(default=dict, help_text="AI prompts for content generation")
    variables = models.JSONField(default=list, help_text="Template variables for personalization")
    
    # Performance Metrics
    usage_count = models.IntegerField(default=0)
    performance_metrics = models.JSONField(default=dict)
    average_engagement = models.FloatField(default=0.0)
    average_conversion_rate = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-usage_count', '-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_content_type_display()}"


class CampaignOrchestration(models.Model):
    """
    Multi-channel campaign orchestration
    Based on Phase 7.2 of the marketing plan
    """
    name = models.CharField(max_length=200)
    campaign = models.ForeignKey(MarketingCampaign, on_delete=models.CASCADE, related_name='orchestrations')
    
    # Channel Coordination
    channels = models.JSONField(help_text="Channels included in orchestration")
    campaign_timeline = models.JSONField(help_text="Timeline across channels")
    budget_allocation = models.JSONField(help_text="Budget allocation across channels")
    success_metrics = models.JSONField(help_text="Success metrics for each channel")
    
    # Message Consistency
    message_consistency_rules = models.JSONField(default=dict)
    frequency_capping = models.JSONField(default=dict, help_text="Frequency caps across channels")
    cross_channel_attribution = models.CharField(max_length=50, default='linear')
    
    # Orchestration Status
    status = models.CharField(max_length=20, default='planning')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Orchestration: {self.name}"


class SocialMediaCampaign(models.Model):
    """
    Social media specific campaign model
    Based on Phase 3.2 of the marketing plan
    """
    PLATFORMS = [
        ('linkedin', 'LinkedIn'),
        ('twitter', 'Twitter/X'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('youtube', 'YouTube'),
        ('tiktok', 'TikTok'),
    ]
    
    CAMPAIGN_TYPES = [
        ('organic', 'Organic'),
        ('paid', 'Paid'),
        ('sponsored', 'Sponsored Content'),
        ('influencer', 'Influencer'),
    ]

    name = models.CharField(max_length=200)
    campaign = models.ForeignKey(MarketingCampaign, on_delete=models.CASCADE, related_name='social_campaigns')
    platform = models.CharField(max_length=50, choices=PLATFORMS)
    campaign_type = models.CharField(max_length=50, choices=CAMPAIGN_TYPES)
    
    # Targeting
    target_audience = models.JSONField(default=dict)
    content_schedule = models.JSONField(default=dict)
    posting_frequency = models.JSONField(default=dict)
    
    # Budget & Timeline
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    
    # Performance Metrics
    impressions = models.BigIntegerField(default=0)
    reach = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    engagements = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    leads_generated = models.IntegerField(default=0)
    cost_per_lead = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    engagement_rate = models.FloatField(default=0.0)
    conversion_rate = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_platform_display()}"


class PaidCampaign(models.Model):
    """
    Paid advertising campaign model
    Based on Phase 3.3 of the marketing plan
    """
    PLATFORMS = [
        ('google_ads', 'Google Ads'),
        ('linkedin_ads', 'LinkedIn Ads'),
        ('facebook_ads', 'Facebook Ads'),
        ('microsoft_ads', 'Microsoft Ads'),
        ('twitter_ads', 'Twitter Ads'),
        ('youtube_ads', 'YouTube Ads'),
    ]
    
    CAMPAIGN_TYPES = [
        ('search', 'Search'),
        ('display', 'Display'),
        ('video', 'Video'),
        ('shopping', 'Shopping'),
        ('social', 'Social'),
        ('retargeting', 'Retargeting'),
    ]

    name = models.CharField(max_length=200)
    campaign = models.ForeignKey(MarketingCampaign, on_delete=models.CASCADE, related_name='paid_campaigns')
    platform = models.CharField(max_length=50, choices=PLATFORMS)
    campaign_type = models.CharField(max_length=50, choices=CAMPAIGN_TYPES)
    
    # Targeting
    target_audience = models.JSONField(default=dict)
    keywords = models.JSONField(default=list)
    ad_groups = models.JSONField(default=list)
    geographic_targeting = models.JSONField(default=dict)
    demographic_targeting = models.JSONField(default=dict)
    
    # Budget & Bidding
    daily_budget = models.DecimalField(max_digits=10, decimal_places=2)
    total_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    target_cpa = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    target_roas = models.FloatField(null=True, blank=True)
    bid_strategy = models.CharField(max_length=100, default='maximize_conversions')
    
    # Auto-optimization
    auto_bidding = models.BooleanField(default=True)
    auto_keyword_expansion = models.BooleanField(default=True)
    auto_audience_expansion = models.BooleanField(default=False)
    performance_threshold = models.JSONField(default=dict)
    
    # Performance Metrics
    impressions = models.BigIntegerField(default=0)
    clicks = models.IntegerField(default=0)
    conversions = models.IntegerField(default=0)
    spend = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_platform_display()}"


class CampaignPerformanceMetrics(models.Model):
    """
    Daily performance metrics for campaigns
    Based on Phase 9.2 of the marketing plan
    """
    campaign = models.ForeignKey(MarketingCampaign, on_delete=models.CASCADE, related_name='daily_metrics')
    date = models.DateField()
    channel = models.CharField(max_length=100)
    
    # Traffic Metrics
    sessions = models.IntegerField(default=0)
    users = models.IntegerField(default=0)
    page_views = models.IntegerField(default=0)
    bounce_rate = models.FloatField(default=0.0)
    session_duration = models.DurationField(null=True)
    
    # Engagement Metrics
    impressions = models.BigIntegerField(default=0)
    clicks = models.IntegerField(default=0)
    click_through_rate = models.FloatField(default=0.0)
    engagement_rate = models.FloatField(default=0.0)
    
    # Conversion Metrics
    leads_generated = models.IntegerField(default=0)
    mqls = models.IntegerField(default=0)  # Marketing Qualified Leads
    sqls = models.IntegerField(default=0)  # Sales Qualified Leads
    opportunities = models.IntegerField(default=0)
    closed_deals = models.IntegerField(default=0)
    
    # Financial Metrics
    spend = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cost_per_lead = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_per_acquisition = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    return_on_ad_spend = models.FloatField(default=0.0)
    
    # Attribution
    first_touch_attribution = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    last_touch_attribution = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    linear_attribution = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        unique_together = ['campaign', 'date', 'channel']
    
    def __str__(self):
        return f"{self.campaign.name} - {self.date} - {self.channel}"