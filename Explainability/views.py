from django.http import HttpResponse
# from django.shortcuts import render
import os

def model_viewer(request):
    with open(os.path.join(os.path.dirname(__file__), "client/build/index.html"), "r") as f:
        html = f.read()
    return HttpResponse(html)
    # context = {}
    # return render(request, 'Explainability/model_viewer.html', context)
def landingpage(request):
	t = loader.get_template('Explainability/templates/landing_page.html')
	c = {'foo': 'bar'}
	return HttpResponse(t.render(c, request), content_type='application/xhtml+xml')