from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Rewards(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.IntegerField(default=350)
    img = models.CharField(max_length=999)
    title = models.CharField(max_length=50)
    def __str__(self):
        return f"{self.user}-{self.title}-{self.price}-{self.img}"

class StreakBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    weeks = models.IntegerField(default=0)
    color = models.CharField(max_length=10, default="#ffffff")
    multiplyer = models.FloatField(default=1)
    def __str__(self):
        return f"{self.user}-{self.weeks}-{self.multiplyer}-{self.color}"

# Streak badge milestones
'''
-1 week (grey) (*1.125)
-4 weeks (1 month) (yellow) (*1.25)
-13 weeks (3 months) (green) (*1.5)
-26 weeks (6 months) (blue) (*1.75)
-39 weeks (9 months) (purple) (*2)
-52 weeks (1 year) (orange) (*2.5)
'''