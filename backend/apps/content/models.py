from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User


class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    content = models.TextField()
    excerpt = models.TextField(max_length=500, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='blog_posts')
    featured_image = models.ImageField(upload_to='blog/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(max_length=300, blank=True)
    tags = models.JSONField(default=list, blank=True)
    read_time = models.IntegerField(default=5)  # in minutes
    views = models.IntegerField(default=0)
    
    # Legacy field for compatibility
    is_published = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-published_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title


class CaseStudy(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    CATEGORY_CHOICES = [
        ('ai_strategy', 'AI Strategy & Planning'),
        ('ml_implementation', 'Machine Learning Implementation'),
        ('process_automation', 'Process Automation'),
        ('data_analytics', 'Data Analytics & BI'),
        ('custom_ai_solutions', 'Custom AI Solutions'),
        ('ai_training', 'AI Training & Change Management'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    excerpt = models.TextField(max_length=500, blank=True)
    client = models.CharField(max_length=100)  # Renamed from client_name
    location = models.CharField(max_length=200, blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='ai_strategy')
    
    # Project details
    challenge = models.TextField()
    solution = models.TextField()
    results = models.TextField()
    
    # Images
    featured_image = models.ImageField(upload_to='case_studies/', null=True, blank=True)
    before_image = models.ImageField(upload_to='case_studies/before/', null=True, blank=True)
    after_image = models.ImageField(upload_to='case_studies/after/', null=True, blank=True)
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    completed_at = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.IntegerField(default=0)
    
    # Legacy fields
    client_name = models.CharField(max_length=100, blank=True)  # Use client instead
    client_industry = models.CharField(max_length=100, blank=True)
    metrics = models.JSONField(default=dict, blank=True)
    is_featured = models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural = "Case Studies"
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title


class Service(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('coming_soon', 'Coming Soon'),
    ]
    
    CATEGORY_CHOICES = [
        ('ai_strategy', 'AI Strategy & Consulting'),
        ('ml_development', 'Machine Learning Development'),
        ('data_analytics', 'Data Analytics & BI'),
        ('process_automation', 'Process Automation'),
        ('ai_integration', 'AI System Integration'),
        ('ai_training', 'AI Training & Education'),
        ('custom_solutions', 'Custom AI Solutions'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    short_description = models.CharField(max_length=300)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='ai_strategy')
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_duration = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    featured = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    icon = models.CharField(max_length=50, blank=True)
    bookings_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Legacy fields
    price_range = models.CharField(max_length=100, blank=True)  # Use base_price instead
    duration = models.CharField(max_length=100, blank=True)  # Use estimated_duration instead
    features = models.JSONField(default=list)
    order = models.IntegerField(default=0)  # Use display_order instead
    is_active = models.BooleanField(default=True)  # Use status instead
    
    class Meta:
        ordering = ['display_order', 'name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class MediaFile(models.Model):
    CATEGORY_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('document', 'Document'),
        ('audio', 'Audio'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=255)
    original_name = models.CharField(max_length=255)
    file = models.FileField(upload_to='media/%Y/%m/')
    type = models.CharField(max_length=100)
    size = models.BigIntegerField()  # in bytes
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    tags = models.JSONField(default=list, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_files')
    usage_count = models.IntegerField(default=0)
    is_public = models.BooleanField(default=True)
    folder = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return self.original_name
    
    @property
    def url(self):
        return self.file.url if self.file else ''
    
    @property
    def thumbnail_url(self):
        # In a real app, you'd generate thumbnails
        return self.url if self.category == 'image' else ''


class PageSection(models.Model):
    """Model for CMS-managed page sections"""

    PAGE_CHOICES = [
        ('homepage', 'Homepage'),
        ('about', 'About Page'),
        ('services', 'Services Page'),
        ('case_studies', 'Case Studies Page'),
        ('research_insights', 'Research Insights Page'),
        ('contact', 'Contact Page'),
        ('resources', 'Resources Page'),
    ]

    page_identifier = models.CharField(max_length=50, choices=PAGE_CHOICES)
    section_name = models.CharField(max_length=100)
    section_key = models.CharField(max_length=100)  # Unique identifier for the section (e.g., 'hero', 'stats', 'features')
    enabled = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    content = models.JSONField(default=dict, blank=True)  # Store section-specific content
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['page_identifier', 'order']
        unique_together = ['page_identifier', 'section_key']
        verbose_name = 'Page Section'
        verbose_name_plural = 'Page Sections'

    def __str__(self):
        return f"{self.get_page_identifier_display()} - {self.section_name}"


class SiteSettings(models.Model):
    """Model for global site settings (navigation, footer, metadata)"""

    # Singleton pattern - only one instance should exist
    setting_type = models.CharField(max_length=50, unique=True, default='global')

    # Navigation settings
    navigation_items = models.JSONField(default=list, blank=True, help_text='Main navigation menu items')

    # Footer settings
    footer_description = models.TextField(blank=True, help_text='Company description in footer')
    footer_links = models.JSONField(default=list, blank=True, help_text='Footer navigation links')
    social_links = models.JSONField(default=list, blank=True, help_text='Social media links')
    copyright_text = models.CharField(max_length=200, blank=True, help_text='Copyright text')

    # SEO/Metadata settings
    site_title = models.CharField(max_length=200, blank=True, help_text='Default site title')
    site_description = models.TextField(max_length=500, blank=True, help_text='Default site description')
    site_keywords = models.TextField(blank=True, help_text='Default SEO keywords')
    og_image = models.URLField(blank=True, help_text='Default Open Graph image URL')
    twitter_handle = models.CharField(max_length=50, blank=True, help_text='Twitter handle (without @)')

    # Contact info
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    contact_address = models.TextField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return 'Site Settings'

    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton pattern)
        self.setting_type = 'global'
        super().save(*args, **kwargs)
