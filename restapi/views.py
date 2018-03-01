from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .serializers import MlModelSerializer
from .serializers import FactorSerializer
from .serializers import CommentSerializer
from .serializers import UserSerializer

from restapi.models import MlModel
from restapi.models import Factor
from restapi.models import Comment
from restapi.models import User


class MlModelViewSet(viewsets.ModelViewSet):
    queryset = MlModel.objects.all()
    serializer_class = MlModelSerializer

class FactorViewSet(viewsets.ModelViewSet):
    queryset = Factor.objects.all()
    serializer_class = FactorSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
