from django.db import models
from django.utils import timezone


class PageView(models.Model):
    """Track website page views for analytics"""
    
    # Page information
    path = models.CharField(max_length=500)
    title = models.CharField(max_length=200, blank=True)
    
    # Visitor information
    visitor_id = models.CharField(max_length=100)  # Can be anonymous UUID
    user = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    # Session information
    session_id = models.CharField(max_length=100)
    is_unique = models.BooleanField(default=False)  # First visit in session
    
    # Referrer information
    referrer = models.URLField(max_length=500, blank=True)
    referrer_domain = models.CharField(max_length=200, blank=True)
    
    # Device information
    user_agent = models.TextField(blank=True)
    device_type = models.CharField(max_length=50, blank=True)  # desktop, mobile, tablet
    browser = models.CharField(max_length=100, blank=True)
    os = models.CharField(max_length=100, blank=True)
    
    # UTM parameters
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)
    utm_term = models.CharField(max_length=100, blank=True)
    utm_content = models.CharField(max_length=100, blank=True)
    
    # Timing
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    time_on_page = models.IntegerField(null=True, blank=True)  # seconds
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['path', 'timestamp']),
            models.Index(fields=['visitor_id', 'timestamp']),
            models.Index(fields=['session_id']),
        ]
    
    def __str__(self):
        return f"{self.path} - {self.timestamp}"
    
    @classmethod
    def get_unique_visitors(cls, start_date=None, end_date=None):
        """Get count of unique visitors in date range"""
        queryset = cls.objects.all()
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        return queryset.values('visitor_id').distinct().count()
    
    @classmethod
    def get_page_views(cls, start_date=None, end_date=None):
        """Get total page views in date range"""
        queryset = cls.objects.all()
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        return queryset.count()
    
    @classmethod
    def get_traffic_sources(cls, start_date=None, end_date=None):
        """Get traffic source breakdown"""
        queryset = cls.objects.filter(is_unique=True)
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        
        total = queryset.count() or 1
        
        sources = []
        
        # Organic Search
        organic = queryset.filter(
            referrer_domain__in=['google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com']
        ).count()
        sources.append({
            'name': 'Organic Search',
            'value': round((organic / total) * 100),
            'color': '#1e3a8a'
        })
        
        # Direct
        direct = queryset.filter(referrer='').count()
        sources.append({
            'name': 'Direct',
            'value': round((direct / total) * 100),
            'color': '#f59e0b'
        })
        
        # Social Media
        social = queryset.filter(
            referrer_domain__in=['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com']
        ).count()
        sources.append({
            'name': 'Social Media',
            'value': round((social / total) * 100),
            'color': '#64748b'
        })
        
        # Referrals (everything else)
        referrals = total - organic - direct - social
        sources.append({
            'name': 'Referrals',
            'value': round((referrals / total) * 100),
            'color': '#16a34a'
        })
        
        return sources


class Event(models.Model):
    """Track custom events like button clicks, form submissions, etc."""
    
    EVENT_CATEGORIES = [
        ('click', 'Click'),
        ('form', 'Form'),
        ('scroll', 'Scroll'),
        ('download', 'Download'),
        ('video', 'Video'),
        ('engagement', 'Engagement'),
    ]
    
    # Event information
    category = models.CharField(max_length=50, choices=EVENT_CATEGORIES)
    action = models.CharField(max_length=200)
    label = models.CharField(max_length=200, blank=True)
    value = models.IntegerField(null=True, blank=True)
    
    # Context
    page_path = models.CharField(max_length=500)
    visitor_id = models.CharField(max_length=100)
    session_id = models.CharField(max_length=100)
    
    # Timestamp
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['category', 'action']),
            models.Index(fields=['visitor_id', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.category}: {self.action} - {self.timestamp}"