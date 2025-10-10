#!/usr/bin/env python
"""
Diagnostic script to check production deployment status
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection
from apps.content.models import PageSection
from django.contrib.auth.models import User

def check_production():
    """Check production deployment status"""

    print("=" * 60)
    print("PRODUCTION DEPLOYMENT DIAGNOSTIC")
    print("=" * 60)

    # 1. Check database connection
    print("\n1. DATABASE CONNECTION")
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            print("   ✅ Database connection successful")
            print(f"   Database: {connection.settings_dict['NAME']}")
    except Exception as e:
        print(f"   ❌ Database connection failed: {e}")
        return False

    # 2. Check if tables exist
    print("\n2. DATABASE TABLES")
    try:
        tables = connection.introspection.table_names()
        print(f"   Total tables: {len(tables)}")

        required_tables = [
            'content_pagesection',
            'auth_user',
            'leads_lead',
            'content_mediafile'
        ]

        for table in required_tables:
            if table in tables:
                print(f"   ✅ {table} exists")
            else:
                print(f"   ❌ {table} missing")

    except Exception as e:
        print(f"   ❌ Error checking tables: {e}")
        return False

    # 3. Check PageSection model
    print("\n3. PAGESECTION MODEL")
    try:
        count = PageSection.objects.count()
        print(f"   Total PageSections: {count}")

        if count == 0:
            print("   ⚠️  No PageSections found - seeding may have failed")
        else:
            pages = PageSection.objects.values('page_identifier').distinct()
            print(f"   Pages with sections: {[p['page_identifier'] for p in pages]}")

            for page in pages:
                page_count = PageSection.objects.filter(
                    page_identifier=page['page_identifier']
                ).count()
                print(f"   - {page['page_identifier']}: {page_count} sections")

    except Exception as e:
        print(f"   ❌ Error checking PageSections: {e}")
        import traceback
        traceback.print_exc()
        return False

    # 4. Check superuser
    print("\n4. SUPERUSER")
    try:
        superusers = User.objects.filter(is_superuser=True)
        if superusers.exists():
            for su in superusers:
                print(f"   ✅ Superuser exists: {su.username} ({su.email})")
        else:
            print("   ⚠️  No superuser found")
    except Exception as e:
        print(f"   ❌ Error checking superuser: {e}")

    # 5. Check environment
    print("\n5. ENVIRONMENT")
    print(f"   DEBUG: {os.environ.get('DEBUG', 'Not set')}")
    print(f"   DATABASE_URL: {'Set' if os.environ.get('DATABASE_URL') else 'Not set'}")
    print(f"   ALLOWED_HOSTS: {os.environ.get('ALLOWED_HOSTS', 'Not set')}")

    print("\n" + "=" * 60)
    print("DIAGNOSTIC COMPLETE")
    print("=" * 60)

    return True

if __name__ == '__main__':
    try:
        success = check_production()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
