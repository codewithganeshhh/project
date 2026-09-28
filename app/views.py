from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from .forms import SignupForm, LoginForm, EnrollmentForm, ContactForm
from .models import Enrollment, ContactMessage


# ---------- Static / frontend-only pages ----------

def home(request):
    return render(request, 'index.html')


def courses(request):
    return render(request, 'course.html')


def about(request):
    return render(request, 'about.html')


def contact(request):
    return render(request, 'contact.html')


def why_zaheer(request):
    return render(request, 'why_zaheer.html')


# ---------- Auth ----------

def signup_view(request):
    if request.user.is_authenticated:
        return redirect('profile')

    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Sign up successful! Please login.')
            next_url = request.GET.get('next') or request.POST.get('next')
            if next_url:
                return redirect(f"{reverse('login')}?next={next_url}")
            return redirect('login')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{error}")
    else:
        form = SignupForm()

    return render(request, 'signup.html', {'form': form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('profile')

    next_url = request.GET.get('next') or request.POST.get('next') or ''

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email'].strip().lower()
            password = form.cleaned_data['password']

            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, 'Login successful!')

                if next_url:
                    return redirect(next_url)
                return redirect('profile')
            else:
                messages.error(request, 'Invalid email or password. Please try again.')
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form, 'next': next_url})


def logout_view(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('home')


# ---------- Profile ----------

@login_required(login_url='login')
def profile_view(request):
    enrollments = Enrollment.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'profile.html', {
        'current_user': request.user,
        'enrollments': enrollments,
        'enrollment_count': enrollments.count(),
    })


# ---------- Enrollment ----------

@login_required(login_url='login')
def enroll_index(request):
    if request.method != 'POST':
        return redirect('home')

    form = EnrollmentForm(request.POST, is_index=True)

    if not form.is_valid():
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'ok': False, 'errors': form.errors}, status=400)
        for field, errors in form.errors.items():
            for error in errors:
                messages.error(request, f"{error}")
        return redirect('home')

    course = form.cleaned_data['course']

    if Enrollment.objects.filter(user=request.user, course=course).exists():
        msg = f'You are already enrolled in "{course}". Check your profile for details.'
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'ok': False, 'errors': {'course': [msg]}}, status=400)
        messages.warning(request, msg)
        return redirect('home')

    enrollment = form.save(commit=False)
    enrollment.user = request.user
    enrollment.source = 'index'
    enrollment.batch = ''
    enrollment.save()

    msg = f"Thank you, {enrollment.name}! Your enrollment for {course} has been submitted. We'll contact you soon."
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'ok': True, 'message': msg})
    messages.success(request, msg)
    return redirect('home')


@login_required(login_url='login')
def enroll_course(request):
    if request.method != 'POST':
        return redirect('courses')

    form = EnrollmentForm(request.POST)

    if not form.is_valid():
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'ok': False, 'errors': form.errors}, status=400)
        for field, errors in form.errors.items():
            for error in errors:
                messages.error(request, f"{error}")
        return redirect('courses')

    course = form.cleaned_data['course']

    if Enrollment.objects.filter(user=request.user, course=course).exists():
        msg = f'You are already enrolled in "{course}". Check your profile for details.'
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'ok': False, 'errors': {'course': [msg]}}, status=400)
        messages.warning(request, msg)
        return redirect('courses')

    enrollment = form.save(commit=False)
    enrollment.user = request.user
    enrollment.source = 'course'
    enrollment.save()

    msg = (
        f"Thank you, {enrollment.name}!\n\n"
        f"You've successfully enrolled in:\n{course}\n\n"
        f"Batch: {enrollment.batch}\n\n"
        f"We'll contact you soon at {enrollment.email}."
    )
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'ok': True, 'message': msg})
    messages.success(request, msg)
    return redirect('courses')


# ---------- Contact ----------

@require_POST
def contact_submit(request):
    form = ContactForm(request.POST)

    if not form.is_valid():
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'ok': False, 'errors': form.errors}, status=400)
        messages.error(request, 'Please fill all required fields.')
        return redirect('contact')

    contact_msg = form.save()

    msg = f"Thank you, {contact_msg.name}! Your message has been sent. We'll get back to you soon."

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'ok': True, 'message': msg})

    messages.success(request, msg)
    return redirect('contact')