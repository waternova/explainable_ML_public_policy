# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2018-04-03 15:00
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0007_mlmodel_target_variable'),
    ]

    operations = [
        migrations.CreateModel(
            name='MlModelDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=255)),
                ('intValue', models.IntegerField()),
                ('model_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='restapi.MlModel')),
            ],
        ),
    ]
