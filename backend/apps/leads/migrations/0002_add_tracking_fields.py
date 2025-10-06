# Generated migration for lead tracking fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0001_initial'),
    ]

    operations = [
        # Add response time tracking fields
        migrations.AddField(
            model_name='lead',
            name='first_contacted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='lead',
            name='qualified_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='lead',
            name='converted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        
        # Add traffic analytics fields
        migrations.AddField(
            model_name='lead',
            name='referrer_url',
            field=models.URLField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='lead',
            name='landing_page',
            field=models.URLField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='lead',
            name='utm_source',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='lead',
            name='utm_medium',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='lead',
            name='utm_campaign',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]