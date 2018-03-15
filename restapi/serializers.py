from django.db import models

# Create your models here.
from rest_framework import serializers
from restapi.models import MlModel
from restapi.models import Factor
from restapi.models import Comment
from restapi.models import User

class MlModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MlModel
        fields = ('id', 'name', 'description', 'accuracy', 'parent_id', 'intercept', 'modified')


class FactorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factor
        fields = ('id', 'alias', 'name', 'description', 'weight', 'balanced', 'enabled', 'model_id')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'user_name', 'updated_datetime', 'comment_text', 'factor_id')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'user_name', 'password', 'user_type')

