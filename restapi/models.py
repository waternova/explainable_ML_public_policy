from django.db import models

# Create your models here.


class MlModel(models.Model):
    #id = models.AutoField() --> Default id will be added by Django
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=65535, null=True)
    accuracy = models.FloatField(null=True)
    intercept = models.FloatField(null=True)
    parent_id = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    modified = models.DateTimeField(auto_now_add=True, blank=True)


class Factor(models.Model):
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255)
    description = models.TextField(max_length=65535, null=True)
    weight = models.FloatField()
    balanced = models.BooleanField()
    enabled = models.BooleanField()
    model_id = models.ForeignKey('MlModel', on_delete=models.CASCADE)


class Comment (models.Model):
    user_name = models.CharField(max_length=255)
    updated_datetime = models.DateTimeField()
    comment_text = models.TextField(max_length=65535)
    factor_id = models.ForeignKey('Factor', on_delete=models.CASCADE)


class User (models.Model):
    user_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    user_type = models.IntegerField()
