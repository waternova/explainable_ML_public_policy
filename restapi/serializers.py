from django.db import models

# Create your models here.
from rest_framework import serializers
from restapi.models import MlModel
from restapi.models import Factor
from restapi.models import Comment
from restapi.models import User

class MlModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MlModel
        fields = ('name', 'description', 'accuracy', 'parent_id')


class FactorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Factor
        fields = ('org_name', 'name', 'description', 'weight', 'intercept', 'balanced', 'enabled', 'model_id')

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ('user_name', 'updated_datetime', 'comment_text', 'factor_id')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('user_name', 'password', 'user_type')

