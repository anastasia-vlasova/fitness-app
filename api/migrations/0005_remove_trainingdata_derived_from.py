# Generated by Django 4.1.5 on 2023-10-06 23:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_trainingdata_max_speed'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trainingdata',
            name='derived_from',
        ),
    ]
