"""
Lead Intelligence & Qualification Models
Based on Phase 5 of the comprehensive marketing plan
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal


class LeadScoringModel(models.Model):
    """
    AI-Powered Lead Qualification Model
    Based on Phase 5.1 of the marketing plan
    """
    MODEL_TYPES = [
        ('classification', 'Classification'),
        ('regression', 'Regression'),
        ('clustering', 'Clustering'),
        ('ensemble', 'Ensemble'),
        ('neural_network', 'Neural Network'),
    ]
    
    SCORING_METHODS = [
        ('predictive', 'Predictive Scoring'),
        ('rule_based', 'Rule-Based'),
        ('hybrid', 'Hybrid (AI + Rules)'),
        ('behavioral', 'Behavioral'),
        ('demographic', 'Demographic'),
        ('intent', 'Intent-Based'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    model_type = models.CharField(max_length=50, choices=MODEL_TYPES)
    scoring_method = models.CharField(max_length=50, choices=SCORING_METHODS)
    
    # Model configuration
    features = models.JSONField(help_text="List of features used in the model")
    feature_weights = models.JSONField(default=dict, help_text="Weight of each feature")
    model_parameters = models.JSONField(default=dict, help_text="Model hyperparameters")
    
    # Scoring ranges
    score_range_min = models.IntegerField(default=0)
    score_range_max = models.IntegerField(default=100)
    
    # Thresholds for qualification
    mql_threshold = models.IntegerField(default=40, help_text="Marketing Qualified Lead threshold")
    sql_threshold = models.IntegerField(default=70, help_text="Sales Qualified Lead threshold")
    hot_lead_threshold = models.IntegerField(default=85, help_text="Hot lead threshold")
    
    # Model performance
    training_data_size = models.IntegerField(default=0)
    accuracy_score = models.FloatField(default=0.0)
    precision_score = models.FloatField(default=0.0)
    recall_score = models.FloatField(default=0.0)
    f1_score = models.FloatField(default=0.0)
    auc_roc = models.FloatField(default=0.0)
    
    # Model versioning
    version = models.CharField(max_length=20, default='1.0')
    is_active = models.BooleanField(default=True)
    last_trained = models.DateTimeField(null=True, blank=True)
    next_training_scheduled = models.DateTimeField(null=True, blank=True)
    
    # Usage tracking
    leads_scored = models.IntegerField(default=0)
    accurate_predictions = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_active', '-version', '-created_at']
    
    def __str__(self):
        return f"{self.name} v{self.version}"


class LeadScoringRule(models.Model):
    """
    Individual lead scoring rules
    """
    RULE_CATEGORIES = [
        ('demographic', 'Demographic'),
        ('firmographic', 'Firmographic'),
        ('behavioral', 'Behavioral'),
        ('engagement', 'Engagement'),
        ('intent', 'Intent'),
        ('technographic', 'Technographic'),
        ('social', 'Social'),
        ('custom', 'Custom'),
    ]
    
    OPERATORS = [
        ('equals', 'Equals'),
        ('not_equals', 'Not Equals'),
        ('contains', 'Contains'),
        ('not_contains', 'Does Not Contain'),
        ('greater_than', 'Greater Than'),
        ('less_than', 'Less Than'),
        ('between', 'Between'),
        ('in_list', 'In List'),
        ('not_in_list', 'Not In List'),
    ]
    
    scoring_model = models.ForeignKey(LeadScoringModel, on_delete=models.CASCADE, related_name='rules')
    
    # Rule definition
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=RULE_CATEGORIES)
    criteria_field = models.CharField(max_length=100, help_text="Field to evaluate")
    operator = models.CharField(max_length=20, choices=OPERATORS)
    criteria_value = models.JSONField(help_text="Value(s) to compare against")
    
    # Scoring
    points = models.IntegerField(help_text="Points to add/subtract")
    is_negative = models.BooleanField(default=False, help_text="Subtract points instead of add")
    
    # Advanced settings
    applies_once = models.BooleanField(default=False, help_text="Apply only once per lead")
    expiry_days = models.IntegerField(null=True, blank=True, help_text="Points expire after X days")
    
    # Rule metadata
    priority = models.IntegerField(default=0, help_text="Higher priority rules evaluated first")
    enabled = models.BooleanField(default=True)
    
    # Performance tracking
    times_applied = models.IntegerField(default=0)
    leads_affected = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', 'category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.points} points)"


class CompanyEnrichment(models.Model):
    """
    Company data enrichment for B2B leads
    Based on Phase 5.1 of the marketing plan
    """
    lead = models.OneToOneField('leads.Lead', on_delete=models.CASCADE, related_name='company_data')
    
    # Company basics
    company_name = models.CharField(max_length=200)
    domain = models.URLField()
    company_linkedin = models.URLField(blank=True)
    company_twitter = models.CharField(max_length=100, blank=True)
    
    # Firmographics
    industry = models.CharField(max_length=100)
    sub_industry = models.CharField(max_length=100, blank=True)
    employee_count = models.IntegerField(null=True, blank=True)
    employee_range = models.CharField(max_length=50, blank=True)
    annual_revenue = models.BigIntegerField(null=True, blank=True)
    revenue_range = models.CharField(max_length=50, blank=True)
    
    # Company details
    founded_year = models.IntegerField(null=True, blank=True)
    headquarters_location = models.JSONField(default=dict)
    office_locations = models.JSONField(default=list)
    company_type = models.CharField(max_length=50, blank=True)  # Public, Private, Non-profit
    
    # Technographics
    technologies_used = models.JSONField(default=list, help_text="Technologies the company uses")
    tech_categories = models.JSONField(default=list, help_text="Categories of tech used")
    tech_spend_estimate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Business intelligence
    funding_stage = models.CharField(max_length=50, blank=True)
    total_funding = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    latest_funding_date = models.DateField(null=True, blank=True)
    investors = models.JSONField(default=list)
    
    # Market intelligence
    competitors = models.JSONField(default=list)
    market_segment = models.CharField(max_length=100, blank=True)
    growth_rate = models.FloatField(null=True, blank=True)
    
    # AI readiness assessment
    ai_readiness_score = models.IntegerField(default=0, help_text="1-100 score")
    digital_maturity_level = models.CharField(max_length=50, blank=True)
    innovation_index = models.IntegerField(default=0)
    
    # Budget indicators
    budget_likelihood = models.CharField(max_length=50, blank=True)
    budget_timing = models.CharField(max_length=50, blank=True)
    decision_making_unit = models.JSONField(default=list, help_text="Key decision makers")
    
    # Data source and quality
    data_source = models.CharField(max_length=100, blank=True)
    data_confidence = models.FloatField(default=0.0)
    last_enriched = models.DateTimeField(auto_now=True)
    
    # URLs and references
    website_url = models.URLField(blank=True)
    crunchbase_url = models.URLField(blank=True)
    glassdoor_url = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-ai_readiness_score', '-created_at']
    
    def __str__(self):
        return f"{self.company_name} - {self.industry}"


class IntentSignal(models.Model):
    """
    Intent Data Integration
    Based on Phase 5.2 of the marketing plan
    """
    SIGNAL_TYPES = [
        ('search', 'Search Intent'),
        ('content', 'Content Consumption'),
        ('social', 'Social Engagement'),
        ('technographic', 'Technology Research'),
        ('competitive', 'Competitor Research'),
        ('review_site', 'Review Site Activity'),
        ('event', 'Event Registration'),
        ('community', 'Community Participation'),
        ('job_posting', 'Job Posting Activity'),
        ('financial', 'Financial Signals'),
    ]
    
    INTENT_LEVELS = [
        ('research', 'Research Stage'),
        ('evaluation', 'Evaluation Stage'),
        ('decision', 'Decision Stage'),
        ('urgent', 'Urgent Need'),
    ]
    
    lead = models.ForeignKey('leads.Lead', on_delete=models.CASCADE, related_name='intent_signals')
    
    # Signal details
    signal_type = models.CharField(max_length=50, choices=SIGNAL_TYPES)
    signal_source = models.CharField(max_length=100, help_text="Source of intent data")
    signal_strength = models.IntegerField(default=1, help_text="1-10 strength scale")
    
    # Intent analysis
    keywords = models.JSONField(default=list, help_text="Keywords/topics showing intent")
    intent_topics = models.JSONField(default=list, help_text="Specific topics of interest")
    intent_level = models.CharField(max_length=20, choices=INTENT_LEVELS, blank=True)
    
    # Scoring
    intent_score = models.IntegerField(default=0, help_text="1-100 intent score")
    buying_stage_score = models.IntegerField(default=0, help_text="How far in buying journey")
    urgency_score = models.IntegerField(default=0, help_text="Urgency of need")
    
    # Timing
    signal_date = models.DateTimeField()
    recency_weight = models.FloatField(default=1.0, help_text="Weight based on recency")
    expiry_date = models.DateTimeField(null=True, blank=True)
    
    # Confidence and validation
    confidence_level = models.FloatField(default=0.5, help_text="0-1 confidence in signal")
    verified = models.BooleanField(default=False)
    
    # Action tracking
    action_taken = models.CharField(max_length=200, blank=True)
    action_date = models.DateTimeField(null=True, blank=True)
    action_successful = models.BooleanField(default=False)
    
    # Attribution
    influenced_opportunity = models.BooleanField(default=False)
    revenue_influenced = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-intent_score', '-signal_date']
    
    def __str__(self):
        return f"{self.lead} - {self.get_signal_type_display()} ({self.intent_score})"


class LeadEngagementScore(models.Model):
    """
    Comprehensive lead engagement scoring
    """
    lead = models.OneToOneField('leads.Lead', on_delete=models.CASCADE, related_name='engagement_score')
    
    # Engagement metrics
    email_engagement_score = models.IntegerField(default=0)
    website_engagement_score = models.IntegerField(default=0)
    content_engagement_score = models.IntegerField(default=0)
    social_engagement_score = models.IntegerField(default=0)
    event_engagement_score = models.IntegerField(default=0)
    
    # Behavioral scores
    recency_score = models.IntegerField(default=0, help_text="How recently engaged")
    frequency_score = models.IntegerField(default=0, help_text="How often engaged")
    depth_score = models.IntegerField(default=0, help_text="Depth of engagement")
    
    # Composite scores
    overall_engagement_score = models.IntegerField(default=0)
    trend_score = models.IntegerField(default=0, help_text="Engagement trend (increasing/decreasing)")
    
    # Engagement velocity
    engagement_velocity = models.FloatField(default=0.0, help_text="Rate of engagement change")
    last_engagement_date = models.DateTimeField(null=True, blank=True)
    days_since_engagement = models.IntegerField(default=0)
    
    # Predictive metrics
    churn_risk_score = models.IntegerField(default=0, help_text="Risk of disengagement")
    reactivation_likelihood = models.IntegerField(default=0, help_text="Likelihood to re-engage")
    
    # Recommendations
    recommended_actions = models.JSONField(default=list)
    optimal_contact_time = models.TimeField(null=True, blank=True)
    preferred_channel = models.CharField(max_length=50, blank=True)
    
    last_calculated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-overall_engagement_score']
    
    def __str__(self):
        return f"{self.lead} - Score: {self.overall_engagement_score}"


class PredictiveInsight(models.Model):
    """
    AI-generated predictive insights for leads
    """
    PREDICTION_TYPES = [
        ('conversion_probability', 'Conversion Probability'),
        ('deal_size', 'Predicted Deal Size'),
        ('time_to_close', 'Time to Close'),
        ('churn_risk', 'Churn Risk'),
        ('upsell_opportunity', 'Upsell Opportunity'),
        ('lifetime_value', 'Customer Lifetime Value'),
        ('next_best_action', 'Next Best Action'),
    ]
    
    lead = models.ForeignKey('leads.Lead', on_delete=models.CASCADE, related_name='predictive_insights')
    prediction_type = models.CharField(max_length=50, choices=PREDICTION_TYPES)
    
    # Prediction details
    prediction_value = models.JSONField(help_text="The predicted value/outcome")
    confidence_score = models.FloatField(help_text="0-1 confidence in prediction")
    prediction_model = models.ForeignKey(LeadScoringModel, on_delete=models.SET_NULL, null=True)
    
    # Contributing factors
    contributing_factors = models.JSONField(default=dict, help_text="Factors influencing prediction")
    feature_importance = models.JSONField(default=dict, help_text="Importance of each feature")
    
    # Recommendations
    recommended_actions = models.JSONField(default=list)
    action_priority = models.CharField(max_length=20, default='medium')
    estimated_impact = models.JSONField(default=dict, help_text="Estimated impact of actions")
    
    # Validity
    valid_until = models.DateTimeField()
    is_current = models.BooleanField(default=True)
    
    # Outcome tracking
    actual_outcome = models.JSONField(null=True, blank=True)
    outcome_date = models.DateTimeField(null=True, blank=True)
    prediction_accuracy = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at', '-confidence_score']
        unique_together = ['lead', 'prediction_type', 'is_current']
    
    def __str__(self):
        return f"{self.lead} - {self.get_prediction_type_display()}"