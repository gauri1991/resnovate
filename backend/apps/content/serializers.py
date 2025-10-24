from rest_framework import serializers
from .models import BlogPost, CaseStudy, Service, MediaFile, PageSection, SiteSettings


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author', 'author_name',
            'featured_image', 'status', 'published_at', 'created_at', 'updated_at', 
            'seo_title', 'seo_description', 'tags', 'read_time', 'views',
            'is_published'  # Keep for compatibility
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at', 'views']


class CaseStudySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudy
        fields = [
            'id', 'title', 'slug', 'excerpt', 'client', 'location', 'budget',
            'duration', 'category', 'challenge', 'solution', 'results',
            'featured_image', 'before_image', 'after_image', 'status',
            'completed_at', 'created_at', 'updated_at', 'views',
            # Legacy fields for compatibility
            'client_name', 'client_industry', 'metrics', 'is_featured'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at', 'views']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'description', 'short_description', 'category',
            'base_price', 'estimated_duration', 'status', 'featured', 'display_order',
            'icon', 'bookings_count', 'created_at', 'updated_at',
            # CTA fields
            'show_pricing', 'cta_primary_text', 'cta_primary_link',
            'cta_secondary_text', 'cta_secondary_link',
            # Legacy fields for compatibility
            'price_range', 'duration', 'features', 'order', 'is_active'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at', 'bookings_count']


class MediaFileSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    url = serializers.CharField(read_only=True)
    thumbnail_url = serializers.CharField(read_only=True)

    class Meta:
        model = MediaFile
        fields = [
            'id', 'name', 'original_name', 'file', 'type', 'size', 'category',
            'tags', 'alt_text', 'description', 'uploaded_at', 'uploaded_by',
            'uploaded_by_name', 'usage_count', 'is_public', 'folder',
            'url', 'thumbnail_url'
        ]
        read_only_fields = ['uploaded_at', 'usage_count', 'url', 'thumbnail_url']


class PageSectionSerializer(serializers.ModelSerializer):
    page_display_name = serializers.CharField(source='get_page_identifier_display', read_only=True)

    class Meta:
        model = PageSection
        fields = [
            'id', 'page_identifier', 'page_display_name', 'section_name',
            'section_key', 'enabled', 'order', 'content',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'id', 'setting_type', 'navigation_items', 'footer_description',
            'footer_links', 'social_links', 'copyright_text', 'site_title',
            'site_description', 'site_keywords', 'og_image', 'twitter_handle',
            'contact_email', 'contact_phone', 'contact_address', 'updated_at'
        ]
        read_only_fields = ['updated_at', 'setting_type']