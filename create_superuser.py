import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@zaheerit.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'ZaheerAdmin@2026')

try:
    user, created = User.objects.get_or_create(username=username, defaults={'email': email})
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    if created:
        print(f"Superuser '{username}' created successfully!")
    else:
        print(f"Superuser '{username}' password refreshed successfully!")
except Exception as e:
    print(f"Superuser creation error: {e}")
