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

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

import json
from restapi.machine_learning.logregmodel2 import test_model as test_logreg_model
from restapi.machine_learning.logregmodel2 import retrain
from restapi.machine_learning.fairmodel import get_fair_thresholds


class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MlModel.objects.all()
    serializer_class = MlModelSerializer


class FactorViewSet(viewsets.ModelViewSet):
    queryset = Factor.objects.all()
    serializer_class = FactorSerializer
'''
    def get_serializer(self, instance=None, data=None, many=False, partial=False):
        if isinstance(data, list):
            many = True
        serializer = super(FactorViewSet, self).get_serializer(instance=instance, data=data, many=many, partial=partial)
        serializer.is_valid()
        return serializer
            #super(FactorViewSet, self).get_serializer(instance=instance, data=data, many=many, partial=partial)
'''


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(['GET', 'PATCH'])
def factors(request):
    if request.method == 'GET':
        model_id = request.GET.get('model_id')
        if model_id is not None:
            factors_obj = Factor.objects.filter(model_id=int(model_id))
            serializer = FactorSerializer(factors_obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    return Response("HTTP_400_BAD_REQUEST", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def del_factors(request):
    if request.method == 'GET':
        model_id = request.GET.get('model_id')
        if model_id is not None:
            factors_obj = Factor.objects.filter(model_id=int(model_id))
            count = 0
            for factor in factors_obj:
                factor.delete()
                count = count + 1
            return Response({'deleted': count}, status=status.HTTP_200_OK)
    return Response("HTTP_400_BAD_REQUEST", status=status.HTTP_400_BAD_REQUEST)


'''
    elif request.method == 'PATCH':
            factors_obj = Factor.objects.all()
            print(factors_obj[0].id)
            data = json.loads(request.body.decode('utf-8'))
            print(request.data[0])
            serializer = FactorListSerializer(factors_obj, data=data)
            serializer.is_valid()
            #serializer.save()
            return Response("Updated factors", status=status.HTTP_200_OK)
            #return Response("HTTP_400_BAD_REQUEST", status=status.HTTP_400_BAD_REQUEST)
'''



@api_view(['GET'])
def get_models(request):
    if request.method == 'GET':
        #model_id = request.GET.get('model_id')
        #//if model_id is not None:
        model_obj = MlModel.objects.all()
        model_serializer = MlModelSerializer(model_obj, many=True)
        return Response(model_serializer.data, status=status.HTTP_200_OK)
    return Response("HTTP_400_BAD_REQUEST", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_comments(request):
    if request.method == 'GET':
        factor_id = request.GET.get('factor_id')
        if factor_id is not None:
            comment_obj = Comment.objects.filter(factor_id=int(factor_id))
            comment_serializer = CommentSerializer(comment_obj, many=True)
            return Response({'comments': comment_serializer.data}, status=status.HTTP_200_OK)
    return Response("HTTP_400_BAD_REQUEST", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def test_model(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        protected_attr = None
        for factor in data["factors"]:
            if factor["is_balanced"]:
                protected_attr = factor["name"]
        thresholds = None
        if "positive_threshold" in data and "negative_threshold" in data:
            thresholds = (data["positive_threshold"], data["negative_threshold"])
        res = {'accuracy': test_logreg_model(data["factors"], data["intercept"], thresholds, protected_attr)}
        return Response(res, status=status.HTTP_200_OK)
    return Response('HTTP_400_BAD_REQUEST', status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def retrain_model(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        if "model_id" not in data or data["model_id"] is None:
            model_id = 1
        else:
            model_id = data["model_id"]
        # TODO: look up dataFile from database
        model, model_description = retrain(data["factors"], dataFile='df_math_cleaned.csv')
        # TODO: error if two factors are balanced
        protected_attr = None
        for factor in data["factors"]:
            if factor["is_balanced"]:
                protected_attr = factor["name"]
        if protected_attr is not None:
            thresholds = get_fair_thresholds(model, protected_attr, dataFile='df_math_cleaned.csv')
            model_description["positive_threshold"] = thresholds[0]
            model_description["negative_threshold"] = thresholds[1]
            accuracy = test_logreg_model(model_description['factors'], data['intercept'], thresholds, protected_attr)
        else:
            accuracy = test_logreg_model(model_description['factors'], data['intercept'])
        model_description['accuracy'] = accuracy
        return Response(model_description, status=status.HTTP_200_OK)
    else:
        return Response('HTTP_400_BAD_REQUEST', status=status.HTTP_400_BAD_REQUEST)
