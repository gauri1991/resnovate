from django.contrib import admin
from django.utils.html import format_html
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'booking_info',
        'amount_display',
        'status_display',
        'refund_display',
        'paid_at',
        'created_at',
    ]
    list_filter = [
        'stripe_payment_status',
        'refunded',
        'currency',
        'created_at',
    ]
    search_fields = [
        'stripe_payment_intent_id',
        'booking__lead__name',
        'booking__lead__email',
    ]
    readonly_fields = [
        'created_at',
        'updated_at',
        'paid_at',
        'refunded_at',
    ]
    ordering = ['-created_at']

    fieldsets = (
        ('Booking', {
            'fields': ('booking',)
        }),
        ('Payment Details', {
            'fields': ('amount', 'currency', 'stripe_payment_intent_id', 'stripe_payment_status')
        }),
        ('Payment Status', {
            'fields': ('paid_at',)
        }),
        ('Refund Information', {
            'fields': ('refunded', 'refunded_at', 'refund_amount', 'refund_reason'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('metadata', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def booking_info(self, obj):
        return f"{obj.booking.lead.name} - {obj.booking.slot.date_time.strftime('%Y-%m-%d %H:%M')}"
    booking_info.short_description = 'Booking'
    booking_info.admin_order_field = 'booking__slot__date_time'

    def amount_display(self, obj):
        return f"${obj.amount} {obj.currency.upper()}"
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'amount'

    def status_display(self, obj):
        colors = {
            'pending': 'orange',
            'processing': 'blue',
            'succeeded': 'green',
            'failed': 'red',
            'refunded': 'gray',
            'partially_refunded': 'purple',
        }
        color = colors.get(obj.stripe_payment_status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_stripe_payment_status_display()
        )
    status_display.short_description = 'Status'

    def refund_display(self, obj):
        if obj.refunded:
            return format_html(
                '<span style="color: orange; font-weight: bold;">Refunded: ${:.2f}</span>',
                obj.refund_amount
            )
        return format_html(
            '<span style="color: green;">No Refund</span>'
        )
    refund_display.short_description = 'Refund Status'

    actions = ['process_refund']

    def process_refund(self, request, queryset):
        # TODO: Implement Stripe refund API call
        count = 0
        for payment in queryset:
            if not payment.refunded and payment.stripe_payment_status == 'succeeded':
                payment.process_refund(reason='Admin initiated refund')
                count += 1
        self.message_user(request, f'{count} payment(s) refunded.')
    process_refund.short_description = 'Process full refund'
