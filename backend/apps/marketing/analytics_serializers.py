from rest_framework import serializers
from .analytics_models import (
    AttributionModel,
    CustomerJourney,
    TouchpointEvent,
    PredictiveModel,
    PredictionResult,
    MarketingROI,
    PerformanceDashboard,
    AnalyticsAlert
)

class AttributionModelSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = AttributionModel
        fields = [
            'id', 'name', 'attribution_type', 'description', 'attribution_config',
            'lookback_window_days', 'conversion_events', 'channel_mapping',
            'first_touch_weight', 'last_touch_weight', 'middle_touch_weight',
            'decay_rate', 'half_life_days', 'accuracy_score', 'usage_count',
            'last_calculated', 'is_active', 'is_default', 'created_by',
            'created_by_name', 'created_at', 'updated_at'
        ]

class TouchpointEventSerializer(serializers.ModelSerializer):
    time_since_previous_minutes = serializers.SerializerMethodField()
    
    class Meta:
        model = TouchpointEvent
        fields = [
            'id', 'event_id', 'event_type', 'channel', 'campaign_id', 'content_id',
            'timestamp', 'sequence_number', 'time_since_previous', 'time_since_previous_minutes',
            'page_url', 'referrer_url', 'utm_source', 'utm_medium', 'utm_campaign',
            'utm_content', 'utm_term', 'device_type', 'browser', 'operating_system',
            'location', 'attribution_weight', 'attributed_value', 'session_duration',
            'pages_viewed', 'engagement_score', 'created_at'
        ]
    
    def get_time_since_previous_minutes(self, obj):
        if obj.time_since_previous:
            return round(obj.time_since_previous.total_seconds() / 60, 2)
        return None

class CustomerJourneySerializer(serializers.ModelSerializer):
    events = TouchpointEventSerializer(many=True, read_only=True)
    attribution_model_name = serializers.CharField(source='attribution_model.name', read_only=True)
    total_duration_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomerJourney
        fields = [
            'id', 'journey_id', 'customer_id', 'session_id', 'start_timestamp',
            'end_timestamp', 'total_duration', 'total_duration_hours', 'is_complete',
            'current_stage', 'stages_completed', 'conversion_events', 'touchpoints',
            'channels_used', 'devices_used', 'attribution_model', 'attribution_model_name',
            'total_value', 'attributed_value', 'path_length', 'unique_channels',
            'time_to_conversion', 'customer_segment', 'journey_type', 'events',
            'created_at', 'updated_at'
        ]
    
    def get_total_duration_hours(self, obj):
        if obj.total_duration:
            return round(obj.total_duration.total_seconds() / 3600, 2)
        return None

class CustomerJourneySummarySerializer(serializers.ModelSerializer):
    """Simplified serializer for journey lists"""
    attribution_model_name = serializers.CharField(source='attribution_model.name', read_only=True)
    events_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomerJourney
        fields = [
            'id', 'journey_id', 'customer_id', 'start_timestamp', 'end_timestamp',
            'is_complete', 'current_stage', 'total_value', 'path_length',
            'unique_channels', 'customer_segment', 'attribution_model_name',
            'events_count', 'created_at'
        ]
    
    def get_events_count(self, obj):
        return obj.events.count()

class PredictiveModelSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    performance_summary = serializers.SerializerMethodField()
    
    class Meta:
        model = PredictiveModel
        fields = [
            'id', 'name', 'model_type', 'algorithm', 'description', 'features',
            'hyperparameters', 'training_config', 'accuracy', 'precision', 'recall',
            'f1_score', 'auc_score', 'is_trained', 'is_active', 'training_data_size',
            'last_trained', 'last_prediction', 'version', 'model_file_path',
            'created_by', 'created_by_name', 'performance_summary', 'created_at', 'updated_at'
        ]
    
    def get_performance_summary(self, obj):
        if obj.is_trained:
            return {
                'accuracy': obj.accuracy,
                'precision': obj.precision,
                'recall': obj.recall,
                'f1_score': obj.f1_score,
                'auc_score': obj.auc_score
            }
        return None

class PredictionResultSerializer(serializers.ModelSerializer):
    model_name = serializers.CharField(source='model.name', read_only=True)
    model_type = serializers.CharField(source='model.model_type', read_only=True)
    
    class Meta:
        model = PredictionResult
        fields = [
            'id', 'prediction_id', 'model', 'model_name', 'model_type', 'target_id',
            'target_type', 'prediction_value', 'confidence_score', 'prediction_class',
            'feature_contributions', 'input_features', 'prediction_timestamp',
            'batch_id', 'actual_value', 'is_validated', 'validation_timestamp',
            'created_at'
        ]

class MarketingROISerializer(serializers.ModelSerializer):
    attribution_model_name = serializers.CharField(source='attribution_model.name', read_only=True)
    calculated_by_name = serializers.CharField(source='calculated_by.username', read_only=True)
    
    class Meta:
        model = MarketingROI
        fields = [
            'id', 'roi_id', 'name', 'calculation_period', 'start_date', 'end_date',
            'total_investment', 'channel_investments', 'campaign_investments',
            'total_revenue', 'attributed_revenue', 'conversion_value', 'roi_percentage',
            'roas', 'cost_per_acquisition', 'customer_lifetime_value', 'total_leads',
            'total_conversions', 'conversion_rate', 'cost_per_lead', 'channel_performance',
            'top_performing_channels', 'underperforming_channels', 'attribution_model',
            'attribution_model_name', 'calculation_method', 'data_sources', 'assumptions',
            'calculated_at', 'calculated_by', 'calculated_by_name'
        ]

class PerformanceDashboardSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    widget_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PerformanceDashboard
        fields = [
            'id', 'name', 'dashboard_type', 'description', 'widgets', 'layout',
            'filters', 'data_sources', 'refresh_interval', 'time_range',
            'is_public', 'last_updated', 'cache_duration', 'created_by',
            'created_by_name', 'widget_count', 'created_at', 'updated_at'
        ]
    
    def get_widget_count(self, obj):
        return len(obj.widgets) if obj.widgets else 0

class AnalyticsAlertSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = AnalyticsAlert
        fields = [
            'id', 'name', 'alert_type', 'severity', 'description', 'metric',
            'threshold_value', 'comparison_operator', 'check_frequency', 'time_window',
            'conditions', 'notification_channels', 'recipients', 'is_active',
            'last_triggered', 'trigger_count', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]

# Summary serializers for dashboards
class AttributionSummarySerializer(serializers.Serializer):
    total_models = serializers.IntegerField()
    active_models = serializers.IntegerField()
    default_model = serializers.CharField()
    total_journeys_analyzed = serializers.IntegerField()
    avg_accuracy_score = serializers.FloatField()

class JourneyAnalyticsSerializer(serializers.Serializer):
    total_journeys = serializers.IntegerField()
    completed_journeys = serializers.IntegerField()
    avg_journey_length = serializers.FloatField()
    avg_time_to_conversion = serializers.FloatField()
    top_conversion_paths = serializers.ListField()
    channel_performance = serializers.DictField()

class PredictiveAnalyticsSerializer(serializers.Serializer):
    total_models = serializers.IntegerField()
    active_models = serializers.IntegerField()
    total_predictions = serializers.IntegerField()
    avg_model_accuracy = serializers.FloatField()
    recent_predictions = serializers.ListField()

class ROIAnalyticsSerializer(serializers.Serializer):
    total_investment = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    overall_roi = serializers.FloatField()
    best_performing_channel = serializers.CharField()
    worst_performing_channel = serializers.CharField()
    roi_trend = serializers.ListField()

class PerformanceOverviewSerializer(serializers.Serializer):
    total_touchpoints = serializers.IntegerField()
    active_journeys = serializers.IntegerField()
    conversion_rate = serializers.FloatField()
    avg_customer_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    top_channels = serializers.ListField()
    performance_alerts = serializers.IntegerField()