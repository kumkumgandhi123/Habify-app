from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *



class ShopSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Rewards
        fields = ('__all__')
