from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import generics
from .serializers import *
from .models import *
from user_app.models import *
# Create your views here.


class RewardsView(generics.ListAPIView):
    queryset = Rewards.objects.all()
    serializer_class = ShopSerializer

@api_view(['POST'])
def BuyReward(request):
    if request.method == "POST":
        print(request.data)
        price = request.data['price']
        customer = User.objects.get(username=request.data['user'])
        profile = Profile.objects.get(user=customer)
        print(profile.coins, '=========')
        if int(profile.coins) >= price:
            profile.coins -= price
            reward = Rewards.objects.create(
                price = price,
                img = request.data['img'],
                user = customer,
                title = request.data['title']
            )
            profile.save()
    return render(request, 'index.html')