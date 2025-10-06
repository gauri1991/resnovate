from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
import random

from .models import (
    MarketingCampaign,
    ContentTemplate,
    CampaignOrchestration,
    SocialMediaCampaign,
    PaidCampaign,
    CampaignPerformanceMetrics
)
from .email_models import (
    EmailSequence,
    EmailTemplate,
    BehavioralTrigger,
    EmailEngagement,
    EmailAutomationRule,
    EmailABTest
)
from .conversion_models import (
    LandingPage,
    PageVariant,
    ConversionFunnel,
    FunnelStep,
    ConversionOptimization,
    UserJourney,
    ExitIntentTrigger
)
from .workflow_models import (
    WorkflowTemplate,
    MarketingWorkflow,
    WorkflowStep,
    WorkflowParticipant,
    WorkflowExecution,
    WorkflowAnalytics,
    WorkflowTrigger,
    WorkflowAction
)
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
from .serializers import (
    MarketingCampaignSerializer,
    MarketingCampaignCreateSerializer,
    ContentTemplateSerializer,
    CampaignOrchestrationSerializer,
    SocialMediaCampaignSerializer,
    PaidCampaignSerializer,
    CampaignPerformanceMetricsSerializer,
    CampaignSummarySerializer,
    CampaignOptimizationSerializer
)
from .email_serializers import (
    EmailSequenceSerializer,
    EmailSequenceCreateSerializer,
    EmailTemplateSerializer,
    EmailTemplateCreateSerializer,
    BehavioralTriggerSerializer,
    BehavioralTriggerCreateSerializer,
    EmailEngagementSerializer,
    EmailAutomationRuleSerializer,
    EmailABTestSerializer,
    EmailSequenceSummarySerializer
)
from .conversion_serializers import (
    LandingPageSerializer,
    LandingPageCreateSerializer,
    PageVariantSerializer,
    ConversionFunnelSerializer,
    FunnelStepSerializer,
    ConversionOptimizationSerializer,
    UserJourneySerializer,
    ExitIntentTriggerSerializer,
    LandingPageSummarySerializer,
    ConversionOptimizationSummarySerializer,
    FunnelAnalysisSerializer,
    ABTestResultsSerializer
)
from .workflow_serializers import (
    WorkflowTemplateSerializer,
    MarketingWorkflowSerializer,
    WorkflowDetailSerializer,
    WorkflowStepSerializer,
    WorkflowParticipantSerializer,
    WorkflowExecutionSerializer,
    WorkflowAnalyticsSerializer,
    WorkflowTriggerSerializer,
    WorkflowActionSerializer,
    WorkflowSummarySerializer,
    WorkflowPerformanceSerializer,
    WorkflowTemplateStatsSerializer
)
from .analytics_serializers import (
    AttributionModelSerializer,
    CustomerJourneySerializer,
    CustomerJourneySummarySerializer,
    TouchpointEventSerializer,
    PredictiveModelSerializer,
    PredictionResultSerializer,
    MarketingROISerializer,
    PerformanceDashboardSerializer,
    AnalyticsAlertSerializer,
    AttributionSummarySerializer,
    JourneyAnalyticsSerializer,
    PredictiveAnalyticsSerializer,
    ROIAnalyticsSerializer,
    PerformanceOverviewSerializer
)


class MarketingCampaignViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing marketing campaigns
    Supports CRUD operations plus analytics and optimization
    """
    queryset = MarketingCampaign.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MarketingCampaignCreateSerializer
        return MarketingCampaignSerializer
    
    def get_queryset(self):
        queryset = MarketingCampaign.objects.all()
        
        # Filter by campaign type
        campaign_type = self.request.query_params.get('type')
        if campaign_type:
            queryset = queryset.filter(campaign_type=campaign_type)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by objective
        objective = self.request.query_params.get('objective')
        if objective:
            queryset = queryset.filter(objective=objective)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(start_date__lte=end_date)
        
        # Search by name
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        # Order by
        ordering = self.request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)
        
        return queryset
    
    @action(detail=False, methods=['GET'])
    def dashboard_summary(self, request):
        """Get campaign dashboard summary with key metrics"""
        campaigns = MarketingCampaign.objects.all()
        
        # Calculate aggregated metrics
        summary_data = {
            'total_campaigns': campaigns.count(),
            'active_campaigns': campaigns.filter(status='active').count(),
            'total_spend': campaigns.aggregate(total=Sum('spent'))['total'] or 0,
            'total_revenue': campaigns.aggregate(total=Sum('revenue_generated'))['total'] or 0,
            'total_leads': campaigns.aggregate(total=Sum('leads_generated'))['total'] or 0,
            'total_conversions': campaigns.aggregate(total=Sum('conversions'))['total'] or 0,
            'average_roas': campaigns.aggregate(avg=Avg('return_on_ad_spend'))['avg'] or 0,
            'average_cpl': campaigns.aggregate(avg=Avg('cost_per_lead'))['avg'] or 0,
            'top_performing_campaigns': campaigns.order_by('-ai_performance_score')[:5],
            'channel_performance': self._get_channel_performance()
        }
        
        serializer = CampaignSummarySerializer(summary_data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['POST'])
    def optimize(self, request, pk=None):
        """AI-powered campaign optimization"""
        campaign = self.get_object()
        
        # Generate AI optimization suggestions (mock implementation)
        suggestions = self._generate_optimization_suggestions(campaign)
        
        # Update campaign with optimization suggestions
        campaign.optimization_suggestions = suggestions
        campaign.save()
        
        serializer = CampaignOptimizationSerializer(suggestions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['POST'])
    def duplicate(self, request, pk=None):
        """Duplicate an existing campaign"""
        original_campaign = self.get_object()
        
        # Create a copy with modified name
        campaign_copy = MarketingCampaign.objects.get(pk=pk)
        campaign_copy.pk = None
        campaign_copy.name = f"{original_campaign.name} (Copy)"
        campaign_copy.status = 'draft'
        campaign_copy.created_by = request.user
        campaign_copy.spent = 0
        campaign_copy.impressions = 0
        campaign_copy.clicks = 0
        campaign_copy.leads_generated = 0
        campaign_copy.conversions = 0
        campaign_copy.revenue_generated = 0
        campaign_copy.save()
        
        serializer = self.get_serializer(campaign_copy)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['POST'])
    def pause(self, request, pk=None):
        """Pause a campaign"""
        campaign = self.get_object()
        campaign.status = 'paused'
        campaign.save()
        return Response({'status': 'Campaign paused'})
    
    @action(detail=True, methods=['POST'])
    def resume(self, request, pk=None):
        """Resume a paused campaign"""
        campaign = self.get_object()
        campaign.status = 'active'
        campaign.save()
        return Response({'status': 'Campaign resumed'})
    
    @action(detail=True, methods=['GET'])
    def performance_metrics(self, request, pk=None):
        """Get detailed performance metrics for a campaign"""
        campaign = self.get_object()
        
        # Get daily metrics for the last 30 days
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        daily_metrics = CampaignPerformanceMetrics.objects.filter(
            campaign=campaign,
            date__range=[start_date, end_date]
        ).order_by('date')
        
        serializer = CampaignPerformanceMetricsSerializer(daily_metrics, many=True)
        return Response(serializer.data)
    
    def _get_channel_performance(self):
        """Calculate performance by channel"""
        channel_data = {}
        campaigns = MarketingCampaign.objects.filter(status='active')
        
        for campaign in campaigns:
            for channel in campaign.channels:
                if channel not in channel_data:
                    channel_data[channel] = {
                        'spend': 0,
                        'leads': 0,
                        'conversions': 0,
                        'revenue': 0
                    }
                
                # Distribute metrics across channels (simplified)
                channel_weight = 1 / len(campaign.channels)
                channel_data[channel]['spend'] += float(campaign.spent) * channel_weight
                channel_data[channel]['leads'] += campaign.leads_generated * channel_weight
                channel_data[channel]['conversions'] += campaign.conversions * channel_weight
                channel_data[channel]['revenue'] += float(campaign.revenue_generated) * channel_weight
        
        return channel_data
    
    def _generate_optimization_suggestions(self, campaign):
        """Generate AI optimization suggestions (mock implementation)"""
        suggestions = []
        
        # Budget optimization
        if campaign.budget and campaign.spent < campaign.budget * 0.5:
            suggestions.append({
                'campaign_id': campaign.id,
                'optimization_type': 'budget',
                'suggestion': 'Increase daily budget by 25% to capture more opportunities',
                'expected_improvement': '+15-20% more leads',
                'confidence_score': 0.85,
                'implementation_effort': 'Low',
                'priority': 'High'
            })
        
        # Targeting optimization
        if campaign.click_through_rate < 2.0:
            suggestions.append({
                'campaign_id': campaign.id,
                'optimization_type': 'targeting',
                'suggestion': 'Refine audience targeting based on high-performing segments',
                'expected_improvement': '+30-40% CTR improvement',
                'confidence_score': 0.78,
                'implementation_effort': 'Medium',
                'priority': 'High'
            })
        
        # Content optimization
        if campaign.conversion_rate < 5.0:
            suggestions.append({
                'campaign_id': campaign.id,
                'optimization_type': 'content',
                'suggestion': 'A/B test new messaging focused on AI transformation benefits',
                'expected_improvement': '+25-35% conversion rate',
                'confidence_score': 0.72,
                'implementation_effort': 'Medium',
                'priority': 'Medium'
            })
        
        # Bidding optimization
        if hasattr(campaign, 'paid_campaigns') and not campaign.auto_bidding:
            suggestions.append({
                'campaign_id': campaign.id,
                'optimization_type': 'bidding',
                'suggestion': 'Enable auto-bidding for better performance optimization',
                'expected_improvement': '+10-15% efficiency improvement',
                'confidence_score': 0.90,
                'implementation_effort': 'Low',
                'priority': 'Medium'
            })
        
        return suggestions


class ContentTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for managing content templates"""
    queryset = ContentTemplate.objects.all()
    serializer_class = ContentTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = ContentTemplate.objects.all()
        
        # Filter by content type
        content_type = self.request.query_params.get('type')
        if content_type:
            queryset = queryset.filter(content_type=content_type)
        
        # Filter by stage
        stage = self.request.query_params.get('stage')
        if stage:
            queryset = queryset.filter(stage=stage)
        
        # Filter by industry
        industry = self.request.query_params.get('industry')
        if industry:
            queryset = queryset.filter(industry=industry)
        
        # Order by performance
        ordering = self.request.query_params.get('ordering', '-average_conversion_rate')
        queryset = queryset.order_by(ordering)
        
        return queryset
    
    @action(detail=False, methods=['GET'])
    def top_performing(self, request):
        """Get top performing content templates"""
        templates = ContentTemplate.objects.filter(
            usage_count__gt=0
        ).order_by('-average_conversion_rate')[:10]
        
        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)


class SocialMediaCampaignViewSet(viewsets.ModelViewSet):
    """ViewSet for managing social media campaigns"""
    queryset = SocialMediaCampaign.objects.all()
    serializer_class = SocialMediaCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = SocialMediaCampaign.objects.all()
        
        # Filter by platform
        platform = self.request.query_params.get('platform')
        if platform:
            queryset = queryset.filter(platform=platform)
        
        # Filter by campaign type
        campaign_type = self.request.query_params.get('type')
        if campaign_type:
            queryset = queryset.filter(campaign_type=campaign_type)
        
        return queryset.order_by('-created_at')


class PaidCampaignViewSet(viewsets.ModelViewSet):
    """ViewSet for managing paid advertising campaigns"""
    queryset = PaidCampaign.objects.all()
    serializer_class = PaidCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = PaidCampaign.objects.all()
        
        # Filter by platform
        platform = self.request.query_params.get('platform')
        if platform:
            queryset = queryset.filter(platform=platform)
        
        # Filter by campaign type
        campaign_type = self.request.query_params.get('type')
        if campaign_type:
            queryset = queryset.filter(campaign_type=campaign_type)
        
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['GET'])
    def performance_summary(self, request):
        """Get performance summary for paid campaigns"""
        campaigns = self.get_queryset()
        
        summary = {
            'total_spend': campaigns.aggregate(total=Sum('spend'))['total'] or 0,
            'total_revenue': campaigns.aggregate(total=Sum('revenue'))['total'] or 0,
            'total_impressions': campaigns.aggregate(total=Sum('impressions'))['total'] or 0,
            'total_clicks': campaigns.aggregate(total=Sum('clicks'))['total'] or 0,
            'total_conversions': campaigns.aggregate(total=Sum('conversions'))['total'] or 0,
            'average_cpc': campaigns.aggregate(avg=Avg('spend'))['avg'] or 0,
            'platform_breakdown': self._get_platform_breakdown(campaigns)
        }
        
        return Response(summary)
    
    def _get_platform_breakdown(self, campaigns):
        """Get performance breakdown by platform"""
        platforms = campaigns.values('platform').annotate(
            total_spend=Sum('spend'),
            total_conversions=Sum('conversions'),
            total_impressions=Sum('impressions')
        )
        return list(platforms)


class CampaignOrchestrationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing campaign orchestration"""
    queryset = CampaignOrchestration.objects.all()
    serializer_class = CampaignOrchestrationSerializer
    permission_classes = [permissions.IsAuthenticated]


class CampaignPerformanceMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for campaign performance metrics (read-only)"""
    queryset = CampaignPerformanceMetrics.objects.all()
    serializer_class = CampaignPerformanceMetricsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = CampaignPerformanceMetrics.objects.all()
        
        # Filter by campaign
        campaign_id = self.request.query_params.get('campaign')
        if campaign_id:
            queryset = queryset.filter(campaign_id=campaign_id)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Filter by channel
        channel = self.request.query_params.get('channel')
        if channel:
            queryset = queryset.filter(channel=channel)
        
        return queryset.order_by('-date')


# Email Marketing ViewSets

class EmailSequenceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing email sequences
    """
    queryset = EmailSequence.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EmailSequenceCreateSerializer
        return EmailSequenceSerializer
    
    def get_queryset(self):
        queryset = EmailSequence.objects.all()
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by trigger event
        trigger_event = self.request.query_params.get('trigger_event')
        if trigger_event:
            queryset = queryset.filter(trigger_event=trigger_event)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['POST'])
    def pause(self, request, pk=None):
        """Pause an email sequence"""
        sequence = self.get_object()
        sequence.status = 'paused'
        sequence.save()
        return Response({'status': 'paused'})
    
    @action(detail=True, methods=['POST'])
    def resume(self, request, pk=None):
        """Resume an email sequence"""
        sequence = self.get_object()
        sequence.status = 'active'
        sequence.save()
        return Response({'status': 'active'})
    
    @action(detail=False, methods=['GET'])
    def summary(self, request):
        """Get email sequence summary statistics"""
        sequences = self.get_queryset()
        
        summary = {
            'total_sequences': sequences.count(),
            'active_sequences': sequences.filter(status='active').count(),
            'total_sent': sequences.aggregate(total=Sum('total_sent'))['total'] or 0,
            'total_opened': sequences.aggregate(total=Sum('total_opened'))['total'] or 0,
            'total_clicked': sequences.aggregate(total=Sum('total_clicked'))['total'] or 0,
            'total_conversions': sequences.aggregate(total=Sum('total_conversions'))['total'] or 0,
            'average_open_rate': sequences.aggregate(avg=Avg('open_rate'))['avg'] or 0,
            'average_click_rate': sequences.aggregate(avg=Avg('click_rate'))['avg'] or 0,
            'average_conversion_rate': sequences.aggregate(avg=Avg('conversion_rate'))['avg'] or 0,
        }
        
        serializer = EmailSequenceSummarySerializer(summary)
        return Response(serializer.data)


class EmailTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing email templates
    """
    queryset = EmailTemplate.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EmailTemplateCreateSerializer
        return EmailTemplateSerializer
    
    def get_queryset(self):
        queryset = EmailTemplate.objects.all()
        
        # Filter by template type
        template_type = self.request.query_params.get('type')
        if template_type:
            queryset = queryset.filter(template_type=template_type)
        
        # Filter by performance score
        min_score = self.request.query_params.get('min_score')
        if min_score:
            queryset = queryset.filter(performance_score__gte=min_score)
        
        # Filter AI generated
        ai_generated = self.request.query_params.get('ai_generated')
        if ai_generated is not None:
            queryset = queryset.filter(ai_generated=ai_generated.lower() == 'true')
        
        return queryset.order_by('-performance_score', '-created_at')
    
    @action(detail=False, methods=['GET'])
    def top_performing(self, request):
        """Get top performing email templates"""
        templates = self.get_queryset().filter(
            performance_score__gte=80,
            usage_count__gte=10
        )[:10]
        
        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)


class BehavioralTriggerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing behavioral triggers
    """
    queryset = BehavioralTrigger.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BehavioralTriggerCreateSerializer
        return BehavioralTriggerSerializer
    
    def get_queryset(self):
        queryset = BehavioralTrigger.objects.all()
        
        # Filter by trigger type
        trigger_type = self.request.query_params.get('trigger_type')
        if trigger_type:
            queryset = queryset.filter(trigger_type=trigger_type)
        
        # Filter by active status
        active = self.request.query_params.get('active')
        if active is not None:
            queryset = queryset.filter(active=active.lower() == 'true')
        
        # Filter by action type
        action_type = self.request.query_params.get('action_type')
        if action_type:
            queryset = queryset.filter(action_type=action_type)
        
        return queryset.order_by('-priority', '-times_triggered')
    
    @action(detail=True, methods=['POST'])
    def toggle(self, request, pk=None):
        """Toggle trigger active status"""
        trigger = self.get_object()
        trigger.active = not trigger.active
        trigger.save()
        return Response({'active': trigger.active})
    
    @action(detail=False, methods=['GET'])
    def performance_summary(self, request):
        """Get behavioral trigger performance summary"""
        triggers = self.get_queryset()
        
        summary = {
            'total_triggers': triggers.count(),
            'active_triggers': triggers.filter(active=True).count(),
            'total_triggered': triggers.aggregate(total=Sum('times_triggered'))['total'] or 0,
            'total_successful': triggers.aggregate(total=Sum('successful_actions'))['total'] or 0,
            'average_conversion_rate': triggers.aggregate(avg=Avg('conversion_rate'))['avg'] or 0,
            'top_performing': self._get_top_performing_triggers(triggers)
        }
        
        return Response(summary)
    
    def _get_top_performing_triggers(self, triggers):
        """Get top performing triggers by conversion rate"""
        top_triggers = triggers.filter(
            times_triggered__gte=10
        ).order_by('-conversion_rate')[:5]
        
        return [
            {
                'id': t.id,
                'name': t.name,
                'conversion_rate': t.conversion_rate,
                'times_triggered': t.times_triggered
            }
            for t in top_triggers
        ]


class EmailEngagementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for email engagement tracking (read-only)
    """
    queryset = EmailEngagement.objects.all()
    serializer_class = EmailEngagementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = EmailEngagement.objects.all()
        
        # Filter by email sequence
        sequence_id = self.request.query_params.get('sequence')
        if sequence_id:
            queryset = queryset.filter(email_sequence_id=sequence_id)
        
        # Filter by lead
        lead_id = self.request.query_params.get('lead')
        if lead_id:
            queryset = queryset.filter(lead_id=lead_id)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(sent_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(sent_at__lte=end_date)
        
        return queryset.order_by('-sent_at')


class EmailAutomationRuleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing email automation rules
    """
    queryset = EmailAutomationRule.objects.all()
    serializer_class = EmailAutomationRuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = EmailAutomationRule.objects.all()
        
        # Filter by active status
        active = self.request.query_params.get('active')
        if active is not None:
            queryset = queryset.filter(active=active.lower() == 'true')
        
        return queryset.order_by('execution_order', '-created_at')


class EmailABTestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing email A/B tests
    """
    queryset = EmailABTest.objects.all()
    serializer_class = EmailABTestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = EmailABTest.objects.all()
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by email sequence
        sequence_id = self.request.query_params.get('sequence')
        if sequence_id:
            queryset = queryset.filter(email_sequence_id=sequence_id)
        
        return queryset.order_by('-started_at')


# Conversion Optimization ViewSets

class LandingPageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing landing pages
    """
    queryset = LandingPage.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LandingPageCreateSerializer
        return LandingPageSerializer
    
    def get_queryset(self):
        queryset = LandingPage.objects.all()
        
        # Filter by page type
        page_type = self.request.query_params.get('page_type')
        if page_type:
            queryset = queryset.filter(page_type=page_type)
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by optimization goal
        goal = self.request.query_params.get('goal')
        if goal:
            queryset = queryset.filter(optimization_goal=goal)
        
        # Filter by A/B testing
        testing = self.request.query_params.get('testing')
        if testing is not None:
            queryset = queryset.filter(ab_testing_enabled=testing.lower() == 'true')
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['POST'])
    def publish(self, request, pk=None):
        """Publish a landing page"""
        page = self.get_object()
        page.status = 'published'
        page.published_at = timezone.now()
        page.save()
        return Response({'status': 'published'})
    
    @action(detail=True, methods=['POST'])
    def duplicate(self, request, pk=None):
        """Duplicate a landing page"""
        page = self.get_object()
        new_page = LandingPage.objects.create(
            name=f"{page.name} (Copy)",
            slug=f"{page.slug}-copy",
            description=page.description,
            page_type=page.page_type,
            optimization_goal=page.optimization_goal,
            page_structure=page.page_structure,
            content_blocks=page.content_blocks,
            design_template=page.design_template,
            created_by=request.user
        )
        serializer = self.get_serializer(new_page)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['GET'])
    def summary(self, request):
        """Get landing page summary statistics"""
        pages = self.get_queryset()
        
        summary = {
            'total_pages': pages.count(),
            'published_pages': pages.filter(status='published').count(),
            'testing_pages': pages.filter(ab_testing_enabled=True, status='testing').count(),
            'total_views': pages.aggregate(total=Sum('views'))['total'] or 0,
            'total_conversions': pages.aggregate(total=Sum('conversions'))['total'] or 0,
            'average_conversion_rate': pages.aggregate(avg=Avg('conversion_rate'))['avg'] or 0,
            'average_bounce_rate': pages.aggregate(avg=Avg('bounce_rate'))['avg'] or 0,
        }
        
        serializer = LandingPageSummarySerializer(summary)
        return Response(serializer.data)


class PageVariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing page variants (A/B testing)
    """
    queryset = PageVariant.objects.all()
    serializer_class = PageVariantSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = PageVariant.objects.all()
        
        # Filter by landing page
        landing_page_id = self.request.query_params.get('landing_page')
        if landing_page_id:
            queryset = queryset.filter(landing_page_id=landing_page_id)
        
        # Filter by active status
        active = self.request.query_params.get('active')
        if active is not None:
            queryset = queryset.filter(is_active=active.lower() == 'true')
        
        return queryset.order_by('landing_page', 'variant_key')
    
    @action(detail=True, methods=['POST'])
    def declare_winner(self, request, pk=None):
        """Declare a variant as the winner"""
        variant = self.get_object()
        
        # Mark this variant as winner
        variant.is_winner = True
        variant.save()
        
        # Mark other variants as losers
        PageVariant.objects.filter(
            landing_page=variant.landing_page
        ).exclude(id=variant.id).update(is_winner=False, is_active=False)
        
        return Response({'status': 'winner_declared', 'variant': variant.variant_key})


class ConversionFunnelViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing conversion funnels
    """
    queryset = ConversionFunnel.objects.all()
    serializer_class = ConversionFunnelSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = ConversionFunnel.objects.all()
        
        # Filter by funnel type
        funnel_type = self.request.query_params.get('type')
        if funnel_type:
            queryset = queryset.filter(funnel_type=funnel_type)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['POST'])
    def analyze(self, request, pk=None):
        """Analyze funnel performance"""
        funnel = self.get_object()
        
        # Mock analysis - in real implementation, this would calculate actual metrics
        analysis_results = {
            'funnel_id': funnel.id,
            'funnel_name': funnel.name,
            'steps': [
                {
                    'step_number': step.step_number,
                    'step_name': step.step_name,
                    'entries': step.entries,
                    'completions': step.completions,
                    'completion_rate': step.completion_rate,
                    'dropoff_rate': step.dropoff_rate
                }
                for step in funnel.funnel_steps.all()
            ],
            'overall_conversion_rate': funnel.completion_rate,
            'biggest_dropoff': {
                'step_number': funnel.biggest_dropoff_step,
                'dropoff_rate': funnel.dropoff_rate
            },
            'optimization_suggestions': funnel.optimization_suggestions
        }
        
        # Update last analyzed timestamp
        funnel.last_analyzed = timezone.now()
        funnel.save()
        
        serializer = FunnelAnalysisSerializer(analysis_results)
        return Response(serializer.data)


class FunnelStepViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing funnel steps
    """
    queryset = FunnelStep.objects.all()
    serializer_class = FunnelStepSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = FunnelStep.objects.all()
        
        # Filter by funnel
        funnel_id = self.request.query_params.get('funnel')
        if funnel_id:
            queryset = queryset.filter(funnel_id=funnel_id)
        
        return queryset.order_by('funnel', 'step_number')


class ConversionOptimizationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing conversion optimization experiments
    """
    queryset = ConversionOptimization.objects.all()
    serializer_class = ConversionOptimizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = ConversionOptimization.objects.all()
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by experiment type
        experiment_type = self.request.query_params.get('type')
        if experiment_type:
            queryset = queryset.filter(experiment_type=experiment_type)
        
        # Filter by target page
        target_page_id = self.request.query_params.get('target_page')
        if target_page_id:
            queryset = queryset.filter(target_page_id=target_page_id)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['POST'])
    def start_test(self, request, pk=None):
        """Start an A/B test"""
        optimization = self.get_object()
        optimization.status = 'testing'
        optimization.start_date = timezone.now()
        optimization.save()
        return Response({'status': 'test_started'})
    
    @action(detail=True, methods=['POST'])
    def stop_test(self, request, pk=None):
        """Stop an A/B test"""
        optimization = self.get_object()
        optimization.status = 'completed'
        optimization.end_date = timezone.now()
        optimization.save()
        return Response({'status': 'test_stopped'})
    
    @action(detail=True, methods=['GET'])
    def results(self, request, pk=None):
        """Get test results"""
        optimization = self.get_object()
        
        # Mock results - in real implementation, calculate from actual data
        results = {
            'test_id': optimization.id,
            'test_name': optimization.name,
            'status': optimization.status,
            'variants': optimization.variations,
            'winner': optimization.winning_variation,
            'confidence_level': optimization.confidence_level,
            'improvement': optimization.improvement_percentage,
            'statistical_significance': optimization.statistical_significance,
            'recommendation': self._get_recommendation(optimization)
        }
        
        serializer = ABTestResultsSerializer(results)
        return Response(serializer.data)
    
    def _get_recommendation(self, optimization):
        """Generate recommendation based on test results"""
        if optimization.statistical_significance and optimization.improvement_percentage > 5:
            return f"Implement {optimization.winning_variation} - significant improvement of {optimization.improvement_percentage:.1f}%"
        elif optimization.statistical_significance:
            return "Test shows statistical significance but minimal impact. Consider testing bigger changes."
        else:
            return "Test is inconclusive. Consider running longer or with larger sample size."
    
    @action(detail=False, methods=['GET'])
    def summary(self, request):
        """Get optimization summary statistics"""
        experiments = self.get_queryset()
        
        summary = {
            'total_experiments': experiments.count(),
            'running_experiments': experiments.filter(status='testing').count(),
            'completed_experiments': experiments.filter(status='completed').count(),
            'successful_experiments': experiments.filter(
                statistical_significance=True,
                improvement_percentage__gt=0
            ).count(),
            'average_improvement': experiments.filter(
                statistical_significance=True
            ).aggregate(avg=Avg('improvement_percentage'))['avg'] or 0,
            'total_impact': 0  # Mock value - calculate from actual revenue impact
        }
        
        serializer = ConversionOptimizationSummarySerializer(summary)
        return Response(serializer.data)


class UserJourneyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user journeys
    """
    queryset = UserJourney.objects.all()
    serializer_class = UserJourneySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = UserJourney.objects.all()
        
        # Filter by journey type
        journey_type = self.request.query_params.get('type')
        if journey_type:
            queryset = queryset.filter(journey_type=journey_type)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['POST'])
    def analyze_journey(self, request, pk=None):
        """Analyze customer journey"""
        journey = self.get_object()
        
        # Mock analysis - in real implementation, analyze actual user data
        insights = {
            'journey_id': journey.id,
            'journey_name': journey.name,
            'most_common_path': journey.expected_path,
            'completion_rate': journey.completion_rate,
            'average_time': str(journey.avg_journey_time) if journey.avg_journey_time else "N/A",
            'friction_points': journey.friction_points,
            'improvement_opportunities': journey.optimization_opportunities,
            'segment_performance': journey.segment_performance
        }
        
        return Response(insights)


class ExitIntentTriggerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exit intent triggers
    """
    queryset = ExitIntentTrigger.objects.all()
    serializer_class = ExitIntentTriggerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = ExitIntentTrigger.objects.all()
        
        # Filter by trigger type
        trigger_type = self.request.query_params.get('trigger_type')
        if trigger_type:
            queryset = queryset.filter(trigger_type=trigger_type)
        
        # Filter by active status
        active = self.request.query_params.get('active')
        if active is not None:
            queryset = queryset.filter(active=active.lower() == 'true')
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['POST'])
    def toggle(self, request, pk=None):
        """Toggle trigger active status"""
        trigger = self.get_object()
        trigger.active = not trigger.active
        trigger.save()
        return Response({'active': trigger.active})
    
    @action(detail=False, methods=['GET'])
    def performance_summary(self, request):
        """Get exit intent trigger performance summary"""
        triggers = self.get_queryset()
        
        summary = {
            'total_triggers': triggers.count(),
            'active_triggers': triggers.filter(active=True).count(),
            'total_fired': triggers.aggregate(total=Sum('triggers_fired'))['total'] or 0,
            'total_conversions': triggers.aggregate(total=Sum('conversions'))['total'] or 0,
            'average_conversion_rate': triggers.aggregate(avg=Avg('conversion_rate'))['avg'] or 0,
            'top_performing': self._get_top_performing_triggers(triggers)
        }
        
        return Response(summary)
    
    def _get_top_performing_triggers(self, triggers):
        """Get top performing triggers by conversion rate"""
        top_triggers = triggers.filter(
            triggers_fired__gte=10
        ).order_by('-conversion_rate')[:5]
        
        return [
            {
                'id': t.id,
                'name': t.name,
                'conversion_rate': t.conversion_rate,
                'triggers_fired': t.triggers_fired
            }
            for t in top_triggers
        ]


# Marketing Automation Workflow ViewSets
class WorkflowTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for workflow templates"""
    queryset = WorkflowTemplate.objects.all()
    serializer_class = WorkflowTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = WorkflowTemplate.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter featured templates
        featured = self.request.query_params.get('featured')
        if featured:
            queryset = queryset.filter(is_featured=True)
            
        return queryset
    
    @action(detail=False, methods=['GET'])
    def categories(self, request):
        """Get available template categories"""
        categories = dict(WorkflowTemplate.TEMPLATE_CATEGORIES)
        return Response(categories)
    
    @action(detail=False, methods=['GET'])
    def stats(self, request):
        """Get template usage statistics"""
        templates = self.get_queryset()
        stats = []
        
        for template in templates:
            stats.append({
                'template_id': template.id,
                'template_name': template.name,
                'category': template.category,
                'usage_count': template.usage_count,
                'avg_performance': template.avg_performance_score,
                'success_rate': 85.0 + random.uniform(-15, 10)  # Mock data
            })
        
        serializer = WorkflowTemplateStatsSerializer(stats, many=True)
        return Response(serializer.data)

class MarketingWorkflowViewSet(viewsets.ModelViewSet):
    """ViewSet for marketing workflows"""
    queryset = MarketingWorkflow.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return WorkflowDetailSerializer
        return MarketingWorkflowSerializer
    
    def get_queryset(self):
        queryset = MarketingWorkflow.objects.all()
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by trigger type
        trigger_type = self.request.query_params.get('trigger_type')
        if trigger_type:
            queryset = queryset.filter(trigger_type=trigger_type)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['POST'])
    def activate(self, request, pk=None):
        """Activate a workflow"""
        workflow = self.get_object()
        workflow.status = 'active'
        workflow.start_date = timezone.now()
        workflow.save()
        
        return Response({'status': 'activated'})
    
    @action(detail=True, methods=['POST'])
    def pause(self, request, pk=None):
        """Pause a workflow"""
        workflow = self.get_object()
        workflow.status = 'paused'
        workflow.save()
        
        return Response({'status': 'paused'})
    
    @action(detail=True, methods=['POST'])
    def duplicate(self, request, pk=None):
        """Duplicate a workflow"""
        workflow = self.get_object()
        
        # Create duplicate with modified name
        duplicate_workflow = MarketingWorkflow.objects.create(
            name=f"{workflow.name} (Copy)",
            description=workflow.description,
            trigger_type=workflow.trigger_type,
            trigger_config=workflow.trigger_config,
            entry_conditions=workflow.entry_conditions,
            exit_conditions=workflow.exit_conditions,
            workflow_steps=workflow.workflow_steps,
            decision_logic=workflow.decision_logic,
            max_participants=workflow.max_participants,
            execution_window=workflow.execution_window,
            frequency_cap=workflow.frequency_cap,
            is_recurring=workflow.is_recurring,
            created_by=self.request.user
        )
        
        serializer = self.get_serializer(duplicate_workflow)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['GET'])
    def summary(self, request):
        """Get workflow summary statistics"""
        workflows = self.get_queryset()
        
        summary = {
            'total_workflows': workflows.count(),
            'active_workflows': workflows.filter(status='active').count(),
            'paused_workflows': workflows.filter(status='paused').count(),
            'total_participants': workflows.aggregate(total=Sum('total_participants'))['total'] or 0,
            'active_participants': workflows.aggregate(total=Sum('active_participants'))['total'] or 0,
            'avg_conversion_rate': workflows.aggregate(avg=Avg('conversion_rate'))['avg'] or 0,
            'total_executions_today': 0,  # Would be calculated from WorkflowExecution
            'successful_executions_today': 0,
            'failed_executions_today': 0
        }
        
        serializer = WorkflowSummarySerializer(summary)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def performance(self, request):
        """Get workflow performance metrics"""
        workflows = self.get_queryset().filter(status='active')
        performance_data = []
        
        for workflow in workflows:
            performance_data.append({
                'workflow_id': workflow.id,
                'workflow_name': workflow.name,
                'participants': workflow.total_participants,
                'completion_rate': random.uniform(65, 95),  # Mock data
                'conversion_rate': workflow.conversion_rate,
                'avg_completion_time': workflow.avg_completion_time,
                'last_7_days_trend': {
                    'participants': [12, 15, 18, 14, 16, 20, 17],
                    'conversions': [3, 4, 5, 4, 4, 6, 5]
                }
            })
        
        serializer = WorkflowPerformanceSerializer(performance_data, many=True)
        return Response(serializer.data)

class WorkflowStepViewSet(viewsets.ModelViewSet):
    """ViewSet for workflow steps"""
    queryset = WorkflowStep.objects.all()
    serializer_class = WorkflowStepSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = WorkflowStep.objects.all()
        
        # Filter by workflow
        workflow_id = self.request.query_params.get('workflow')
        if workflow_id:
            queryset = queryset.filter(workflow_id=workflow_id)
            
        return queryset

class WorkflowParticipantViewSet(viewsets.ModelViewSet):
    """ViewSet for workflow participants"""
    queryset = WorkflowParticipant.objects.all()
    serializer_class = WorkflowParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = WorkflowParticipant.objects.all()
        
        # Filter by workflow
        workflow_id = self.request.query_params.get('workflow')
        if workflow_id:
            queryset = queryset.filter(workflow_id=workflow_id)
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset

class WorkflowExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for workflow executions (read-only)"""
    queryset = WorkflowExecution.objects.all()
    serializer_class = WorkflowExecutionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = WorkflowExecution.objects.all()
        
        # Filter by workflow participant
        participant_id = self.request.query_params.get('participant')
        if participant_id:
            queryset = queryset.filter(participant_id=participant_id)
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(
                started_at__range=[start_date, end_date]
            )
            
        return queryset

class WorkflowAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for workflow analytics"""
    queryset = WorkflowAnalytics.objects.all()
    serializer_class = WorkflowAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkflowTriggerViewSet(viewsets.ModelViewSet):
    """ViewSet for workflow triggers"""
    queryset = WorkflowTrigger.objects.all()
    serializer_class = WorkflowTriggerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = WorkflowTrigger.objects.all()
        
        # Filter by workflow
        workflow_id = self.request.query_params.get('workflow')
        if workflow_id:
            queryset = queryset.filter(workflow_id=workflow_id)
        
        # Filter by trigger type
        trigger_type = self.request.query_params.get('trigger_type')
        if trigger_type:
            queryset = queryset.filter(trigger_type=trigger_type)
            
        return queryset
    
    @action(detail=True, methods=['POST'])
    def toggle(self, request, pk=None):
        """Toggle trigger active status"""
        trigger = self.get_object()
        trigger.is_active = not trigger.is_active
        trigger.save()
        
        return Response({
            'is_active': trigger.is_active,
            'status': 'activated' if trigger.is_active else 'deactivated'
        })

class WorkflowActionViewSet(viewsets.ModelViewSet):
    """ViewSet for workflow actions"""
    queryset = WorkflowAction.objects.all()
    serializer_class = WorkflowActionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = WorkflowAction.objects.all()
        
        # Filter by action type
        action_type = self.request.query_params.get('action_type')
        if action_type:
            queryset = queryset.filter(action_type=action_type)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)