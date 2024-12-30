from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petsphere.settings')

app = Celery('petsphere')

app.config_from_object('django.conf:settings', namespace='CELERY')


# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
