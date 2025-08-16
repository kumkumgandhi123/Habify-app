# Models import
from django.contrib.auth.models import User
from .models import *
from rewards_app.models import *
# Render import
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
# DRF import
from rest_framework.decorators import api_view
from rest_framework import generics
from .serializers import *
# Auth import
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
# Extra
from datetime import datetime, timedelta

def landing(request):
    return render(request, 'index.html')


# Accounts


@api_view(['POST'])
def CreateUser(request):
    if request.method == 'POST':
        try:
            print(request.data) 

            # Check if user already exists
            if User.objects.filter(username=request.data['username']).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
            
            # Check if email already exists
            email = request.data.get('email', '').strip()
            if email and User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email address already exists'}, status=400)

            user = User.objects.create_user(
                username=request.data['username'],
                first_name=request.data['first_name'],
                last_name=request.data['last_name'],
                password=request.data['password'],
                email=request.data.get('email', '')
            )
            profile = Profile.objects.create(
                user=user,
                coins=100,  # Starting coins
                streak=0
            )
            badge = StreakBadge.objects.create(
                user=user,
            )

            log_user = authenticate(username=request.data['username'], password=request.data['password'])
            login(request, log_user)
            
            return JsonResponse({
                'success': True,
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@api_view(['POST'])
def login_user(request):
    if request.method == 'POST':
        try:
            user = authenticate(request, username=request.data['username'], password=request.data['password'])
            if user is not None:
                print('User Logged in - views.py')
                login(request, user)
                return JsonResponse({
                    'success': True,
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email
                })
            else:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@api_view(['POST'])
def logout_user(request):
    try:
        logout(request)
        return JsonResponse({'success': True, 'message': 'Logged out successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


# Auth
def get_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


# Calendar
class DayLogView(generics.ListAPIView):
    queryset = Day.objects.all()
    serializer_class = DayLogSerializer



@api_view(['POST'])
def NewDayLog(request):
    if request.method == 'POST':
        user_profile = Profile.objects.get(user=request.user)
        user_days = Day.objects.filter(user=request.user)
        user_badge = StreakBadge.objects.get(user=request.user)
        activity = request.data['activity']
        yesterdays_date = str(datetime.now() + timedelta(days=-1))[0:10]
    
        new_day = Day.objects.create(
            user=request.user,
            day=str(datetime.now())[0:10],
            activity = activity,
            notes = request.data['notes']
        )

        if activity == 1 or yesterdays_date != str(user_profile.last_updated) and len(user_days) > 1: # checks if a day was missed or for unsober and if its users first log
            user_profile.streak = 0
            user_badge.weeks = 0
            user_badge.color = "#ffffff"
            user_badge.multiplyer = 1
            if activity == 1: # ensures coins are only affected when unsober
                if user_profile.coins - 10 < 0:
                    user_profile.coins = 0
                else:
                    user_profile.coins -= 10
            user_profile.last_updated = datetime.now()
            user_profile.save()
            user_badge.save()
        elif activity == 5:

            user_profile.streak += 1
            user_profile.coins += 50 * user_badge.multiplyer
            user_profile.last_updated = datetime.now()
            user_profile.save()

            # Updates streaks badge
            if user_profile.streak % 7 == 0: 
                user_badge.color = 'grey'
                user_badge.multiplyer = 1.125
                user_badge.weeks += 1
                # Check how many weeks
                weeks = user_badge.weeks + 1
                if weeks == 4:
                    user_badge.color = 'yellow'
                    user_badge.multiplyer = 1.25
                elif weeks == 13:
                    user_badge.color = 'green'
                    user_badge.multiplyer = 1.5
                elif weeks == 26:
                    user_badge.color = 'blue'
                    user_badge.multiplyer = 1.75
                elif weeks == 39:
                    user_badge.color = 'purple'
                    user_badge.multiplyer = 2
                elif weeks == 52:
                    user_badge.color = 'orange'
                    user_badge.multiplyer = 2.5
                user_badge.save()

        return render(request, 'index.html')

class ProfileView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer