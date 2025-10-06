from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone
import random

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

# Advanced Analytics & Attribution ViewSets
class AttributionModelViewSet(viewsets.ModelViewSet):
    """ViewSet for attribution models"""
    queryset = AttributionModel.objects.all()
    serializer_class = AttributionModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = AttributionModel.objects.all()
        
        # Filter by attribution type
        attribution_type = self.request.query_params.get('attribution_type')
        if attribution_type:
            queryset = queryset.filter(attribution_type=attribution_type)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['POST'])
    def set_default(self, request, pk=None):
        """Set this model as the default attribution model"""
        # Unset all other default models
        AttributionModel.objects.filter(is_default=True).update(is_default=False)
        
        # Set this model as default
        model = self.get_object()
        model.is_default = True
        model.save()
        
        return Response({'status': 'set_as_default'})
    
    @action(detail=False, methods=['GET'])
    def summary(self, request):
        """Get attribution models summary"""
        models = self.get_queryset()
        
        summary = {
            'total_models': models.count(),
            'active_models': models.filter(is_active=True).count(),
            'default_model': models.filter(is_default=True).first().name if models.filter(is_default=True).exists() else 'None',
            'total_journeys_analyzed': CustomerJourney.objects.filter(attribution_model__isnull=False).count(),
            'avg_accuracy_score': models.aggregate(avg=Avg('accuracy_score'))['avg'] or 0
        }
        
        serializer = AttributionSummarySerializer(summary)
        return Response(serializer.data)

class CustomerJourneyViewSet(viewsets.ModelViewSet):
    """ViewSet for customer journeys"""
    queryset = CustomerJourney.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CustomerJourneySummarySerializer
        return CustomerJourneySerializer
    
    def get_queryset(self):
        queryset = CustomerJourney.objects.all()
        
        # Filter by customer
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        
        # Filter by stage
        stage = self.request.query_params.get('stage')
        if stage:
            queryset = queryset.filter(current_stage=stage)
        
        # Filter by completion status
        is_complete = self.request.query_params.get('is_complete')
        if is_complete is not None:
            queryset = queryset.filter(is_complete=is_complete.lower() == 'true')
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(start_timestamp__range=[start_date, end_date])
            
        return queryset
    
    @action(detail=False, methods=['GET'])
    def analytics(self, request):
        """Get journey analytics summary"""
        journeys = self.get_queryset()
        
        # Calculate analytics
        total_journeys = journeys.count()
        completed_journeys = journeys.filter(is_complete=True).count()
        avg_journey_length = journeys.aggregate(avg=Avg('path_length'))['avg'] or 0
        
        # Time to conversion
        completed_with_time = journeys.filter(is_complete=True, time_to_conversion__isnull=False)
        avg_time_to_conversion = 0
        if completed_with_time.exists():
            total_seconds = sum([j.time_to_conversion.total_seconds() for j in completed_with_time])
            avg_time_to_conversion = total_seconds / completed_with_time.count() / 3600  # Convert to hours
        
        # Top conversion paths
        top_paths = []
        # This would typically be calculated from actual data
        
        # Channel performance
        channel_performance = {}
        for journey in journeys.filter(is_complete=True):
            for channel in journey.channels_used:
                if channel not in channel_performance:
                    channel_performance[channel] = {'count': 0, 'total_value': 0}
                channel_performance[channel]['count'] += 1
                channel_performance[channel]['total_value'] += float(journey.total_value or 0)
        
        analytics = {
            'total_journeys': total_journeys,
            'completed_journeys': completed_journeys,
            'avg_journey_length': round(avg_journey_length, 2),
            'avg_time_to_conversion': round(avg_time_to_conversion, 2),
            'top_conversion_paths': top_paths,
            'channel_performance': channel_performance
        }
        
        serializer = JourneyAnalyticsSerializer(analytics)
        return Response(serializer.data)

class TouchpointEventViewSet(viewsets.ModelViewSet):
    """ViewSet for touchpoint events"""
    queryset = TouchpointEvent.objects.all()
    serializer_class = TouchpointEventSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = TouchpointEvent.objects.all()
        
        # Filter by journey
        journey_id = self.request.query_params.get('journey')
        if journey_id:
            queryset = queryset.filter(journey_id=journey_id)
        
        # Filter by channel
        channel = self.request.query_params.get('channel')
        if channel:
            queryset = queryset.filter(channel=channel)
        
        # Filter by event type
        event_type = self.request.query_params.get('event_type')
        if event_type:
            queryset = queryset.filter(event_type=event_type)
            
        return queryset

class PredictiveModelViewSet(viewsets.ModelViewSet):
    """ViewSet for predictive models"""
    queryset = PredictiveModel.objects.all()
    serializer_class = PredictiveModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = PredictiveModel.objects.all()
        
        # Filter by model type
        model_type = self.request.query_params.get('model_type')
        if model_type:
            queryset = queryset.filter(model_type=model_type)
        
        # Filter by training status
        is_trained = self.request.query_params.get('is_trained')
        if is_trained is not None:
            queryset = queryset.filter(is_trained=is_trained.lower() == 'true')
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['POST'])
    def train(self, request, pk=None):
        """Train the predictive model"""
        model = self.get_object()
        
        # Mock training process
        model.is_trained = True
        model.last_trained = timezone.now()
        model.accuracy = random.uniform(0.75, 0.95)
        model.precision = random.uniform(0.70, 0.90)
        model.recall = random.uniform(0.70, 0.90)
        model.f1_score = random.uniform(0.70, 0.90)
        model.auc_score = random.uniform(0.75, 0.95)
        model.training_data_size = random.randint(1000, 10000)
        model.save()
        
        return Response({'status': 'training_completed', 'accuracy': model.accuracy})
    
    @action(detail=True, methods=['POST'])
    def predict(self, request, pk=None):
        """Make predictions using the model"""
        model = self.get_object()
        
        if not model.is_trained:
            return Response({'error': 'Model not trained'}, status=status.HTTP_400_BAD_REQUEST)
        
        target_ids = request.data.get('target_ids', [])
        predictions = []
        
        for target_id in target_ids:
            prediction = PredictionResult.objects.create(
                model=model,
                target_id=target_id,
                target_type=request.data.get('target_type', 'lead'),
                prediction_value=random.uniform(0, 1),
                confidence_score=random.uniform(0.6, 0.95),
                prediction_class='high' if random.random() > 0.5 else 'low',
                feature_contributions={'feature_1': 0.3, 'feature_2': 0.7},
                input_features=request.data.get('features', {})
            )
            predictions.append(prediction)
        
        model.last_prediction = timezone.now()
        model.save()
        
        serializer = PredictionResultSerializer(predictions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def analytics(self, request):
        """Get predictive analytics summary"""
        models = self.get_queryset()
        
        analytics = {
            'total_models': models.count(),
            'active_models': models.filter(is_active=True).count(),
            'total_predictions': PredictionResult.objects.count(),
            'avg_model_accuracy': models.filter(is_trained=True).aggregate(avg=Avg('accuracy'))['avg'] or 0,
            'recent_predictions': []  # Would include recent prediction results
        }
        
        serializer = PredictiveAnalyticsSerializer(analytics)
        return Response(serializer.data)

class PredictionResultViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for prediction results (read-only)"""
    queryset = PredictionResult.objects.all()
    serializer_class = PredictionResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = PredictionResult.objects.all()
        
        # Filter by model
        model_id = self.request.query_params.get('model')
        if model_id:
            queryset = queryset.filter(model_id=model_id)
        
        # Filter by target type
        target_type = self.request.query_params.get('target_type')
        if target_type:
            queryset = queryset.filter(target_type=target_type)
            
        return queryset

class MarketingROIViewSet(viewsets.ModelViewSet):
    """ViewSet for marketing ROI calculations"""
    queryset = MarketingROI.objects.all()
    serializer_class = MarketingROISerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = MarketingROI.objects.all()
        
        # Filter by calculation period
        period = self.request.query_params.get('period')
        if period:
            queryset = queryset.filter(calculation_period=period)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(calculated_by=self.request.user)
    
    @action(detail=True, methods=['POST'])
    def recalculate(self, request, pk=None):
        """Recalculate ROI with updated data"""
        roi = self.get_object()
        
        # Mock recalculation
        roi.roi_percentage = random.uniform(150, 400)
        roi.roas = random.uniform(2.5, 6.0)
        roi.conversion_rate = random.uniform(2, 8)
        roi.calculated_at = timezone.now()
        roi.save()
        
        return Response({'status': 'recalculated', 'new_roi': roi.roi_percentage})
    
    @action(detail=False, methods=['GET'])
    def analytics(self, request):
        """Get ROI analytics summary"""
        roi_calculations = self.get_queryset()
        
        total_investment = roi_calculations.aggregate(sum=Sum('total_investment'))['sum'] or 0
        total_revenue = roi_calculations.aggregate(sum=Sum('total_revenue'))['sum'] or 0
        
        analytics = {
            'total_investment': total_investment,
            'total_revenue': total_revenue,
            'overall_roi': ((total_revenue - total_investment) / total_investment * 100) if total_investment > 0 else 0,
            'best_performing_channel': 'organic_search',  # Mock data
            'worst_performing_channel': 'display',  # Mock data
            'roi_trend': [150, 170, 180, 165, 200, 220, 250]  # Mock trend data
        }
        
        serializer = ROIAnalyticsSerializer(analytics)
        return Response(serializer.data)

class PerformanceDashboardViewSet(viewsets.ModelViewSet):
    """ViewSet for performance dashboards"""
    queryset = PerformanceDashboard.objects.all()
    serializer_class = PerformanceDashboardSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = PerformanceDashboard.objects.all()
        
        # Filter by dashboard type
        dashboard_type = self.request.query_params.get('dashboard_type')
        if dashboard_type:
            queryset = queryset.filter(dashboard_type=dashboard_type)
        
        # Filter by access permissions
        user = self.request.user
        queryset = queryset.filter(
            Q(is_public=True) |
            Q(created_by=user) |
            Q(allowed_users=user)
        ).distinct()
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['POST'])
    def refresh(self, request, pk=None):
        """Refresh dashboard data"""
        dashboard = self.get_object()
        dashboard.last_updated = timezone.now()
        dashboard.save()
        
        return Response({'status': 'refreshed', 'last_updated': dashboard.last_updated})

class AnalyticsAlertViewSet(viewsets.ModelViewSet):
    """ViewSet for analytics alerts"""
    queryset = AnalyticsAlert.objects.all()
    serializer_class = AnalyticsAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = AnalyticsAlert.objects.all()
        
        # Filter by alert type
        alert_type = self.request.query_params.get('alert_type')
        if alert_type:
            queryset = queryset.filter(alert_type=alert_type)
        
        # Filter by severity
        severity = self.request.query_params.get('severity')
        if severity:
            queryset = queryset.filter(severity=severity)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['POST'])
    def toggle(self, request, pk=None):
        """Toggle alert active status"""
        alert = self.get_object()
        alert.is_active = not alert.is_active
        alert.save()
        
        return Response({
            'is_active': alert.is_active,
            'status': 'activated' if alert.is_active else 'deactivated'
        })
    
    @action(detail=False, methods=['GET'])
    def overview(self, request):
        """Get performance overview"""
        # Mock data for overview
        overview = {
            'total_touchpoints': TouchpointEvent.objects.count(),
            'active_journeys': CustomerJourney.objects.filter(is_complete=False).count(),
            'conversion_rate': 3.5,
            'avg_customer_value': 1250.00,
            'top_channels': ['organic_search', 'email', 'paid_search'],
            'performance_alerts': self.get_queryset().filter(is_active=True).count()
        }
        
        serializer = PerformanceOverviewSerializer(overview)
        return Response(serializer.data)