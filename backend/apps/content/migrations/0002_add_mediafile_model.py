# Generated migration for MediaFile model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils import timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('content', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MediaFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('original_name', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to='media/%Y/%m/')),
                ('type', models.CharField(max_length=100)),
                ('size', models.BigIntegerField()),
                ('category', models.CharField(choices=[('image', 'Image'), ('video', 'Video'), ('document', 'Document'), ('audio', 'Audio'), ('other', 'Other')], default='other', max_length=20)),
                ('tags', models.JSONField(blank=True, default=list)),
                ('alt_text', models.CharField(blank=True, max_length=255)),
                ('description', models.TextField(blank=True)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('usage_count', models.IntegerField(default=0)),
                ('is_public', models.BooleanField(default=True)),
                ('folder', models.CharField(blank=True, max_length=100)),
                ('uploaded_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='uploaded_files', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-uploaded_at'],
            },
        ),
    ]
