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
# Email and password reset imports
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
# Extra
from datetime import datetime, timedelta

def landing(request):
    return render(request, 'index.html')


# Accounts


@api_view(['POST'])
def CreateUser(request):
    if request.method == 'POST':
        try:
            # Debug: print(request.data) 

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
            username = request.data.get('username', '').strip()
            password = request.data.get('password', '')
            
            if not username or not password:
                return JsonResponse({'error': 'Username and password are required'}, status=400)
            
            # Check if user exists
            if not User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Invalid username or password'}, status=401)
            
            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    # Debug: User logged in
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
                    return JsonResponse({'error': 'Account is disabled'}, status=401)
            else:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)
        except KeyError as e:
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
        except Exception as e:
            # Debug: Login error logged
            return JsonResponse({'error': 'Login failed. Please try again.'}, status=500)


@api_view(['POST'])
def logout_user(request):
    try:
        logout(request)
        return JsonResponse({'success': True, 'message': 'Logged out successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


# Password Reset API Endpoints
@api_view(['POST'])
def forgot_password(request):
    """Send password reset email"""
    try:
        email = request.data.get('email', '').strip().lower()
        
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
            
        # Check if user exists with this email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if email exists or not for security
            return JsonResponse({
                'success': True, 
                'message': f'If an account with {email} exists, you will receive password reset instructions.'
            })
        
        # Generate reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # In production, you'd send an actual email
        # For now, return the token for demo purposes
        reset_link = f"https://habify-app.onrender.com/reset-password?token={token}&uid={uid}"
        
        return JsonResponse({
            'success': True,
            'message': f'Password reset instructions sent to {email}',
            'demo_token': token,  # Remove in production
            'demo_uid': uid,      # Remove in production
            'reset_link': reset_link
        })
        
    except Exception as e:
        # Debug: Forgot password error logged
        return JsonResponse({'error': 'Failed to process request. Please try again.'}, status=500)

@api_view(['POST'])
def reset_password(request):
    """Reset password with token"""
    try:
        token = request.data.get('token', '')
        uid = request.data.get('uid', '')
        new_password = request.data.get('new_password', '')
        
        if not all([token, uid, new_password]):
            return JsonResponse({'error': 'Token, UID, and new password are required'}, status=400)
            
        if len(new_password) < 6:
            return JsonResponse({'error': 'Password must be at least 6 characters long'}, status=400)
        
        try:
            # Decode user ID
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return JsonResponse({'error': 'Invalid reset link'}, status=400)
        
        # Verify token
        if not default_token_generator.check_token(user, token):
            return JsonResponse({'error': 'Invalid or expired reset token'}, status=400)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Password reset successfully. You can now log in with your new password.'
        })
        
    except Exception as e:
        # Debug: Reset password error logged
        return JsonResponse({'error': 'Failed to reset password. Please try again.'}, status=500)

# Auth
def get_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


# Calendar
class DayLogView(generics.ListAPIView):
    serializer_class = DayLogSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Day.objects.filter(user=self.request.user).order_by('-day')
        return Day.objects.none()

@api_view(['GET'])
def get_user_submissions(request):
    """Get user's day submissions for calendar display"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        # Get user's day logs
        day_logs = Day.objects.filter(user=request.user).order_by('-day')
        submissions = []
        
        for log in day_logs:
            submissions.append({
                'day': str(log.day),
                'activity': log.activity,
                'notes': log.notes,
                'user': request.user.username,
                'timestamp': log.day.strftime('%Y-%m-%dT%H:%M:%S.%fZ') if hasattr(log.day, 'strftime') else str(log.day) + 'T00:00:00.000Z'
            })
            
        # Get user profile for additional stats
        try:
            profile = Profile.objects.get(user=request.user)
            badge = StreakBadge.objects.get(user=request.user)
        except (Profile.DoesNotExist, StreakBadge.DoesNotExist):
            profile = None
            badge = None
            
        return JsonResponse({
            'success': True,
            'submissions': submissions,
            'profile': {
                'coins': profile.coins if profile else 0,
                'streak': profile.streak if profile else 0,
                'multiplier': badge.multiplyer if badge else 1
            } if profile else None
        })
        
    except Exception as e:
        print(f"Error in get_user_submissions: {str(e)}")
        return JsonResponse({'error': 'Failed to fetch user submissions'}, status=500)



@api_view(['POST'])
def NewDayLog(request):
    if request.method == 'POST':
        try:
            # Check if user is authenticated
            if not request.user.is_authenticated:
                return JsonResponse({'error': 'Authentication required'}, status=401)
                
            activity = request.data.get('activity')
            notes = request.data.get('notes', '')
            today = str(datetime.now())[0:10]
            
            if activity is None:
                return JsonResponse({'error': 'Activity value is required'}, status=400)

            # Get or create user profile and badge
            user_profile, created = Profile.objects.get_or_create(
                user=request.user,
                defaults={'coins': 100, 'streak': 0}
            )
            user_badge, created = StreakBadge.objects.get_or_create(
                user=request.user,
                defaults={'weeks': 0, 'color': '#ffffff', 'multiplyer': 1}
            )
            
            # Check if user already submitted today
            existing_log = Day.objects.filter(user=request.user, day=today).first()
            if existing_log:
                # Update existing log
                existing_log.activity = activity
                existing_log.notes = notes
                existing_log.save()
                new_day = existing_log
            else:
                # Create new log
                new_day = Day.objects.create(
                    user=request.user,
                    day=today,
                    activity=activity,
                    notes=notes
                )

            user_days = Day.objects.filter(user=request.user)
            yesterdays_date = str(datetime.now() + timedelta(days=-1))[0:10]
            
            coins_earned = 0
            
            # Handle failure or missed day
            if activity == 1 or (yesterdays_date != str(user_profile.last_updated) and len(user_days) > 1):
                user_profile.streak = 0
                user_badge.weeks = 0
                user_badge.color = "#ffffff"
                user_badge.multiplyer = 1
                
                if activity == 1:  # Only deduct coins for actual failure
                    coins_lost = min(user_profile.coins, 10)
                    user_profile.coins -= coins_lost
                    
                user_profile.last_updated = datetime.now()
                user_profile.save()
                user_badge.save()
                
            # Handle success
            elif activity == 5:
                user_profile.streak += 1
                coins_earned = 50 * user_badge.multiplyer
                user_profile.coins += coins_earned
                user_profile.last_updated = datetime.now()
                user_profile.save()

                # Update streak badge
                if user_profile.streak % 7 == 0: 
                    user_badge.color = 'grey'
                    user_badge.multiplyer = 1.125
                    user_badge.weeks += 1
                    
                    # Badge progression
                    weeks = user_badge.weeks
                    if weeks >= 4:
                        user_badge.color = 'yellow'
                        user_badge.multiplyer = 1.25
                    if weeks >= 13:
                        user_badge.color = 'green'
                        user_badge.multiplyer = 1.5
                    if weeks >= 26:
                        user_badge.color = 'blue'
                        user_badge.multiplyer = 1.75
                    if weeks >= 39:
                        user_badge.color = 'purple'
                        user_badge.multiplyer = 2
                    if weeks >= 52:
                        user_badge.color = 'orange'
                        user_badge.multiplyer = 2.5
                        
                    user_badge.save()

            return JsonResponse({
                'success': True,
                'message': 'Day log saved successfully',
                'data': {
                    'day': today,
                    'activity': activity,
                    'notes': notes,
                    'coins_earned': coins_earned,
                    'current_coins': user_profile.coins,
                    'current_streak': user_profile.streak,
                    'multiplier': user_badge.multiplyer
                }
            })
            
        except Exception as e:
            # Debug: Log the error
            print(f"Error in NewDayLog: {str(e)}")
            return JsonResponse({'error': 'Failed to save day log. Please try again.'}, status=500)

class ProfileView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer