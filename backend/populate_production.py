#!/usr/bin/env python
"""
Script to populate production database with industry page data via Django shell
Run this with: railway run python populate_production.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.content.management.commands.populate_industry_pages import Command

print("Starting industry pages population...")
command = Command()
command.handle()
print("✓ Industry pages populated successfully!")
