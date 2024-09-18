from django.urls import path
from .views import UserRegisterView, UserLoginView
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path('api/register', UserRegisterView.as_view(), name='register'),
    path('api/login', UserLoginView.as_view(), name='login'),
]