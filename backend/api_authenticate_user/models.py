from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('others', 'Others'),
    ]
    given_name = models.CharField(max_length=225)
    surname = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    birthday = models.DateField()
    role = models.CharField(max_length=6, choices=ROLE_CHOICES)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    profile_image_url = models.CharField(max_length=255)
    biography = models.TextField()

    
    username = None
    last_login = None
    is_staff = None
    is_superuser = None
    first_name = None
    last_name  = None
    date_joined = None
    groups = None
    user_permissions = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'user'        
