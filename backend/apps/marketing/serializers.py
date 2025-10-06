from rest_framework import serializers
from .models import (
    MarketingCampaign,
    ContentTemplate,
    CampaignOrchestration,
    SocialMediaCampaign,
    PaidCampaign,
    CampaignPerformanceMetrics
)


class MarketingCampaignSerializer(serializers.ModelSerializer):
    """Serializer for MarketingCampaign model"""
    
    campaign_type_display = serializers.CharField(source='get_campaign_type_display', read_only=True)
    objective_display = serializers.CharField(source='get_objective_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    # Performance calculations
    efficiency_score = serializers.SerializerMethodField()
    budget_utilization = serializers.SerializerMethodField()
    days_running = serializers.SerializerMethodField()
    
    class Meta:
        model = MarketingCampaign
        fields = '__all__'
        read_only_fields = [
            'impressions', 'clicks', 'leads_generated', 'conversions',
            'revenue_generated', 'click_through_rate', 'conversion_rate',
            'cost_per_click', 'cost_per_lead', 'cost_per_acquisition',
            'return_on_ad_spend', 'ai_performance_score', 'created_at', 'updated_at'
        ]
    
    def get_efficiency_score(self, obj):
        """Calculate campaign efficiency score based on multiple factors"""
        if not obj.spent or obj.spent == 0:
            return 0
        
        # Weighted score based on CTR, conversion rate, and ROAS
        ctr_score = min(obj.click_through_rate * 10, 100)  # Cap at 100
        conversion_score = min(obj.conversion_rate * 5, 100)  # Cap at 100
        roas_score = min(obj.return_on_ad_spend * 20, 100)  # Cap at 100
        
        efficiency = (ctr_score * 0.3 + conversion_score * 0.4 + roas_score * 0.3)
        return round(efficiency, 1)
    
    def get_budget_utilization(self, obj):
        """Calculate budget utilization percentage"""
        if not obj.budget or obj.budget == 0:
            return 0
        return round((float(obj.spent) / float(obj.budget)) * 100, 1)
    
    def get_days_running(self, obj):
        """Calculate days the campaign has been running"""
        from django.utils import timezone
        if obj.status == 'active':
            return (timezone.now().date() - obj.start_date.date()).days
        elif obj.end_date:
            return (obj.end_date.date() - obj.start_date.date()).days
        return 0


class MarketingCampaignCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for campaign creation"""
    
    class Meta:
        model = MarketingCampaign
        fields = [
            'name', 'description', 'campaign_type', 'objective', 'status',
            'target_audience', 'target_keywords', 'target_personas',
            'start_date', 'end_date', 'budget', 'daily_budget',
            'channels', 'ai_optimization_enabled', 'ab_testing_enabled'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ContentTemplateSerializer(serializers.ModelSerializer):
    """Serializer for ContentTemplate model"""
    
    content_type_display = serializers.CharField(source='get_content_type_display', read_only=True)
    stage_display = serializers.CharField(source='get_stage_display', read_only=True)
    performance_summary = serializers.SerializerMethodField()
    
    class Meta:
        model = ContentTemplate
        fields = '__all__'
        read_only_fields = ['usage_count', 'performance_metrics', 'created_at', 'updated_at']
    
    def get_performance_summary(self, obj):
        """Get performance summary for the template"""
        return {
            'usage_count': obj.usage_count,
            'avg_engagement': obj.average_engagement,
            'avg_conversion': obj.average_conversion_rate,
            'rating': 'high' if obj.average_conversion_rate > 5 else 'medium' if obj.average_conversion_rate > 2 else 'low'
        }


class SocialMediaCampaignSerializer(serializers.ModelSerializer):
    """Serializer for SocialMediaCampaign model"""
    
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    campaign_type_display = serializers.CharField(source='get_campaign_type_display', read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    
    class Meta:
        model = SocialMediaCampaign
        fields = '__all__'
        read_only_fields = [
            'impressions', 'reach', 'clicks', 'engagements', 'shares',
            'comments', 'likes', 'leads_generated', 'cost_per_lead',
            'engagement_rate', 'conversion_rate', 'created_at', 'updated_at'
        ]


class PaidCampaignSerializer(serializers.ModelSerializer):
    """Serializer for PaidCampaign model"""
    
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    campaign_type_display = serializers.CharField(source='get_campaign_type_display', read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    
    # Performance metrics
    ctr = serializers.SerializerMethodField()
    cpc = serializers.SerializerMethodField()
    conversion_rate = serializers.SerializerMethodField()
    roas = serializers.SerializerMethodField()
    
    class Meta:
        model = PaidCampaign
        fields = '__all__'
        read_only_fields = [
            'impressions', 'clicks', 'conversions', 'spend', 'revenue',
            'created_at', 'updated_at'
        ]
    
    def get_ctr(self, obj):
        """Calculate Click-Through Rate"""
        if obj.impressions > 0:
            return round((obj.clicks / obj.impressions) * 100, 2)
        return 0
    
    def get_cpc(self, obj):
        """Calculate Cost Per Click"""
        if obj.clicks > 0:
            return round(float(obj.spend) / obj.clicks, 2)
        return 0
    
    def get_conversion_rate(self, obj):
        """Calculate Conversion Rate"""
        if obj.clicks > 0:
            return round((obj.conversions / obj.clicks) * 100, 2)
        return 0
    
    def get_roas(self, obj):
        """Calculate Return on Ad Spend"""
        if obj.spend > 0:
            return round(float(obj.revenue) / float(obj.spend), 2)
        return 0


class CampaignOrchestrationSerializer(serializers.ModelSerializer):
    """Serializer for CampaignOrchestration model"""
    
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    
    class Meta:
        model = CampaignOrchestration
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CampaignPerformanceMetricsSerializer(serializers.ModelSerializer):
    """Serializer for CampaignPerformanceMetrics model"""
    
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    
    class Meta:
        model = CampaignPerformanceMetrics
        fields = '__all__'
        read_only_fields = ['created_at']


class CampaignSummarySerializer(serializers.Serializer):
    """Serializer for campaign summary dashboard"""
    
    total_campaigns = serializers.IntegerField()
    active_campaigns = serializers.IntegerField()
    total_spend = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_leads = serializers.IntegerField()
    total_conversions = serializers.IntegerField()
    average_roas = serializers.FloatField()
    average_cpl = serializers.DecimalField(max_digits=10, decimal_places=2)
    top_performing_campaigns = MarketingCampaignSerializer(many=True)
    channel_performance = serializers.DictField()


class CampaignOptimizationSerializer(serializers.Serializer):
    """Serializer for AI campaign optimization suggestions"""
    
    campaign_id = serializers.IntegerField()
    optimization_type = serializers.CharField()
    suggestion = serializers.CharField()
    expected_improvement = serializers.CharField()
    confidence_score = serializers.FloatField()
    implementation_effort = serializers.CharField()
    priority = serializers.CharField()