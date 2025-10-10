from django.db import models
from django.utils import timezone


class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('partially_refunded', 'Partially Refunded'),
    ]

    booking = models.ForeignKey(
        'consultations.Booking',
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Payment amount'
    )
    currency = models.CharField(
        max_length=3,
        default='usd',
        help_text='Payment currency code'
    )
    stripe_payment_intent_id = models.CharField(
        max_length=255,
        unique=True,
        help_text='Stripe Payment Intent ID'
    )
    stripe_payment_status = models.CharField(
        max_length=30,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )
    paid_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when payment was completed'
    )
    refunded = models.BooleanField(
        default=False,
        help_text='Whether this payment has been refunded'
    )
    refunded_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when refund was processed'
    )
    refund_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Amount refunded'
    )
    refund_reason = models.TextField(
        blank=True,
        help_text='Reason for refund'
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text='Additional payment metadata'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.id} - {self.booking} - ${self.amount} ({self.stripe_payment_status})"

    def mark_as_paid(self):
        """Mark payment as succeeded"""
        self.stripe_payment_status = 'succeeded'
        self.paid_at = timezone.now()
        self.save()

        # Update booking's paid status
        self.booking.paid = True
        self.booking.amount_paid = self.amount
        self.booking.status = 'confirmed'
        self.booking.save()

        # Generate meeting link
        try:
            from apps.consultations.meeting_links import generate_meeting_link
            generate_meeting_link(self.booking)
        except Exception as e:
            print(f"⚠️  Failed to generate meeting link: {str(e)}")

        # Send confirmation email
        try:
            from apps.consultations.emails import send_booking_confirmation_email
            send_booking_confirmation_email(self.booking)
        except Exception as e:
            print(f"⚠️  Failed to send confirmation email: {str(e)}")

    def process_refund(self, amount=None, reason=''):
        """Process a refund for this payment"""
        refund_amount = amount if amount else self.amount
        self.refunded = True
        self.refunded_at = timezone.now()
        self.refund_amount = refund_amount
        self.refund_reason = reason

        if refund_amount >= self.amount:
            self.stripe_payment_status = 'refunded'
        else:
            self.stripe_payment_status = 'partially_refunded'

        self.save()
