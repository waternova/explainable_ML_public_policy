# Generated by Django 2.0.2 on 2018-03-27 06:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0003_auto_20180326_1650'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dataset',
            name='content',
        ),
        migrations.AddField(
            model_name='dataset',
            name='file',
            field=models.FileField(blank=True, upload_to=''),
        ),
    ]
