from django.db import models
from django.core.validators import EmailValidator


class Lead(models.Model):
    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('organic_search', 'Organic Search'),
        ('direct', 'Direct'),
        ('referral', 'Referral'),
        ('social', 'Social Media'),
        ('linkedin', 'LinkedIn'),
        ('ads', 'Advertisements'),
        ('email', 'Email Campaign'),
        ('event', 'Event/Conference'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('proposal_sent', 'Proposal Sent'),
        ('negotiation', 'Negotiation'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    # Personal Information
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(validators=[EmailValidator()])
    phone = models.CharField(max_length=20, blank=True)
    
    # Project Information
    project_type = models.CharField(max_length=100)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    timeline = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    
    # Lead Management
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='website')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    assigned_to = models.CharField(max_length=100, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_contact_date = models.DateTimeField(null=True, blank=True)
    next_followup_date = models.DateTimeField(null=True, blank=True)
    
    # Response Time Tracking
    first_contacted_at = models.DateTimeField(null=True, blank=True)
    qualified_at = models.DateTimeField(null=True, blank=True)
    converted_at = models.DateTimeField(null=True, blank=True)
    
    # Traffic Analytics
    referrer_url = models.URLField(max_length=500, blank=True)
    landing_page = models.URLField(max_length=500, blank=True)
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)
    
    # Additional Information
    notes = models.TextField(blank=True)
    
    # Legacy fields for compatibility
    name = models.CharField(max_length=100, blank=True)  # Computed from first_name + last_name
    company = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)  # Use description instead
    budget_range = models.CharField(max_length=50, blank=True)  # Use budget instead
    project_timeline = models.CharField(max_length=100, blank=True)  # Use timeline instead
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        # Auto-track status change timestamps
        if self.pk:
            old_instance = Lead.objects.filter(pk=self.pk).first()
            if old_instance:
                # Track first contact time
                if old_instance.status == 'new' and self.status == 'contacted' and not self.first_contacted_at:
                    from django.utils import timezone
                    self.first_contacted_at = timezone.now()
                # Track qualification time
                if old_instance.status != 'qualified' and self.status == 'qualified' and not self.qualified_at:
                    from django.utils import timezone
                    self.qualified_at = timezone.now()
                # Track conversion time
                if old_instance.status != 'won' and self.status == 'won' and not self.converted_at:
                    from django.utils import timezone
                    self.converted_at = timezone.now()
        
        # Set name from first_name and last_name
        if self.first_name or self.last_name:
            self.name = f"{self.first_name} {self.last_name}".strip()
        
        super().save(*args, **kwargs)
    
    def get_response_time_hours(self):
        """Calculate response time in hours"""
        if self.first_contacted_at and self.created_at:
            delta = self.first_contacted_at - self.created_at
            return delta.total_seconds() / 3600
        return None
    
    def __str__(self):
        return f"{self.name} - {self.email}"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    subscribed_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-subscribed_at']
    
    def __str__(self):
        return self.email
