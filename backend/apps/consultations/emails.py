from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags


def send_booking_confirmation_email(booking):
    """
    Send booking confirmation email to the client
    """
    lead = booking.lead
    slot = booking.slot

    # Format date and time
    formatted_date = slot.date_time.strftime('%A, %B %d, %Y')
    formatted_time = slot.date_time.strftime('%I:%M %p')

    # Communication method display name
    comm_methods = {
        'zoom': 'Zoom',
        'teams': 'Microsoft Teams',
        'direct_call': 'Direct Call',
        'google_meet': 'Google Meet',
    }
    comm_method = comm_methods.get(booking.communication_method, booking.communication_method)

    subject = f'Consultation Booking Confirmed - {formatted_date}'

    # HTML email content
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background-color: #1e3a8a;
                color: white;
                padding: 30px 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }}
            .content {{
                background-color: #f9fafb;
                padding: 30px 20px;
                border: 1px solid #e5e7eb;
            }}
            .booking-details {{
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #1e3a8a;
            }}
            .detail-row {{
                padding: 10px 0;
                border-bottom: 1px solid #e5e7eb;
            }}
            .detail-row:last-child {{
                border-bottom: none;
            }}
            .detail-label {{
                font-weight: bold;
                color: #1e3a8a;
            }}
            .highlight {{
                background-color: #fef3c7;
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #6b7280;
                font-size: 12px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #1e3a8a;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 10px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Consultation Booking Confirmed!</h1>
            </div>

            <div class="content">
                <p>Dear {lead.name},</p>

                <p>Your consultation has been successfully booked. We look forward to speaking with you!</p>

                <div class="booking-details">
                    <h2 style="margin-top: 0; color: #1e3a8a;">Booking Details</h2>

                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div>{formatted_date}</div>
                    </div>

                    <div class="detail-row">
                        <div class="detail-label">Time:</div>
                        <div>{formatted_time}</div>
                    </div>

                    <div class="detail-row">
                        <div class="detail-label">Duration:</div>
                        <div>{slot.duration_minutes} minutes</div>
                    </div>

                    <div class="detail-row">
                        <div class="detail-label">Communication Method:</div>
                        <div>{comm_method}</div>
                    </div>

                    {f'<div class="detail-row"><div class="detail-label">Meeting Link:</div><div><a href="{booking.meeting_link}">{booking.meeting_link}</a></div></div>' if booking.meeting_link else ''}
                </div>

                <div class="highlight">
                    <strong>💳 Booking Fee:</strong> Your $10 booking fee has been processed successfully.
                    This fee is fully refundable if you need to cancel at least 24 hours before your consultation.
                </div>

                {f'<p><strong>Your Notes:</strong></p><p>{booking.notes}</p>' if booking.notes else ''}

                <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance to receive a full refund of your booking fee.</p>

                <p>We'll send you a reminder 24 hours before your consultation.</p>
            </div>

            <div class="footer">
                <p>Resnovate.ai - AI Solutions for Modern Businesses</p>
                <p>If you have any questions, please contact us at support@resnovate.ai</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Plain text version
    text_content = f"""
    Consultation Booking Confirmed

    Dear {lead.name},

    Your consultation has been successfully booked. We look forward to speaking with you!

    BOOKING DETAILS:
    ---------------
    Date: {formatted_date}
    Time: {formatted_time}
    Duration: {slot.duration_minutes} minutes
    Communication Method: {comm_method}
    {f'Meeting Link: {booking.meeting_link}' if booking.meeting_link else ''}

    BOOKING FEE:
    Your $10 booking fee has been processed successfully. This fee is fully refundable
    if you need to cancel at least 24 hours before your consultation.

    {f'Your Notes: {booking.notes}' if booking.notes else ''}

    If you need to reschedule or cancel, please contact us at least 24 hours in advance
    to receive a full refund of your booking fee.

    We'll send you a reminder 24 hours before your consultation.

    ---
    Resnovate.ai - AI Solutions for Modern Businesses
    If you have any questions, please contact us at support@resnovate.ai
    """

    # Create email
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@resnovate.ai',
        to=[lead.email],
    )
    email.attach_alternative(html_content, "text/html")

    try:
        email.send()
        print(f"✅ Booking confirmation email sent to {lead.email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {lead.email}: {str(e)}")
        return False


def send_reminder_email(booking):
    """
    Send reminder email 24 hours before consultation
    """
    lead = booking.lead
    slot = booking.slot

    formatted_date = slot.date_time.strftime('%A, %B %d, %Y')
    formatted_time = slot.date_time.strftime('%I:%M %p')

    comm_methods = {
        'zoom': 'Zoom',
        'teams': 'Microsoft Teams',
        'direct_call': 'Direct Call',
        'google_meet': 'Google Meet',
    }
    comm_method = comm_methods.get(booking.communication_method, booking.communication_method)

    subject = f'Reminder: Consultation Tomorrow - {formatted_date}'

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background-color: #fbbf24;
                color: #78350f;
                padding: 30px 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }}
            .content {{
                background-color: #fffbeb;
                padding: 30px 20px;
                border: 1px solid #fde68a;
            }}
            .booking-details {{
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #fbbf24;
            }}
            .detail-row {{
                padding: 10px 0;
                border-bottom: 1px solid #fde68a;
            }}
            .detail-row:last-child {{
                border-bottom: none;
            }}
            .detail-label {{
                font-weight: bold;
                color: #78350f;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #6b7280;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏰ Consultation Reminder</h1>
            </div>

            <div class="content">
                <p>Dear {lead.name},</p>

                <p>This is a friendly reminder that your consultation is scheduled for tomorrow.</p>

                <div class="booking-details">
                    <h2 style="margin-top: 0; color: #78350f;">Tomorrow's Consultation</h2>

                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div>{formatted_date}</div>
                    </div>

                    <div class="detail-row">
                        <div class="detail-label">Time:</div>
                        <div>{formatted_time}</div>
                    </div>

                    <div class="detail-row">
                        <div class="detail-label">Duration:</div>
                        <div>{slot.duration_minutes} minutes</div>
                    </div>

                    <div class="detail-row">
                        <div class="detail-label">Communication Method:</div>
                        <div>{comm_method}</div>
                    </div>

                    {f'<div class="detail-row"><div class="detail-label">Meeting Link:</div><div><a href="{booking.meeting_link}">{booking.meeting_link}</a></div></div>' if booking.meeting_link else ''}
                </div>

                <p>We look forward to speaking with you! Please be ready a few minutes before the scheduled time.</p>

                <p>If you need to cancel or reschedule, please contact us as soon as possible.</p>
            </div>

            <div class="footer">
                <p>Resnovate.ai - AI Solutions for Modern Businesses</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_content = f"""
    Consultation Reminder

    Dear {lead.name},

    This is a friendly reminder that your consultation is scheduled for tomorrow.

    TOMORROW'S CONSULTATION:
    ----------------------
    Date: {formatted_date}
    Time: {formatted_time}
    Duration: {slot.duration_minutes} minutes
    Communication Method: {comm_method}
    {f'Meeting Link: {booking.meeting_link}' if booking.meeting_link else ''}

    We look forward to speaking with you! Please be ready a few minutes before the scheduled time.

    If you need to cancel or reschedule, please contact us as soon as possible.

    ---
    Resnovate.ai - AI Solutions for Modern Businesses
    """

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@resnovate.ai',
        to=[lead.email],
    )
    email.attach_alternative(html_content, "text/html")

    try:
        email.send()
        booking.reminder_sent = True
        booking.save()
        print(f"✅ Reminder email sent to {lead.email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send reminder to {lead.email}: {str(e)}")
        return False
