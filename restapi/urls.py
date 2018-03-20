"""tutorial URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from rest_framework import routers
from restapi import views

router = routers.DefaultRouter()
router.register(r'model', views.MLModelViewSet)
router.register(r'factor', views.FactorViewSet)
router.register(r'comment', views.CommentViewSet)
router.register(r'user', views.UserViewSet)

urlpatterns = [
    url(r'^getmodels/', views.get_models, name='GetModels'),
    url(r'^factors/', views.factors, name='Factors'),
    url(r'^delfactors/', views.del_factors, name='DelFactors'),
    url(r'^getcomments/', views.get_comments, name='GetComments'),
    url(r'^testmodel/', views.test_model, name='TestModel'),
    url(r'^retrainmodel/', views.retrain_model, name='RetrainModel'),
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    #url(r'^model/$', views.MlModelListView.as_view()),
    #url(r'^model/(?P<pk>[0-9]+)/$', views.MlModelItemView.as_view()),
]

'''
    url(r'^factor/$', views.FactorListView.as_view()),
    url(r'^factor/(?P<pk>[0-9]+)/$', views.FactorItemView.as_view()),
'''