import os
from celery import Celery
from celery.schedules import crontab
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'home.settings.base')
celery_app = Celery('home')
celery_app.config_from_object('django.conf.settings', namespace='CELERY')
celery_app.conf.beat_schedule = {
    # 'add-3-minutes': {
    #     'task': 'core.tasks.adding_task',
    #     'schedule': crontab(minute='*/3'),
    #     'args': (5, 9)
    # },
    'charge-5-minutes': {
        'task': 'core.tasks.charge_loans',
        'schedule': crontab(minute='*/3'),
        # 'args': ('my_view',)
    },

}
celery_app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)