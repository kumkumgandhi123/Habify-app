from django.db import models
from datetime import datetime
from django.contrib.auth.models import User
# Create your models here.
class Day(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.DateField(default=datetime.now, blank=True)
    activity = models.IntegerField(default=0)
    notes = models.CharField(max_length=250)
    def __str__(self):
        return f"{self.user}, {self.day}, {self.activity}"

class Profile(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    streak = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)
    pfp = models.CharField(max_length=100, default='/static/imgs/pets/0.png', blank=True, null=True)
    last_updated = models.DateField(default=datetime.now, blank=True)
    def __str__(self):
        return f"{self.user}, {self.streak} days, {self.coins} coins"