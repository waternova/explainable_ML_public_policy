from django.shortcuts import render
from django.conf import settings
from django.utils import timezone

from rest_framework import viewsets

from .serializers import MlModelSerializer
from .serializers import FactorSerializer
from .serializers import CommentSerializer
from .serializers import UserSerializer
from .serializers import DataSetSerializer

from restapi.models import MlModel
from restapi.models import Factor
from restapi.models import Comment
from restapi.models import User
from restapi.models import DataSet

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

import json
import os
import pandas as pd

from restapi.machine_learning.logregmodel2 import test_model as test_logreg_model
from restapi.machine_learning.logregmodel2 import retrain, build_model_from_factors
from restapi.machine_learning.util import preparedata, drop_disabled_factors
from restapi.machine_learning.fairmodel import get_fair_thresholds
from restapi.util import get_numeric_columns, get_factor_list_from_file, get_column_names_from_file


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


class DateSetViewSet(viewsets.ModelViewSet):
    queryset = DataSet.objects.all()
    serializer_class = DataSetSerializer


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
        if "model_id" not in data or data["model_id"] is None:
            model_id = 1
        else:
            model_id = data["model_id"]
        mlmodel = MlModel.objects.get(pk=model_id)
        target_variable = mlmodel.target_variable
        dataset = mlmodel.dataset_id
        target_variable = mlmodel.target_variable
        dataFilePath = os.path.join(settings.MEDIA_ROOT, dataset.file.name)
        protected_attr = None
        for factor in data["factors"]:
            if factor["is_balanced"]:
                protected_attr = factor["name"]
        thresholds = None
        if "positive_threshold" in data and "negative_threshold" in data:
            thresholds = (data["negative_threshold"], data["positive_threshold"])
        numeric_columns = get_numeric_columns(model_id)
        factor_list_wo_categories = get_factor_list_from_file(dataFilePath, target_variable, numeric_columns)
        df_data = pd.read_csv(dataFilePath)
        y, X = preparedata(df_data, target_variable, factor_list_wo_categories)
        X = drop_disabled_factors(X, data["factors"])
        model = build_model_from_factors(data["factors"], data["intercept"], y, X)
        accuracy, confusion_matrix = test_logreg_model(model, X, y, thresholds, protected_attr)
        res = {'accuracy': accuracy, 'confusion_matrices': confusion_matrix}
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
        mlmodel = MlModel.objects.get(pk=model_id)
        dataset = mlmodel.dataset_id
        target_variable = mlmodel.target_variable
        dataFilePath = os.path.join(settings.MEDIA_ROOT, dataset.file.name)
        numeric_columns = get_numeric_columns(model_id)
        factor_list_wo_categories = get_factor_list_from_file(dataFilePath, target_variable, numeric_columns)
        model, model_description = retrain(factor_list_wo_categories, target_variable, data["factors"], dataFile=dataFilePath)
        # not enforced here: error if two factors are balanced
        protected_attr = None
        for factor in data["factors"]:
            if factor["is_balanced"]:
                protected_attr = factor["name"]
        df_data = pd.read_csv(dataFilePath)
        y, X = preparedata(df_data, target_variable, factor_list_wo_categories)
        X = drop_disabled_factors(X, data["factors"])
        if protected_attr is not None:
            thresholds = get_fair_thresholds(model, numeric_columns, protected_attr, dataFilePath, target_variable)
            model_description["positive_threshold"] = thresholds[0]
            model_description["negative_threshold"] = thresholds[1]
            accuracy, confusion_matrices = test_logreg_model(model, X, y, thresholds, protected_attr)
        else:
            accuracy, confusion_matrices = test_logreg_model(model, X, y)
        model_description['accuracy'] = accuracy
        model_description['confusion_matrices'] = confusion_matrices
        return Response(model_description, status=status.HTTP_200_OK)
    else:
        return Response('HTTP_400_BAD_REQUEST', status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def new_model_with_factor_creation(request):
    # expects JSON with name, description, and dataset_id
    if request.method != 'POST':
        return Response('HTTP_400_BAD_REQUEST', status=status.HTTP_400_BAD_REQUEST)
    data = json.loads(request.body.decode('utf-8'))
    # Save new model
    dataset_id = data['dataset_id']
    non_categorical_columns = data['non_categorical_columns']
    target_variable = data['target_variable']
    newModel = MlModel(
        name = data['name'], 
        description = data['description'], 
        dataset_id = DataSet.objects.get(pk=dataset_id), 
        modified = timezone.now(),
        non_categorical_columns = non_categorical_columns,
        target_variable = target_variable
    )
    newModel.save()
    # Get factor names from file
    dataset = DataSet.objects.get(pk=dataset_id)
    dataFilePath = os.path.join(settings.MEDIA_ROOT, dataset.file.name)
    numeric_columns = non_categorical_columns.split(',')
    factor_list = get_factor_list_from_file(dataFilePath, target_variable, numeric_columns)
    y,X = preparedata(pd.read_csv(dataFilePath), target_variable, factor_list)
    factors_to_save = X.columns.values.tolist()
    # Save factors
    for factor in factors_to_save:
        newFactor = Factor(
            name = factor,
            alias = factor,
            weight = 0,
            model_id = newModel
        )
        newFactor.save()
    return Response(newModel.id, status=status.HTTP_200_OK)
