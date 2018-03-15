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


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def GetFactors(request):
    if request.method == 'GET':
        model_id = request.GET.get('model_id')
        if model_id is not None:
            factor_obj = Factor.objects.filter(model_id=int(model_id))
            factor_serializer = FactorSerializer(factor_obj, many=True)
            return Response({'factors': factor_serializer.data}, status=status.HTTP_200_OK)
    return Response("HTTP_400_BAD_REQUEST", status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def GetModels(request):
    if request.method == 'GET':
        #model_id = request.GET.get('model_id')
        #//if model_id is not None:
        model_obj = MlModel.objects.all()
        model_serializer = MlModelSerializer(model_obj, many=True)
        return Response({'models': model_serializer.data}, status=status.HTTP_200_OK)
    return Response("HTTP_400_BAD_REQUEST", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def GetComments(request):
    if request.method == 'GET':
        factor_id = request.GET.get('factor_id')
        if factor_id is not None:
            comment_obj = Comment.objects.filter(factor_id=int(factor_id))
            comment_serializer = CommentSerializer(comment_obj, many=True)
            return Response({'comments': comment_serializer.data}, status=status.HTTP_200_OK)
    return Response("HTTP_400_BAD_REQUEST", status=status.HTTP_400_BAD_REQUEST)

import json
from restapi.logregmodel2 import logreg

@api_view(['POST'])
def TestModel(request):
    if request.method == 'POST':
        coefdata = json.loads(request.body.decode('utf-8'))
        res = {'accuracy': logreg(coefdata)}
        return Response(res, status=status.HTTP_200_OK)
    return Response('HTTP_400_BAD_REQUEST', status=status.HTTP_400_BAD_REQUEST)
