from django.contrib import admin
from . import models

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username')

class TrainingDataAdmin(admin.ModelAdmin):
    list_display = ('id',
                    'user', 
                    'track_id', 
                    'sport', 
                    'date', 
                    'start_time',
                    'duration',
                    'distance',
                    'average_hr',
                    'average_speed',
                    'max_speed',
                    'average_pace',
                    'max_pace',
                    'calories',
                    'fat_percentage',
                    'average_cadence',
                    'running_index',
                    'training_load',
                    'ascent',
                    'descent',
                     )

admin.site.register(models.User, UserAdmin)

admin.site.register(models.TrainingData, TrainingDataAdmin)
