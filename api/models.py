from django.db import models
from django.contrib.auth.models import AbstractUser
from picklefield.fields import PickledObjectField

# Create your models here.
class User(AbstractUser):
    def serialize(self):
            return {
                'id': self.id,
                'username': self.username,
                }
    
class TrainingData(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='activities')
    data = PickledObjectField()
    timestamp = models.DateTimeField(auto_now_add=True)
    track_id = models.TextField(max_length=256, blank=True)
    sport = models.TextField(max_length=256)
    date = models.DateField(null=True)
    start_time = models.TimeField()
    duration = models.TimeField()
    distance = models.DecimalField(decimal_places=2, max_digits=8) # km
    average_hr = models.DecimalField(decimal_places=0, max_digits=3)
    average_speed = models.DecimalField(decimal_places=2, max_digits=4)
    max_speed = models.DecimalField(decimal_places=2, max_digits=5)
    average_pace = models.TimeField(blank=True)
    max_pace = models.TimeField(blank=True)
    calories = models.DecimalField(decimal_places=0, max_digits=6)
    fat_percentage = models.DecimalField(decimal_places=0, max_digits=2)
    average_cadence = models.DecimalField( decimal_places=0, max_digits=3, blank=True, null=True)
    running_index = models.DecimalField(decimal_places=0, max_digits=3, blank=True, null=True)
    training_load = models.DecimalField(decimal_places=0, max_digits=3)
    ascent = models.DecimalField(decimal_places=0, max_digits=6)
    descent = models.DecimalField(decimal_places=0, max_digits=6)

    
    def serialize(self):
        """ meta only """
        return {
            'id': self.id,
            'timestamp': self.timestamp,
            'sport': self.sport,
            'date': self.date,
            'start_time': self.start_time,
            'duration': self.duration,
            'distance': self.distance,
            'average_hr': self.average_hr,
            'average_speed': self.average_speed,
            'max_speed': self.max_speed,
            'average_pace': self.average_pace,
            'max_pace': self.max_pace,
            'calories': self.calories,
            'fat_percentage': self.fat_percentage,
            'average_cadence': self.average_cadence,
            'running_index': self.running_index,
            'training_load': self.training_load,
            'ascent': self.ascent,
            'descent': self.descent,
            'track_id': self.track_id,
            }
    
    def serialize_data(self):
        return {
            'id': self.id,
            'data': self.data.to_dict('list')
             }