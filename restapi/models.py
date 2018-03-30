from django.db import models

# Create your models here.


class MlModel(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=65535, null=True, blank=True)
    accuracy = models.FloatField(null=True)
    intercept = models.FloatField(null=True)
    dataset_id = models.ForeignKey('DataSet', on_delete=models.CASCADE, null=True)
    non_categorical_columns = models.TextField(max_length=65535, null=True, blank=True)
    parent_id = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    modified = models.DateTimeField(auto_now_add=False, blank=True)


class Factor(models.Model):
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255)
    description = models.TextField(max_length=65535, null=True, blank=True)
    weight = models.FloatField()
    is_balanced = models.BooleanField(default=False)
    is_binary = models.BooleanField(default=False)
    is_enabled = models.BooleanField(default=True)
    model_id = models.ForeignKey('MlModel', on_delete=models.CASCADE)


class Comment (models.Model):
    user_name = models.CharField(max_length=255)
    updated_datetime = models.DateTimeField()
    comment_text = models.TextField(max_length=65535, null=True, blank=True)
    factor_id = models.ForeignKey('Factor', on_delete=models.CASCADE)


class User (models.Model):
    user_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    user_type = models.IntegerField()


class DataSet(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=65535, null=True, blank=True)
    modified = models.DateTimeField(auto_now_add=True, blank=True)
    file = models.FileField(blank=True)


