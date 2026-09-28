from django.urls import path
from . import views

urlpatterns = [
    # Frontend pages
    path('', views.home, name='home'),
    path('courses/', views.courses, name='courses'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('contact/submit/', views.contact_submit, name='contact_submit'),
    path('why-zaheer-it/', views.why_zaheer, name='why_zaheer'),

    # Auth
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # Profile
    path('profile/', views.profile_view, name='profile'),

    # Enrollment
    path('enroll/', views.enroll_index, name='enroll_index'),
    path('enroll/course/', views.enroll_course, name='enroll_course'),
]