from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
import stripe
import json
from .models import Payment


@csrf_exempt
@require_POST
def stripe_webhook(request):
    """
    Stripe webhook handler for payment events
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET

    if not webhook_secret:
        # If no webhook secret configured, just return 200
        return HttpResponse(status=200)

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        # Invalid signature
        return HttpResponse(status=400)

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        handle_payment_success(payment_intent)

    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        handle_payment_failed(payment_intent)

    elif event['type'] == 'charge.refunded':
        charge = event['data']['object']
        handle_refund(charge)

    return HttpResponse(status=200)


def handle_payment_success(payment_intent):
    """Handle successful payment"""
    payment_intent_id = payment_intent['id']

    try:
        payment = Payment.objects.get(stripe_payment_intent_id=payment_intent_id)
        payment.mark_as_paid()
        print(f"✅ Payment {payment.id} marked as paid")
    except Payment.DoesNotExist:
        print(f"⚠️  Payment not found for intent {payment_intent_id}")


def handle_payment_failed(payment_intent):
    """Handle failed payment"""
    payment_intent_id = payment_intent['id']

    try:
        payment = Payment.objects.get(stripe_payment_intent_id=payment_intent_id)
        payment.stripe_payment_status = 'failed'
        payment.save()
        print(f"❌ Payment {payment.id} marked as failed")
    except Payment.DoesNotExist:
        print(f"⚠️  Payment not found for intent {payment_intent_id}")


def handle_refund(charge):
    """Handle refund"""
    payment_intent_id = charge.get('payment_intent')

    if not payment_intent_id:
        return

    try:
        payment = Payment.objects.get(stripe_payment_intent_id=payment_intent_id)
        refund_amount = charge['amount_refunded'] / 100  # Convert from cents
        payment.process_refund(amount=refund_amount, reason='Stripe refund event')
        print(f"💰 Payment {payment.id} refunded: ${refund_amount}")
    except Payment.DoesNotExist:
        print(f"⚠️  Payment not found for intent {payment_intent_id}")
