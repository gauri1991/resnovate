from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from apps.consultations.models import ConsultationSlot


class Command(BaseCommand):
    help = 'Create consultation slots for the next 30 days'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Number of days to create slots for (default: 30)'
        )
        parser.add_argument(
            '--start-hour',
            type=int,
            default=9,
            help='Start hour for consultations (default: 9 AM)'
        )
        parser.add_argument(
            '--end-hour',
            type=int,
            default=17,
            help='End hour for consultations (default: 5 PM)'
        )
        parser.add_argument(
            '--duration',
            type=int,
            default=60,
            help='Duration of each slot in minutes (default: 60)'
        )
        parser.add_argument(
            '--payment-amount',
            type=float,
            default=10.00,
            help='Booking fee amount (default: 10.00)'
        )

    def handle(self, *args, **options):
        days = options['days']
        start_hour = options['start_hour']
        end_hour = options['end_hour']
        duration = options['duration']
        payment_amount = options['payment_amount']

        self.stdout.write(self.style.SUCCESS(
            f'Creating consultation slots for the next {days} days...'
        ))

        communication_methods = ['zoom', 'teams', 'direct_call', 'google_meet']
        slots_created = 0
        slots_skipped = 0

        # Start from tomorrow
        start_date = timezone.now().date() + timedelta(days=1)

        for day_offset in range(days):
            current_date = start_date + timedelta(days=day_offset)

            # Skip weekends
            if current_date.weekday() >= 5:  # Saturday = 5, Sunday = 6
                continue

            # Create slots for each hour
            for hour in range(start_hour, end_hour):
                slot_datetime = timezone.make_aware(
                    datetime.combine(current_date, datetime.min.time()).replace(hour=hour)
                )

                # Check if slot already exists
                if ConsultationSlot.objects.filter(
                    date_time=slot_datetime,
                    duration_minutes=duration
                ).exists():
                    slots_skipped += 1
                    continue

                # Rotate through communication methods
                comm_method = communication_methods[hour % len(communication_methods)]

                # Create slot
                ConsultationSlot.objects.create(
                    date_time=slot_datetime,
                    duration_minutes=duration,
                    is_available=True,
                    price=0,
                    meeting_type='video_call',
                    communication_method=comm_method,
                    requires_payment=True,
                    payment_amount=payment_amount
                )
                slots_created += 1

        self.stdout.write(self.style.SUCCESS(
            f'✅ Successfully created {slots_created} consultation slots'
        ))
        if slots_skipped > 0:
            self.stdout.write(self.style.WARNING(
                f'⚠️  Skipped {slots_skipped} slots (already exist)'
            ))

        self.stdout.write(self.style.SUCCESS(
            f'\nSlots created from {start_date} to {start_date + timedelta(days=days-1)}'
        ))
        self.stdout.write(self.style.SUCCESS(
            f'Hours: {start_hour}:00 - {end_hour}:00 (weekdays only)'
        ))
        self.stdout.write(self.style.SUCCESS(
            f'Duration: {duration} minutes each'
        ))
        self.stdout.write(self.style.SUCCESS(
            f'Booking fee: ${payment_amount}'
        ))
