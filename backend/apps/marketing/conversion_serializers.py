from rest_framework import serializers
from .conversion_models import (
    LandingPage,
    PageVariant,
    ConversionFunnel,
    FunnelStep,
    ConversionOptimization,
    UserJourney,
    ExitIntentTrigger
)


class LandingPageSerializer(serializers.ModelSerializer):
    """
    Serializer for Landing Pages
    """
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    variants_count = serializers.SerializerMethodField()
    is_testing = serializers.SerializerMethodField()
    
    class Meta:
        model = LandingPage
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by', 'views', 
                           'unique_visitors', 'conversions', 'conversion_rate', 'bounce_rate')
    
    def get_variants_count(self, obj):
        return obj.variants.count()
    
    def get_is_testing(self, obj):
        return obj.ab_testing_enabled and obj.variants.filter(is_active=True).count() > 1
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class LandingPageCreateSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for creating landing pages
    """
    class Meta:
        model = LandingPage
        fields = [
            'name', 'slug', 'description', 'page_type', 'optimization_goal',
            'page_structure', 'content_blocks', 'design_template', 'custom_css',
            'meta_title', 'meta_description', 'keywords', 'primary_cta_text',
            'primary_cta_color', 'secondary_cta_text', 'form_fields',
            'personalization_rules', 'audience_segments', 'mobile_optimized',
            'tracking_enabled', 'conversion_tracking', 'heatmap_enabled'
        ]


class PageVariantSerializer(serializers.ModelSerializer):
    """
    Serializer for Page Variants (A/B Testing)
    """
    landing_page_name = serializers.CharField(source='landing_page.name', read_only=True)
    
    class Meta:
        model = PageVariant
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'views', 'conversions', 'conversion_rate',
                           'confidence_level', 'statistical_significance')


class ConversionFunnelSerializer(serializers.ModelSerializer):
    """
    Serializer for Conversion Funnels
    """
    steps_count = serializers.SerializerMethodField()
    funnel_steps = serializers.SerializerMethodField()
    
    class Meta:
        model = ConversionFunnel
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'total_entries',
                           'total_completions', 'completion_rate', 'avg_time_to_complete',
                           'biggest_dropoff_step', 'dropoff_rate', 'last_analyzed')
    
    def get_steps_count(self, obj):
        return obj.funnel_steps.count()
    
    def get_funnel_steps(self, obj):
        return FunnelStepSerializer(obj.funnel_steps.all(), many=True).data


class FunnelStepSerializer(serializers.ModelSerializer):
    """
    Serializer for Funnel Steps
    """
    funnel_name = serializers.CharField(source='funnel.name', read_only=True)
    
    class Meta:
        model = FunnelStep
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'entries', 'completions',
                           'completion_rate', 'avg_time_on_step', 'dropoff_count',
                           'dropoff_rate', 'common_exit_points')


class ConversionOptimizationSerializer(serializers.ModelSerializer):
    """
    Serializer for Conversion Optimization Experiments
    """
    target_page_name = serializers.CharField(source='target_page.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    is_running = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = ConversionOptimization
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by',
                           'winning_variation', 'confidence_level', 'improvement_percentage',
                           'statistical_significance', 'implementation_date')
    
    def get_is_running(self, obj):
        return obj.status == 'testing' and obj.start_date and not obj.end_date
    
    def get_days_remaining(self, obj):
        if not obj.start_date or obj.end_date:
            return 0
        from django.utils import timezone
        end_date = obj.start_date + timezone.timedelta(days=obj.duration_days)
        remaining = (end_date - timezone.now()).days
        return max(0, remaining)
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class UserJourneySerializer(serializers.ModelSerializer):
    """
    Serializer for User Journeys
    """
    touchpoints_count = serializers.SerializerMethodField()
    stages_count = serializers.SerializerMethodField()
    
    class Meta:
        model = UserJourney
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'common_paths',
                           'friction_points', 'optimization_opportunities',
                           'completion_rate', 'avg_journey_time', 'abandonment_rate')
    
    def get_touchpoints_count(self, obj):
        return len(obj.touchpoints) if obj.touchpoints else 0
    
    def get_stages_count(self, obj):
        return len(obj.stages) if obj.stages else 0


class ExitIntentTriggerSerializer(serializers.ModelSerializer):
    """
    Serializer for Exit Intent Triggers
    """
    target_pages_names = serializers.SerializerMethodField()
    effectiveness_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = ExitIntentTrigger
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'triggers_fired',
                           'conversions', 'conversion_rate')
    
    def get_target_pages_names(self, obj):
        return [page.name for page in obj.target_pages.all()]
    
    def get_effectiveness_rate(self, obj):
        if obj.triggers_fired == 0:
            return 0.0
        return (obj.conversions / obj.triggers_fired) * 100


class LandingPageSummarySerializer(serializers.Serializer):
    """
    Summary statistics for landing pages
    """
    total_pages = serializers.IntegerField()
    published_pages = serializers.IntegerField()
    testing_pages = serializers.IntegerField()
    total_views = serializers.IntegerField()
    total_conversions = serializers.IntegerField()
    average_conversion_rate = serializers.FloatField()
    average_bounce_rate = serializers.FloatField()


class ConversionOptimizationSummarySerializer(serializers.Serializer):
    """
    Summary statistics for conversion optimization
    """
    total_experiments = serializers.IntegerField()
    running_experiments = serializers.IntegerField()
    completed_experiments = serializers.IntegerField()
    successful_experiments = serializers.IntegerField()
    average_improvement = serializers.FloatField()
    total_impact = serializers.DecimalField(max_digits=12, decimal_places=2)


class FunnelAnalysisSerializer(serializers.Serializer):
    """
    Funnel analysis results
    """
    funnel_id = serializers.IntegerField()
    funnel_name = serializers.CharField()
    steps = serializers.ListField(child=serializers.DictField())
    overall_conversion_rate = serializers.FloatField()
    biggest_dropoff = serializers.DictField()
    optimization_suggestions = serializers.ListField(child=serializers.CharField())


class ABTestResultsSerializer(serializers.Serializer):
    """
    A/B Test Results Analysis
    """
    test_id = serializers.IntegerField()
    test_name = serializers.CharField()
    status = serializers.CharField()
    variants = serializers.ListField(child=serializers.DictField())
    winner = serializers.CharField(allow_blank=True)
    confidence_level = serializers.FloatField()
    improvement = serializers.FloatField()
    statistical_significance = serializers.BooleanField()
    recommendation = serializers.CharField()


class CustomerJourneyInsightsSerializer(serializers.Serializer):
    """
    Customer Journey Analysis Insights
    """
    journey_id = serializers.IntegerField()
    journey_name = serializers.CharField()
    most_common_path = serializers.ListField(child=serializers.CharField())
    completion_rate = serializers.FloatField()
    average_time = serializers.CharField()  # Duration as string
    friction_points = serializers.ListField(child=serializers.DictField())
    improvement_opportunities = serializers.ListField(child=serializers.CharField())
    segment_performance = serializers.DictField()