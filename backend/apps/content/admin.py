from django.contrib import admin
from .models import BlogPost, CaseStudy, Service, PageSection, SiteSettings


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'published_at', 'is_published']
    list_filter = ['is_published', 'published_at']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_at'


@admin.register(CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ['title', 'client_name', 'client_industry', 'created_at', 'is_featured']
    list_filter = ['is_featured', 'client_industry']
    search_fields = ['title', 'client_name', 'challenge', 'solution']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'price_range', 'duration', 'show_pricing', 'order', 'is_active']
    list_filter = ['is_active', 'show_pricing']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'short_description', 'category', 'icon')
        }),
        ('Pricing & Duration', {
            'fields': ('base_price', 'price_range', 'estimated_duration', 'duration')
        }),
        ('Display Settings', {
            'fields': ('status', 'is_active', 'featured', 'display_order', 'order')
        }),
        ('Call-to-Action Settings', {
            'fields': (
                'show_pricing',
                'cta_primary_text', 'cta_primary_link',
                'cta_secondary_text', 'cta_secondary_link'
            ),
            'description': 'Configure whether to show pricing or CTA buttons on the services page'
        }),
        ('Additional', {
            'fields': ('features', 'bookings_count'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PageSection)
class PageSectionAdmin(admin.ModelAdmin):
    list_display = ['section_name', 'page_identifier', 'section_key', 'enabled', 'order']
    list_filter = ['page_identifier', 'enabled']
    search_fields = ['section_name', 'section_key']
    ordering = ['page_identifier', 'order']
    list_editable = ['enabled', 'order']


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['setting_type', 'updated_at']

    def has_add_permission(self, request):
        # Prevent adding more than one instance
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of the singleton instance
        return False
