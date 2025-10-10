"""
Meeting Link Generation Utilities

This module provides utilities to generate meeting links for different platforms.
In production, integrate with actual APIs (Zoom, Teams, Google Meet).
"""

import uuid
from django.conf import settings


def generate_meeting_link(booking):
    """
    Generate a meeting link for the booking based on communication method

    In production, this should:
    - Call Zoom API to create meeting
    - Call Teams API to create meeting
    - Generate Google Meet link
    - Or provide phone number for direct calls

    For now, this generates placeholder links.
    """
    method = booking.communication_method
    slot = booking.slot
    lead = booking.lead

    # Generate unique meeting ID
    meeting_id = str(uuid.uuid4())[:8]

    if method == 'zoom':
        # In production: Use Zoom API
        # zoom_meeting = create_zoom_meeting(topic, start_time, duration)
        # return zoom_meeting['join_url']
        meeting_link = f"https://zoom.us/j/{meeting_id}"

    elif method == 'teams':
        # In production: Use Microsoft Teams API
        # teams_meeting = create_teams_meeting(subject, start_time, end_time)
        # return teams_meeting['joinUrl']
        meeting_link = f"https://teams.microsoft.com/l/meetup-join/{meeting_id}"

    elif method == 'google_meet':
        # In production: Use Google Meet API
        # meet_event = create_google_meet(summary, start_time, end_time)
        # return meet_event['hangoutLink']
        meeting_link = f"https://meet.google.com/{meeting_id}"

    elif method == 'direct_call':
        # In production: Provide business phone number
        phone_number = getattr(settings, 'BUSINESS_PHONE', '+1 (555) 123-4567')
        meeting_link = f"tel:{phone_number}"

    else:
        meeting_link = None

    # Update booking with meeting link
    booking.meeting_link = meeting_link
    booking.save()

    return meeting_link


# Production Integration Examples:

def create_zoom_meeting_example(topic, start_time, duration_minutes):
    """
    Example Zoom API integration

    Requires: pip install PyJWT requests

    Setup:
    1. Create Zoom App at https://marketplace.zoom.us/
    2. Get API Key and Secret
    3. Add to settings:
       ZOOM_API_KEY = 'your_key'
       ZOOM_API_SECRET = 'your_secret'
    """
    import jwt
    import requests
    import time
    from datetime import datetime, timedelta

    # This is example code - uncomment and configure in production
    # api_key = settings.ZOOM_API_KEY
    # api_secret = settings.ZOOM_API_SECRET

    # # Generate JWT token
    # token = jwt.encode(
    #     {
    #         'iss': api_key,
    #         'exp': time.time() + 5000
    #     },
    #     api_secret,
    #     algorithm='HS256'
    # )

    # headers = {
    #     'authorization': f'Bearer {token}',
    #     'content-type': 'application/json'
    # }

    # meeting_details = {
    #     'topic': topic,
    #     'type': 2,  # Scheduled meeting
    #     'start_time': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
    #     'duration': duration_minutes,
    #     'timezone': 'UTC',
    #     'settings': {
    #         'join_before_host': False,
    #         'waiting_room': True,
    #         'mute_upon_entry': True,
    #     }
    # }

    # response = requests.post(
    #     'https://api.zoom.us/v2/users/me/meetings',
    #     headers=headers,
    #     json=meeting_details
    # )

    # if response.status_code == 201:
    #     return response.json()
    # else:
    #     raise Exception(f'Zoom API error: {response.text}')

    pass


def create_teams_meeting_example(subject, start_time, end_time):
    """
    Example Microsoft Teams API integration

    Requires: pip install msal requests

    Setup:
    1. Register app in Azure AD
    2. Grant Calendar.ReadWrite permission
    3. Add to settings:
       MS_TENANT_ID = 'your_tenant'
       MS_CLIENT_ID = 'your_client'
       MS_CLIENT_SECRET = 'your_secret'
    """
    from msal import ConfidentialClientApplication
    import requests

    # This is example code - uncomment and configure in production
    # tenant_id = settings.MS_TENANT_ID
    # client_id = settings.MS_CLIENT_ID
    # client_secret = settings.MS_CLIENT_SECRET

    # # Get access token
    # app = ConfidentialClientApplication(
    #     client_id,
    #     authority=f'https://login.microsoftonline.com/{tenant_id}',
    #     client_credential=client_secret,
    # )

    # result = app.acquire_token_for_client(
    #     scopes=['https://graph.microsoft.com/.default']
    # )

    # if 'access_token' in result:
    #     headers = {
    #         'Authorization': f"Bearer {result['access_token']}",
    #         'Content-Type': 'application/json'
    #     }

    #     event = {
    #         'subject': subject,
    #         'start': {
    #             'dateTime': start_time.isoformat(),
    #             'timeZone': 'UTC'
    #         },
    #         'end': {
    #             'dateTime': end_time.isoformat(),
    #             'timeZone': 'UTC'
    #         },
    #         'isOnlineMeeting': True,
    #         'onlineMeetingProvider': 'teamsForBusiness'
    #     }

    #     response = requests.post(
    #         'https://graph.microsoft.com/v1.0/me/events',
    #         headers=headers,
    #         json=event
    #     )

    #     if response.status_code == 201:
    #         return response.json()

    pass


def create_google_meet_example(summary, start_time, end_time):
    """
    Example Google Meet API integration

    Requires: pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client

    Setup:
    1. Create project in Google Cloud Console
    2. Enable Google Calendar API
    3. Create OAuth 2.0 credentials
    4. Download credentials JSON
    """
    from googleapiclient.discovery import build
    from google.oauth2 import service_account

    # This is example code - uncomment and configure in production
    # SCOPES = ['https://www.googleapis.com/auth/calendar']
    # SERVICE_ACCOUNT_FILE = 'path/to/credentials.json'

    # credentials = service_account.Credentials.from_service_account_file(
    #     SERVICE_ACCOUNT_FILE, scopes=SCOPES
    # )

    # service = build('calendar', 'v3', credentials=credentials)

    # event = {
    #     'summary': summary,
    #     'start': {
    #         'dateTime': start_time.isoformat(),
    #         'timeZone': 'UTC',
    #     },
    #     'end': {
    #         'dateTime': end_time.isoformat(),
    #         'timeZone': 'UTC',
    #     },
    #     'conferenceData': {
    #         'createRequest': {
    #             'requestId': str(uuid.uuid4()),
    #             'conferenceSolutionKey': {'type': 'hangoutsMeet'}
    #         }
    #     }
    # }

    # event_result = service.events().insert(
    #     calendarId='primary',
    #     body=event,
    #     conferenceDataVersion=1
    # ).execute()

    # return event_result

    pass
