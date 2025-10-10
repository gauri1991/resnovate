from rest_framework import serializers
from .models import ConsultationSlot, Booking
from apps.leads.serializers import LeadSerializer


class ConsultationSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationSlot
        fields = [
            'id', 'date_time', 'duration_minutes', 'is_available',
            'price', 'meeting_type', 'communication_method',
            'requires_payment', 'payment_amount'
        ]
        read_only_fields = ['is_available']


class BookingSerializer(serializers.ModelSerializer):
    lead = LeadSerializer(read_only=True)
    slot = ConsultationSlotSerializer(read_only=True)
    lead_id = serializers.IntegerField(write_only=True)
    slot_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'lead', 'lead_id', 'slot', 'slot_id', 'status',
            'paid', 'amount_paid', 'project_value', 'resulted_in_project',
            'communication_method', 'stripe_payment_intent', 'meeting_link', 'notes',
            'reminder_sent', 'created_at', 'updated_at',
            'cancelled_at', 'cancellation_reason'
        ]
        read_only_fields = ['created_at', 'updated_at']