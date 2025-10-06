from django.db import models
from apps.leads.models import Lead
from django.contrib.auth.models import User


class ConsultationSlot(models.Model):
    date_time = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    is_available = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    meeting_type = models.CharField(max_length=50, default='video_call')
    
    class Meta:
        ordering = ['date_time']
        unique_together = ['date_time', 'duration_minutes']
    
    def __str__(self):
        return f"{self.date_time.strftime('%Y-%m-%d %H:%M')} - {self.duration_minutes} min"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('no_show', 'No Show'),
    ]
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='bookings')
    slot = models.OneToOneField(ConsultationSlot, on_delete=models.CASCADE, related_name='booking')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    paid = models.BooleanField(default=False)
    
    # Revenue Tracking
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    project_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    stripe_payment_intent = models.CharField(max_length=200, blank=True)
    meeting_link = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    reminder_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True)
    
    # Outcome tracking
    resulted_in_project = models.BooleanField(default=False)
    project_start_date = models.DateField(null=True, blank=True)
    project_end_date = models.DateField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if self.pk is None:
            self.slot.is_available = False
            self.slot.save()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Booking: {self.lead.name} - {self.slot.date_time.strftime('%Y-%m-%d %H:%M')}"
