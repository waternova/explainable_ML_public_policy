# Generated by Django 2.0.2 on 2018-03-26 23:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0002_auto_20180325_1352'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataset',
            name='content',
            field=models.FileField(blank=True, upload_to='datasets/'),
        ),
        migrations.AlterField(
            model_name='dataset',
            name='modified',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]