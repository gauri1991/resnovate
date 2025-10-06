# Initial migration for analytics app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PageView',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.CharField(max_length=500)),
                ('title', models.CharField(blank=True, max_length=200)),
                ('visitor_id', models.CharField(max_length=100)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('session_id', models.CharField(max_length=100)),
                ('is_unique', models.BooleanField(default=False)),
                ('referrer', models.URLField(blank=True, max_length=500)),
                ('referrer_domain', models.CharField(blank=True, max_length=200)),
                ('user_agent', models.TextField(blank=True)),
                ('device_type', models.CharField(blank=True, max_length=50)),
                ('browser', models.CharField(blank=True, max_length=100)),
                ('os', models.CharField(blank=True, max_length=100)),
                ('utm_source', models.CharField(blank=True, max_length=100)),
                ('utm_medium', models.CharField(blank=True, max_length=100)),
                ('utm_campaign', models.CharField(blank=True, max_length=100)),
                ('utm_term', models.CharField(blank=True, max_length=100)),
                ('utm_content', models.CharField(blank=True, max_length=100)),
                ('timestamp', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('time_on_page', models.IntegerField(blank=True, null=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('click', 'Click'), ('form', 'Form'), ('scroll', 'Scroll'), ('download', 'Download'), ('video', 'Video'), ('engagement', 'Engagement')], max_length=50)),
                ('action', models.CharField(max_length=200)),
                ('label', models.CharField(blank=True, max_length=200)),
                ('value', models.IntegerField(blank=True, null=True)),
                ('page_path', models.CharField(max_length=500)),
                ('visitor_id', models.CharField(max_length=100)),
                ('session_id', models.CharField(max_length=100)),
                ('timestamp', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
        migrations.AddIndex(
            model_name='pageview',
            index=models.Index(fields=['path', 'timestamp'], name='analytics_p_path_fa2c8f_idx'),
        ),
        migrations.AddIndex(
            model_name='pageview',
            index=models.Index(fields=['visitor_id', 'timestamp'], name='analytics_p_visitor_bbceed_idx'),
        ),
        migrations.AddIndex(
            model_name='pageview',
            index=models.Index(fields=['session_id'], name='analytics_p_session_a1ba7e_idx'),
        ),
        migrations.AddIndex(
            model_name='event',
            index=models.Index(fields=['category', 'action'], name='analytics_e_categor_d0c4e5_idx'),
        ),
        migrations.AddIndex(
            model_name='event',
            index=models.Index(fields=['visitor_id', 'timestamp'], name='analytics_e_visitor_be5c59_idx'),
        ),
    ]
