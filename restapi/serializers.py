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
        #list_serializer_class = FactorListSerializer

'''
class FactorListSerializer(serializers.ListSerializer):
    child = FactorSerializer()

    def update(self, instance, validated_data):
        # Maps for id->instance and id->data item.
        for item in validated_data:
            print(item)
        factor_mapping = {factor.id: factor for factor in instance}
        data_mapping = {item.id: item for item in validated_data}
        ret = []
        for factor_id, data in data_mapping.items():
            factor = factor_mapping.get(factor_id, None)
            if factor in None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(factor, data))
        #No deletions
        return ret
'''

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'user_name', 'updated_datetime', 'comment_text', 'factor_id')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'user_name', 'password', 'user_type')

