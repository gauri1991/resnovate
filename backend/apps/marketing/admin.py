from django.contrib import admin
from .models import (
    MarketingCampaign,
    ContentTemplate,
    CampaignOrchestration,
    SocialMediaCampaign,
    PaidCampaign,
    CampaignPerformanceMetrics
)


@admin.register(MarketingCampaign)
class MarketingCampaignAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'campaign_type', 'objective', 'status', 
        'leads_generated', 'conversions', 'spent', 'ai_performance_score',
        'start_date', 'created_at'
    ]
    list_filter = [
        'campaign_type', 'objective', 'status', 'ai_optimization_enabled',
        'ab_testing_enabled', 'start_date', 'created_at'
    ]
    search_fields = ['name', 'description']
    readonly_fields = [
        'created_at', 'updated_at', 'impressions', 'clicks', 'leads_generated',
        'conversions', 'revenue_generated', 'click_through_rate', 'conversion_rate',
        'cost_per_click', 'cost_per_lead', 'cost_per_acquisition', 'return_on_ad_spend',
        'ai_performance_score'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'campaign_type', 'objective', 'status', 'created_by')
        }),
        ('Targeting & Audience', {
            'fields': ('target_audience', 'target_keywords', 'target_personas', 'geographic_targeting'),
            'classes': ('collapse',)
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'created_at', 'updated_at')
        }),
        ('Budget & Performance', {
            'fields': ('budget', 'daily_budget', 'spent', 'target_cpa', 'target_roas')
        }),
        ('Channel Configuration', {
            'fields': ('channels', 'channel_allocation'),
            'classes': ('collapse',)
        }),
        ('Content & Creative', {
            'fields': ('content_templates', 'creative_assets', 'messaging_variants'),
            'classes': ('collapse',)
        }),
        ('AI & Automation', {
            'fields': (
                'ai_optimization_enabled', 'auto_bidding', 'auto_targeting',
                'ai_content_generation', 'optimization_goal', 'ai_performance_score',
                'optimization_suggestions', 'predicted_performance'
            ),
            'classes': ('collapse',)
        }),
        ('A/B Testing', {
            'fields': ('ab_testing_enabled', 'ab_test_variants', 'traffic_split'),
            'classes': ('collapse',)
        }),
        ('Attribution & Tracking', {
            'fields': ('attribution_model', 'conversion_tracking', 'utm_parameters'),
            'classes': ('collapse',)
        }),
        ('Performance Metrics', {
            'fields': (
                'impressions', 'clicks', 'leads_generated', 'conversions', 'revenue_generated',
                'click_through_rate', 'conversion_rate', 'cost_per_click', 'cost_per_lead',
                'cost_per_acquisition', 'return_on_ad_spend'
            ),
            'classes': ('collapse',)
        })
    )


@admin.register(ContentTemplate)
class ContentTemplateAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'content_type', 'stage', 'industry', 'persona',
        'usage_count', 'average_engagement', 'average_conversion_rate'
    ]
    list_filter = ['content_type', 'stage', 'industry', 'persona']
    search_fields = ['name', 'template_content']
    readonly_fields = ['usage_count', 'performance_metrics', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'content_type', 'stage', 'industry', 'persona')
        }),
        ('Template Content', {
            'fields': ('template_content', 'ai_prompts', 'variables')
        }),
        ('Performance', {
            'fields': ('usage_count', 'performance_metrics', 'average_engagement', 'average_conversion_rate'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(CampaignOrchestration)
class CampaignOrchestrationAdmin(admin.ModelAdmin):
    list_display = ['name', 'campaign', 'status', 'start_date', 'end_date']
    list_filter = ['status', 'start_date']
    search_fields = ['name', 'campaign__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SocialMediaCampaign)
class SocialMediaCampaignAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'platform', 'campaign_type', 'leads_generated',
        'engagement_rate', 'conversion_rate', 'cost_per_lead'
    ]
    list_filter = ['platform', 'campaign_type', 'start_date']
    search_fields = ['name', 'campaign__name']
    readonly_fields = [
        'impressions', 'reach', 'clicks', 'engagements', 'shares',
        'comments', 'likes', 'leads_generated', 'cost_per_lead',
        'engagement_rate', 'conversion_rate', 'created_at', 'updated_at'
    ]


@admin.register(PaidCampaign)
class PaidCampaignAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'platform', 'campaign_type', 'daily_budget',
        'impressions', 'clicks', 'conversions', 'spend'
    ]
    list_filter = ['platform', 'campaign_type', 'auto_bidding']
    search_fields = ['name', 'campaign__name']
    readonly_fields = [
        'impressions', 'clicks', 'conversions', 'spend', 'revenue',
        'created_at', 'updated_at'
    ]


@admin.register(CampaignPerformanceMetrics)
class CampaignPerformanceMetricsAdmin(admin.ModelAdmin):
    list_display = [
        'campaign', 'date', 'channel', 'leads_generated',
        'closed_deals', 'spend', 'cost_per_lead', 'return_on_ad_spend'
    ]
    list_filter = ['date', 'channel', 'campaign__campaign_type']
    search_fields = ['campaign__name']
    readonly_fields = ['created_at']
    date_hierarchy = 'date'