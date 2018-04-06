from django.db import models

# Create your models here.
from rest_framework import serializers
from restapi.models import MlModel
from restapi.models import Factor
from restapi.models import Comment
from restapi.models import User
from restapi.models import DataSet
from restapi.models import MlModelDetail

from rest_framework_bulk import BulkListSerializer
from rest_framework_bulk import BulkSerializerMixin


class MlModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MlModel
        fields = ('id', 'name', 'description', 'accuracy', 'parent_id', 
            'intercept', 'dataset_id', 'non_categorical_columns', 
            'target_variable', 'negative_threshold', 'positive_threshold', 
            'modified')


class FactorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factor
        fields = ('id', 'alias', 'name', 'description', 'weight', 'is_binary', 'is_balanced', 'is_enabled', 'model_id')


class FactorBulkSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta(object):
        model = Factor
        # only necessary in DRF3
        list_serializer_class = BulkListSerializer
        fields = ('id', 'alias', 'name', 'description', 'weight', 'is_binary', 'is_balanced', 'is_enabled', 'model_id')


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'user_name', 'updated_datetime', 'comment_text', 'factor_id', 'model_id')


class CommentBulkSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta(object):
        model = Comment
        # only necessary in DRF3
        list_serializer_class = BulkListSerializer
        fields = ('id', 'user_name', 'updated_datetime', 'comment_text', 'factor_id', 'model_id')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'user_name', 'password', 'user_type')


class DataSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSet
        fields = ('id', 'name', 'description', 'modified', 'file')


class MlModelDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = MlModelDetail
        fields = ('id', 'model_id', 'type', 'intValue')
