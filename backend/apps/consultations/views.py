from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from django.utils import timezone
from datetime import timedelta
from .models import ConsultationSlot, Booking
from .serializers import ConsultationSlotSerializer, BookingSerializer
from apps.leads.models import Lead


class ConsultationSlotViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultationSlotSerializer
    permission_classes = [AllowAny]  # Temporarily allow anonymous access for testing
    
    def get_queryset(self):
        queryset = ConsultationSlot.objects.filter(
            date_time__gte=timezone.now(),
            is_available=True
        )
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def available(self, request):
        """Get available consultation slots for the next 30 days"""
        end_date = timezone.now() + timedelta(days=30)
        slots = ConsultationSlot.objects.filter(
            date_time__range=[timezone.now(), end_date],
            is_available=True
        )
        serializer = self.get_serializer(slots, many=True)
        return Response(serializer.data)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        # Temporarily allow anonymous access for testing admin integration
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def create(self, request):
        """Create a new booking"""
        slot_id = request.data.get('slot_id')
        lead_data = request.data.get('lead', {})
        
        # Handle existing lead by ID or create new lead
        if 'id' in lead_data:
            # Use existing lead
            try:
                lead = Lead.objects.get(id=lead_data['id'])
            except Lead.DoesNotExist:
                return Response(
                    {'error': 'Lead not found'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Create new lead - ensure email is provided
            email = lead_data.get('email', '').strip()
            if not email:
                return Response(
                    {'error': 'Email is required for new lead'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            lead, created = Lead.objects.get_or_create(
                email=email,
                defaults={
                    'name': lead_data.get('name', ''),
                    'company': lead_data.get('company', ''),
                    'phone': lead_data.get('phone', ''),
                    'source': 'consultation'
                }
            )
        
        # Get slot and check availability
        try:
            slot = ConsultationSlot.objects.get(id=slot_id, is_available=True)
        except ConsultationSlot.DoesNotExist:
            return Response(
                {'error': 'Slot not available'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create booking
        booking = Booking.objects.create(
            lead=lead,
            slot=slot,
            status='pending',
            notes=request.data.get('notes', '')
        )
        
        # Make slot unavailable
        slot.is_available = False
        slot.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        booking.status = 'cancelled'
        booking.cancelled_at = timezone.now()
        booking.cancellation_reason = request.data.get('reason', '')
        booking.save()
        
        # Make slot available again
        booking.slot.is_available = True
        booking.slot.save()
        
        return Response({'status': 'Booking cancelled'})
