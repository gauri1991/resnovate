#!/usr/bin/env python
"""
Production setup script for Railway deployment
Automatically sets up database and creates superuser if needed
"""
import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.contrib.auth.models import User
from django.db import IntegrityError

def setup_production():
    """Setup production database and create superuser"""
    
    print("🚀 Starting production setup...")
    
    # 1. Run migrations
    print("📊 Running database migrations...")
    try:
        execute_from_command_line(['manage.py', 'migrate', '--noinput'])
        print("✅ Migrations completed successfully")
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    # 2. Create superuser if it doesn't exist
    print("👤 Checking for superuser...")
    try:
        if not User.objects.filter(is_superuser=True).exists():
            print("🔧 Creating superuser...")
            
            # Get credentials from environment or use defaults
            username = os.environ.get('ADMIN_USERNAME', 'admin')
            email = os.environ.get('ADMIN_EMAIL', 'admin@resnovate.in')
            password = os.environ.get('ADMIN_PASSWORD', 'resnovate2024!')
            
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            
            print("✅ Superuser created successfully!")
            print(f"   Username: {username}")
            print(f"   Email: {email}")
            print("   Password: (set from ADMIN_PASSWORD env var or default)")
            print("⚠️  Please change the password after first login!")
        else:
            existing_superuser = User.objects.filter(is_superuser=True).first()
            print(f"✅ Superuser already exists: {existing_superuser.username}")
            
    except IntegrityError as e:
        print(f"ℹ️  Superuser might already exist: {e}")
    except Exception as e:
        print(f"❌ Error creating superuser: {e}")
        return False
    
    # 3. Collect static files
    print("📁 Collecting static files...")
    try:
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
        print("✅ Static files collected successfully")
    except Exception as e:
        print(f"⚠️  Static files collection failed: {e}")
        # Don't return False here as this isn't critical
    
    # 4. Seed CMS sections if they don't exist
    print("🌱 Checking CMS sections...")
    try:
        from apps.content.models import PageSection

        if not PageSection.objects.exists():
            print("🔧 Seeding CMS sections...")
            import subprocess
            result = subprocess.run(
                [sys.executable, 'seed_cms_sections.py'],
                cwd=os.path.dirname(os.path.abspath(__file__)),
                capture_output=True,
                text=True
            )

            if result.returncode == 0:
                print("✅ CMS sections seeded successfully!")
                print(result.stdout)
            else:
                print(f"⚠️  CMS seeding had issues: {result.stderr}")
                # Don't fail deployment if seeding fails
        else:
            section_count = PageSection.objects.count()
            print(f"✅ CMS sections already exist ({section_count} sections)")

    except Exception as e:
        print(f"⚠️  Error checking/seeding CMS sections: {e}")
        # Don't return False here as this isn't critical for deployment

    print("🎉 Production setup completed successfully!")
    return True

if __name__ == '__main__':
    success = setup_production()
    if not success:
        sys.exit(1)