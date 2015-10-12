from time import datetime
from celery import Celery

BROKER_URL = 'sqla+mysql://root@localhost/inferno'
app = Celery('task', broker=BROKER_URL) 