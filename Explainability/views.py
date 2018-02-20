from django.http import HttpResponse
import datetime
import os

def current_datetime(request):
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)

def model_viewer(request):
    with open(os.path.join(os.path.dirname(__file__), "model_viewer.html"), "r") as f:
        html = f.read()
    return HttpResponse(html)
