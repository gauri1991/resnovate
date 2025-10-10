from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'amount', 'currency',
            'stripe_payment_intent_id', 'stripe_payment_status',
            'paid_at', 'refunded', 'refunded_at', 'refund_amount',
            'refund_reason', 'metadata', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'paid_at', 'refunded_at']


class PaymentIntentSerializer(serializers.Serializer):
    """Serializer for creating payment intents"""
    booking_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(max_length=3, default='usd')
    metadata = serializers.JSONField(required=False, default=dict)


class PaymentConfirmationSerializer(serializers.Serializer):
    """Serializer for confirming payment"""
    payment_intent_id = serializers.CharField()
    booking_id = serializers.IntegerField()
