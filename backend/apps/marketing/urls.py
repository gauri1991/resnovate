from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MarketingCampaignViewSet,
    ContentTemplateViewSet,
    SocialMediaCampaignViewSet,
    PaidCampaignViewSet,
    CampaignOrchestrationViewSet,
    CampaignPerformanceMetricsViewSet,
    EmailSequenceViewSet,
    EmailTemplateViewSet,
    BehavioralTriggerViewSet,
    EmailEngagementViewSet,
    EmailAutomationRuleViewSet,
    EmailABTestViewSet,
    LandingPageViewSet,
    PageVariantViewSet,
    ConversionFunnelViewSet,
    FunnelStepViewSet,
    ConversionOptimizationViewSet,
    UserJourneyViewSet,
    ExitIntentTriggerViewSet,
    WorkflowTemplateViewSet,
    MarketingWorkflowViewSet,
    WorkflowStepViewSet,
    WorkflowParticipantViewSet,
    WorkflowExecutionViewSet,
    WorkflowAnalyticsViewSet,
    WorkflowTriggerViewSet,
    WorkflowActionViewSet
)
from .analytics_views import (
    AttributionModelViewSet,
    CustomerJourneyViewSet,
    TouchpointEventViewSet,
    PredictiveModelViewSet,
    PredictionResultViewSet,
    MarketingROIViewSet,
    PerformanceDashboardViewSet,
    AnalyticsAlertViewSet
)

router = DefaultRouter()
router.register(r'campaigns', MarketingCampaignViewSet, basename='campaigns')
router.register(r'content-templates', ContentTemplateViewSet, basename='content-templates')
router.register(r'social-campaigns', SocialMediaCampaignViewSet, basename='social-campaigns')
router.register(r'paid-campaigns', PaidCampaignViewSet, basename='paid-campaigns')
router.register(r'orchestrations', CampaignOrchestrationViewSet, basename='orchestrations')
router.register(r'performance-metrics', CampaignPerformanceMetricsViewSet, basename='performance-metrics')

# Email Marketing & Automation
router.register(r'email-sequences', EmailSequenceViewSet, basename='email-sequences')
router.register(r'email-templates', EmailTemplateViewSet, basename='email-templates')
router.register(r'behavioral-triggers', BehavioralTriggerViewSet, basename='behavioral-triggers')
router.register(r'email-engagement', EmailEngagementViewSet, basename='email-engagement')
router.register(r'email-automation-rules', EmailAutomationRuleViewSet, basename='email-automation-rules')
router.register(r'email-ab-tests', EmailABTestViewSet, basename='email-ab-tests')

# Conversion Optimization Engine
router.register(r'landing-pages', LandingPageViewSet, basename='landing-pages')
router.register(r'page-variants', PageVariantViewSet, basename='page-variants')
router.register(r'conversion-funnels', ConversionFunnelViewSet, basename='conversion-funnels')
router.register(r'funnel-steps', FunnelStepViewSet, basename='funnel-steps')
router.register(r'conversion-optimizations', ConversionOptimizationViewSet, basename='conversion-optimizations')
router.register(r'user-journeys', UserJourneyViewSet, basename='user-journeys')
router.register(r'exit-intent-triggers', ExitIntentTriggerViewSet, basename='exit-intent-triggers')

# Marketing Automation Workflows
router.register(r'workflow-templates', WorkflowTemplateViewSet, basename='workflow-templates')
router.register(r'workflows', MarketingWorkflowViewSet, basename='workflows')
router.register(r'workflow-steps', WorkflowStepViewSet, basename='workflow-steps')
router.register(r'workflow-participants', WorkflowParticipantViewSet, basename='workflow-participants')
router.register(r'workflow-executions', WorkflowExecutionViewSet, basename='workflow-executions')
router.register(r'workflow-analytics', WorkflowAnalyticsViewSet, basename='workflow-analytics')
router.register(r'workflow-triggers', WorkflowTriggerViewSet, basename='workflow-triggers')
router.register(r'workflow-actions', WorkflowActionViewSet, basename='workflow-actions')

# Advanced Analytics & Attribution
router.register(r'attribution-models', AttributionModelViewSet, basename='attribution-models')
router.register(r'customer-journeys', CustomerJourneyViewSet, basename='customer-journeys')
router.register(r'touchpoint-events', TouchpointEventViewSet, basename='touchpoint-events')
router.register(r'predictive-models', PredictiveModelViewSet, basename='predictive-models')
router.register(r'prediction-results', PredictionResultViewSet, basename='prediction-results')
router.register(r'marketing-roi', MarketingROIViewSet, basename='marketing-roi')
router.register(r'performance-dashboards', PerformanceDashboardViewSet, basename='performance-dashboards')
router.register(r'analytics-alerts', AnalyticsAlertViewSet, basename='analytics-alerts')

app_name = 'marketing'

urlpatterns = [
    path('', include(router.urls)),
]