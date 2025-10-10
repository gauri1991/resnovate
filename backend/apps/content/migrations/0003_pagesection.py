# Generated manually for PageSection model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0002_add_mediafile_model'),
    ]

    operations = [
        migrations.CreateModel(
            name='PageSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page_identifier', models.CharField(choices=[('homepage', 'Homepage'), ('about', 'About Page'), ('services', 'Services Page'), ('case_studies', 'Case Studies Page'), ('research_insights', 'Research Insights Page'), ('contact', 'Contact Page'), ('resources', 'Resources Page')], max_length=50)),
                ('section_name', models.CharField(max_length=100)),
                ('section_key', models.CharField(max_length=100)),
                ('enabled', models.BooleanField(default=True)),
                ('order', models.IntegerField(default=0)),
                ('content', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Page Section',
                'verbose_name_plural': 'Page Sections',
                'ordering': ['page_identifier', 'order'],
                'unique_together': {('page_identifier', 'section_key')},
            },
        ),
    ]
