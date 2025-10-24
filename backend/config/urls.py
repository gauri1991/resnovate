from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.views.decorators.csrf import csrf_exempt

from apps.content.views import BlogPostViewSet, CaseStudyViewSet, ServiceViewSet, MediaFileViewSet, PageSectionViewSet, SiteSettingsViewSet, dashboard_stats
from apps.leads.views import LeadViewSet, NewsletterSubscriberViewSet
from apps.consultations.views import ConsultationSlotViewSet, BookingViewSet
from apps.users.views import current_user
from apps.payments.views import stripe_webhook

@require_http_methods(["GET"])
def health_check(request):
    """Simple health check endpoint"""
    from django.db import connection
    from apps.content.models import PageSection

    status = {
        "status": "healthy",
        "django": "ok"
    }

    # Check database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        status["database"] = "connected"
    except Exception as e:
        status["database"] = f"error: {str(e)}"
        status["status"] = "unhealthy"

    # Check PageSection table
    try:
        count = PageSection.objects.count()
        status["pagesections"] = count
    except Exception as e:
        status["pagesections"] = f"error: {str(e)}"
        status["status"] = "unhealthy"

    return JsonResponse(status)

# Create API router
router = DefaultRouter()
router.register(r'blog-posts', BlogPostViewSet, basename='blogpost')
router.register(r'case-studies', CaseStudyViewSet, basename='casestudy')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'media', MediaFileViewSet, basename='mediafile')
router.register(r'cms/page-sections', PageSectionViewSet, basename='pagesection')
router.register(r'cms/site-settings', SiteSettingsViewSet, basename='sitesettings')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'newsletter', NewsletterSubscriberViewSet, basename='newsletter')
router.register(r'consultation-slots', ConsultationSlotViewSet, basename='consultationslot')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/', include(router.urls)),
    path('api/marketing/', include('apps.marketing.urls')),
    path('api/webhooks/stripe/', stripe_webhook, name='stripe_webhook'),
    path('api/auth/', include('rest_framework.urls')),
    path('api/auth/user/', current_user, name='current_user'),
    path('api/dashboard/stats/', dashboard_stats, name='dashboard_stats'),
    path('api/token/', csrf_exempt(TokenObtainPairView.as_view()), name='token_obtain_pair'),
    path('api/token/refresh/', csrf_exempt(TokenRefreshView.as_view()), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
