from django.contrib import admin
from django.utils.html import format_html
from .models import ConsultationSlot, Booking


@admin.register(ConsultationSlot)
class ConsultationSlotAdmin(admin.ModelAdmin):
    list_display = [
        'date_time',
        'duration_minutes',
        'communication_method',
        'payment_amount',
        'is_available_display',
        'requires_payment',
    ]
    list_filter = [
        'is_available',
        'requires_payment',
        'communication_method',
        'meeting_type',
    ]
    search_fields = ['date_time']
    ordering = ['date_time']

    fieldsets = (
        ('Date & Time', {
            'fields': ('date_time', 'duration_minutes')
        }),
        ('Communication', {
            'fields': ('meeting_type', 'communication_method')
        }),
        ('Payment', {
            'fields': ('requires_payment', 'payment_amount', 'price')
        }),
        ('Availability', {
            'fields': ('is_available',)
        }),
    )

    def is_available_display(self, obj):
        if obj.is_available:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Available</span>'
            )
        return format_html(
            '<span style="color: red; font-weight: bold;">✗ Booked</span>'
        )
    is_available_display.short_description = 'Status'

    actions = ['make_available', 'make_unavailable']

    def make_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f'{updated} slot(s) marked as available.')
    make_available.short_description = 'Mark selected slots as available'

    def make_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f'{updated} slot(s) marked as unavailable.')
    make_unavailable.short_description = 'Mark selected slots as unavailable'


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'lead_name',
        'lead_email',
        'slot_datetime',
        'communication_method',
        'status_display',
        'paid_display',
        'created_at',
    ]
    list_filter = [
        'status',
        'paid',
        'communication_method',
        'created_at',
    ]
    search_fields = [
        'lead__name',
        'lead__email',
        'lead__company',
        'notes',
    ]
    readonly_fields = [
        'created_at',
        'updated_at',
        'cancelled_at',
    ]
    ordering = ['-created_at']

    fieldsets = (
        ('Lead Information', {
            'fields': ('lead',)
        }),
        ('Booking Details', {
            'fields': ('slot', 'communication_method', 'status', 'notes')
        }),
        ('Payment', {
            'fields': ('paid', 'amount_paid', 'stripe_payment_intent')
        }),
        ('Meeting', {
            'fields': ('meeting_link',)
        }),
        ('Project Tracking', {
            'fields': ('project_value', 'resulted_in_project', 'project_start_date', 'project_end_date'),
            'classes': ('collapse',)
        }),
        ('Cancellation', {
            'fields': ('cancelled_at', 'cancellation_reason'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'reminder_sent'),
            'classes': ('collapse',)
        }),
    )

    def lead_name(self, obj):
        return obj.lead.name
    lead_name.short_description = 'Lead Name'
    lead_name.admin_order_field = 'lead__name'

    def lead_email(self, obj):
        return obj.lead.email
    lead_email.short_description = 'Email'
    lead_email.admin_order_field = 'lead__email'

    def slot_datetime(self, obj):
        return obj.slot.date_time.strftime('%Y-%m-%d %H:%M')
    slot_datetime.short_description = 'Consultation Date'
    slot_datetime.admin_order_field = 'slot__date_time'

    def status_display(self, obj):
        colors = {
            'pending': 'orange',
            'confirmed': 'green',
            'cancelled': 'red',
            'completed': 'blue',
            'no_show': 'gray',
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'

    def paid_display(self, obj):
        if obj.paid:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Paid (${:.2f})</span>',
                obj.amount_paid
            )
        return format_html(
            '<span style="color: red; font-weight: bold;">✗ Unpaid</span>'
        )
    paid_display.short_description = 'Payment'

    actions = ['mark_as_confirmed', 'mark_as_completed', 'send_reminder']

    def mark_as_confirmed(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} booking(s) marked as confirmed.')
    mark_as_confirmed.short_description = 'Mark as confirmed'

    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} booking(s) marked as completed.')
    mark_as_completed.short_description = 'Mark as completed'

    def send_reminder(self, request, queryset):
        # TODO: Implement reminder email sending
        count = queryset.count()
        self.message_user(request, f'Reminders will be sent for {count} booking(s).')
    send_reminder.short_description = 'Send reminder email'
