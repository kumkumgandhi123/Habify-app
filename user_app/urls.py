from django.urls import path
from . import views
app_name = 'user_app'

urlpatterns = [
    # API endpoints (api/ prefix handled in main urls.py)
    path('new/', views.CreateUser),
    path('login/', views.login_user, name="login"),
    path('logout/', views.logout_user, name="logout"),
    path('forgot-password/', views.forgot_password, name="forgot_password"),
    path('reset-password/', views.reset_password, name="reset_password"),
    path('csrf/', views.get_csrf),
    path('log/', views.DayLogView.as_view(), name="daylog"),
    path('daylog/', views.NewDayLog),
    path('submissions/', views.get_user_submissions, name="user_submissions"),
    path('profile/', views.ProfileView.as_view())
]