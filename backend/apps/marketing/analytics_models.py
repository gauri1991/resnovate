from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
import json

User = get_user_model()

class AttributionModel(models.Model):
    """Attribution models for marketing channel attribution"""
    ATTRIBUTION_TYPES = [
        ('first_touch', 'First Touch'),
        ('last_touch', 'Last Touch'),
        ('linear', 'Linear Attribution'),
        ('time_decay', 'Time Decay'),
        ('position_based', 'Position Based (40-20-40)'),
        ('data_driven', 'Data-Driven Attribution'),
        ('custom', 'Custom Attribution'),
    ]
    
    name = models.CharField(max_length=200)
    attribution_type = models.CharField(max_length=50, choices=ATTRIBUTION_TYPES)
    description = models.TextField(blank=True)
    
    # Attribution configuration
    attribution_config = models.JSONField(default=dict, help_text="Attribution model configuration")
    lookback_window_days = models.IntegerField(default=30, help_text="Attribution lookback window")
    conversion_events = models.JSONField(default=list, help_text="Events to attribute")
    channel_mapping = models.JSONField(default=dict, help_text="Channel attribution mapping")
    
    # Weight configuration for position-based and custom models
    first_touch_weight = models.FloatField(default=0.4, validators=[MinValueValidator(0), MaxValueValidator(1)])
    last_touch_weight = models.FloatField(default=0.4, validators=[MinValueValidator(0), MaxValueValidator(1)])
    middle_touch_weight = models.FloatField(default=0.2, validators=[MinValueValidator(0), MaxValueValidator(1)])
    
    # Time decay configuration
    decay_rate = models.FloatField(default=0.5, help_text="Time decay rate (0-1)")
    half_life_days = models.IntegerField(default=7, help_text="Half-life in days for time decay")
    
    # Performance tracking
    accuracy_score = models.FloatField(default=0.0, help_text="Model accuracy score")
    usage_count = models.IntegerField(default=0)
    last_calculated = models.DateTimeField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_default', 'name']

class CustomerJourney(models.Model):
    """Customer journey tracking and mapping"""
    JOURNEY_STAGES = [
        ('awareness', 'Awareness'),
        ('interest', 'Interest'),
        ('consideration', 'Consideration'),
        ('intent', 'Intent'),
        ('evaluation', 'Evaluation'),
        ('purchase', 'Purchase'),
        ('retention', 'Retention'),
        ('advocacy', 'Advocacy'),
    ]
    
    journey_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    customer_id = models.CharField(max_length=200, help_text="External customer identifier")
    session_id = models.CharField(max_length=200, blank=True)
    
    # Journey metadata
    start_timestamp = models.DateTimeField(default=timezone.now)
    end_timestamp = models.DateTimeField(null=True, blank=True)
    total_duration = models.DurationField(null=True, blank=True)
    is_complete = models.BooleanField(default=False)
    
    # Journey progression
    current_stage = models.CharField(max_length=50, choices=JOURNEY_STAGES, default='awareness')
    stages_completed = models.JSONField(default=list, help_text="Completed journey stages")
    conversion_events = models.JSONField(default=list, help_text="Conversion events in journey")
    
    # Touchpoint tracking
    touchpoints = models.JSONField(default=list, help_text="All customer touchpoints")
    channels_used = models.JSONField(default=list, help_text="Marketing channels used")
    devices_used = models.JSONField(default=list, help_text="Devices used in journey")
    
    # Attribution and value
    attribution_model = models.ForeignKey(AttributionModel, on_delete=models.SET_NULL, null=True)
    total_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    attributed_value = models.JSONField(default=dict, help_text="Value attributed to each channel")
    
    # Journey characteristics
    path_length = models.IntegerField(default=0, help_text="Number of touchpoints")
    unique_channels = models.IntegerField(default=0, help_text="Number of unique channels")
    time_to_conversion = models.DurationField(null=True, blank=True)
    
    # Segmentation
    customer_segment = models.CharField(max_length=100, blank=True)
    journey_type = models.CharField(max_length=100, blank=True, help_text="Journey classification")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer_id', 'start_timestamp']),
            models.Index(fields=['current_stage', 'is_complete']),
        ]

class TouchpointEvent(models.Model):
    """Individual touchpoint events in customer journeys"""
    EVENT_TYPES = [
        ('page_view', 'Page View'),
        ('email_open', 'Email Open'),
        ('email_click', 'Email Click'),
        ('ad_click', 'Ad Click'),
        ('social_engagement', 'Social Media Engagement'),
        ('form_submission', 'Form Submission'),
        ('download', 'Content Download'),
        ('webinar_attendance', 'Webinar Attendance'),
        ('demo_request', 'Demo Request'),
        ('purchase', 'Purchase'),
        ('support_contact', 'Support Contact'),
        ('referral', 'Referral'),
    ]
    
    CHANNELS = [
        ('organic_search', 'Organic Search'),
        ('paid_search', 'Paid Search'),
        ('social_media', 'Social Media'),
        ('email', 'Email Marketing'),
        ('direct', 'Direct Traffic'),
        ('referral', 'Referral'),
        ('display', 'Display Advertising'),
        ('affiliate', 'Affiliate'),
        ('webinar', 'Webinar'),
        ('content', 'Content Marketing'),
        ('pr', 'Public Relations'),
        ('events', 'Events'),
    ]
    
    journey = models.ForeignKey(CustomerJourney, on_delete=models.CASCADE, related_name='events')
    event_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Event details
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    channel = models.CharField(max_length=50, choices=CHANNELS)
    campaign_id = models.CharField(max_length=200, blank=True)
    content_id = models.CharField(max_length=200, blank=True)
    
    # Timing and sequence
    timestamp = models.DateTimeField(default=timezone.now)
    sequence_number = models.IntegerField(help_text="Order in journey")
    time_since_previous = models.DurationField(null=True, blank=True)
    
    # Event metadata
    page_url = models.URLField(blank=True)
    referrer_url = models.URLField(blank=True)
    utm_source = models.CharField(max_length=200, blank=True)
    utm_medium = models.CharField(max_length=200, blank=True)
    utm_campaign = models.CharField(max_length=200, blank=True)
    utm_content = models.CharField(max_length=200, blank=True)
    utm_term = models.CharField(max_length=200, blank=True)
    
    # Device and context
    device_type = models.CharField(max_length=50, blank=True)
    browser = models.CharField(max_length=100, blank=True)
    operating_system = models.CharField(max_length=100, blank=True)
    location = models.JSONField(default=dict, help_text="Geographic location data")
    
    # Attribution
    attribution_weight = models.FloatField(default=0.0, help_text="Attribution weight for this touchpoint")
    attributed_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Engagement metrics
    session_duration = models.DurationField(null=True, blank=True)
    pages_viewed = models.IntegerField(default=1)
    engagement_score = models.FloatField(default=0.0, help_text="Engagement quality score")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['sequence_number']
        indexes = [
            models.Index(fields=['journey', 'timestamp']),
            models.Index(fields=['channel', 'event_type']),
        ]

class PredictiveModel(models.Model):
    """Predictive analytics models for marketing"""
    MODEL_TYPES = [
        ('lead_scoring', 'Lead Scoring'),
        ('churn_prediction', 'Churn Prediction'),
        ('ltv_prediction', 'Lifetime Value Prediction'),
        ('conversion_probability', 'Conversion Probability'),
        ('next_best_action', 'Next Best Action'),
        ('channel_optimization', 'Channel Optimization'),
        ('budget_allocation', 'Budget Allocation'),
        ('campaign_performance', 'Campaign Performance Prediction'),
    ]
    
    ALGORITHMS = [
        ('logistic_regression', 'Logistic Regression'),
        ('random_forest', 'Random Forest'),
        ('gradient_boosting', 'Gradient Boosting'),
        ('neural_network', 'Neural Network'),
        ('svm', 'Support Vector Machine'),
        ('naive_bayes', 'Naive Bayes'),
        ('ensemble', 'Ensemble Method'),
    ]
    
    name = models.CharField(max_length=200)
    model_type = models.CharField(max_length=50, choices=MODEL_TYPES)
    algorithm = models.CharField(max_length=50, choices=ALGORITHMS)
    description = models.TextField(blank=True)
    
    # Model configuration
    features = models.JSONField(default=list, help_text="Features used in the model")
    hyperparameters = models.JSONField(default=dict, help_text="Model hyperparameters")
    training_config = models.JSONField(default=dict, help_text="Training configuration")
    
    # Performance metrics
    accuracy = models.FloatField(default=0.0)
    precision = models.FloatField(default=0.0)
    recall = models.FloatField(default=0.0)
    f1_score = models.FloatField(default=0.0)
    auc_score = models.FloatField(default=0.0)
    
    # Model status
    is_trained = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    training_data_size = models.IntegerField(default=0)
    last_trained = models.DateTimeField(null=True, blank=True)
    last_prediction = models.DateTimeField(null=True, blank=True)
    
    # Version control
    version = models.CharField(max_length=50, default='1.0')
    model_file_path = models.CharField(max_length=500, blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['name', 'version']

class PredictionResult(models.Model):
    """Results from predictive model executions"""
    model = models.ForeignKey(PredictiveModel, on_delete=models.CASCADE, related_name='predictions')
    prediction_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Target information
    target_id = models.CharField(max_length=200, help_text="ID of predicted entity")
    target_type = models.CharField(max_length=50, help_text="Type of entity (lead, customer, etc.)")
    
    # Prediction results
    prediction_value = models.FloatField(help_text="Predicted value/probability")
    confidence_score = models.FloatField(default=0.0, help_text="Prediction confidence")
    prediction_class = models.CharField(max_length=100, blank=True, help_text="Predicted class")
    
    # Feature importance
    feature_contributions = models.JSONField(default=dict, help_text="Feature contribution to prediction")
    input_features = models.JSONField(default=dict, help_text="Input features used")
    
    # Prediction context
    prediction_timestamp = models.DateTimeField(default=timezone.now)
    batch_id = models.CharField(max_length=200, blank=True, help_text="Batch prediction ID")
    
    # Validation
    actual_value = models.FloatField(null=True, blank=True, help_text="Actual outcome for validation")
    is_validated = models.BooleanField(default=False)
    validation_timestamp = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-prediction_timestamp']
        indexes = [
            models.Index(fields=['model', 'prediction_timestamp']),
            models.Index(fields=['target_id', 'target_type']),
        ]

class MarketingROI(models.Model):
    """Marketing ROI calculations and tracking"""
    CALCULATION_PERIODS = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
        ('campaign', 'Campaign-based'),
        ('custom', 'Custom Period'),
    ]
    
    roi_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=200)
    calculation_period = models.CharField(max_length=50, choices=CALCULATION_PERIODS)
    
    # Time period
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    # Investment tracking
    total_investment = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    channel_investments = models.JSONField(default=dict, help_text="Investment by channel")
    campaign_investments = models.JSONField(default=dict, help_text="Investment by campaign")
    
    # Revenue tracking
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    attributed_revenue = models.JSONField(default=dict, help_text="Revenue by attribution source")
    conversion_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # ROI metrics
    roi_percentage = models.FloatField(default=0.0, help_text="Return on Investment %")
    roas = models.FloatField(default=0.0, help_text="Return on Ad Spend")
    cost_per_acquisition = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    customer_lifetime_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Performance indicators
    total_leads = models.IntegerField(default=0)
    total_conversions = models.IntegerField(default=0)
    conversion_rate = models.FloatField(default=0.0)
    cost_per_lead = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Channel performance
    channel_performance = models.JSONField(default=dict, help_text="Performance by channel")
    top_performing_channels = models.JSONField(default=list)
    underperforming_channels = models.JSONField(default=list)
    
    # Attribution model used
    attribution_model = models.ForeignKey(AttributionModel, on_delete=models.SET_NULL, null=True)
    
    # Calculation metadata
    calculation_method = models.JSONField(default=dict, help_text="ROI calculation methodology")
    data_sources = models.JSONField(default=list, help_text="Data sources used")
    assumptions = models.JSONField(default=dict, help_text="Calculation assumptions")
    
    calculated_at = models.DateTimeField(auto_now_add=True)
    calculated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['-calculated_at']
        indexes = [
            models.Index(fields=['start_date', 'end_date']),
            models.Index(fields=['calculation_period']),
        ]

class PerformanceDashboard(models.Model):
    """Real-time performance dashboard configurations"""
    DASHBOARD_TYPES = [
        ('executive', 'Executive Summary'),
        ('campaign', 'Campaign Performance'),
        ('channel', 'Channel Performance'),
        ('roi', 'ROI Analysis'),
        ('attribution', 'Attribution Analysis'),
        ('predictive', 'Predictive Analytics'),
        ('custom', 'Custom Dashboard'),
    ]
    
    REFRESH_INTERVALS = [
        ('real_time', 'Real-time'),
        ('5_minutes', '5 Minutes'),
        ('15_minutes', '15 Minutes'),
        ('hourly', 'Hourly'),
        ('daily', 'Daily'),
        ('manual', 'Manual Refresh'),
    ]
    
    name = models.CharField(max_length=200)
    dashboard_type = models.CharField(max_length=50, choices=DASHBOARD_TYPES)
    description = models.TextField(blank=True)
    
    # Dashboard configuration
    widgets = models.JSONField(default=list, help_text="Dashboard widget configurations")
    layout = models.JSONField(default=dict, help_text="Dashboard layout settings")
    filters = models.JSONField(default=dict, help_text="Available filters")
    
    # Data configuration
    data_sources = models.JSONField(default=list, help_text="Connected data sources")
    refresh_interval = models.CharField(max_length=20, choices=REFRESH_INTERVALS, default='hourly')
    time_range = models.JSONField(default=dict, help_text="Default time range")
    
    # Access control
    is_public = models.BooleanField(default=False)
    allowed_users = models.ManyToManyField(User, blank=True, related_name='accessible_dashboards')
    
    # Performance
    last_updated = models.DateTimeField(null=True, blank=True)
    cache_duration = models.IntegerField(default=300, help_text="Cache duration in seconds")
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_dashboards')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']

class AnalyticsAlert(models.Model):
    """Automated alerts for marketing analytics"""
    ALERT_TYPES = [
        ('threshold', 'Threshold Alert'),
        ('anomaly', 'Anomaly Detection'),
        ('trend', 'Trend Alert'),
        ('performance', 'Performance Alert'),
        ('budget', 'Budget Alert'),
        ('roi', 'ROI Alert'),
        ('conversion', 'Conversion Rate Alert'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    name = models.CharField(max_length=200)
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS)
    description = models.TextField(blank=True)
    
    # Alert conditions
    metric = models.CharField(max_length=100, help_text="Metric to monitor")
    threshold_value = models.FloatField(help_text="Alert threshold")
    comparison_operator = models.CharField(max_length=10, default='>', help_text=">, <, >=, <=, ==")
    
    # Alert configuration
    check_frequency = models.CharField(max_length=20, default='hourly')
    time_window = models.JSONField(default=dict, help_text="Time window for evaluation")
    conditions = models.JSONField(default=dict, help_text="Additional alert conditions")
    
    # Notification settings
    notification_channels = models.JSONField(default=list, help_text="Notification channels")
    recipients = models.JSONField(default=list, help_text="Alert recipients")
    
    # Status
    is_active = models.BooleanField(default=True)
    last_triggered = models.DateTimeField(null=True, blank=True)
    trigger_count = models.IntegerField(default=0)
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']