from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Enrollment, ContactMessage


class SignupForm(UserCreationForm):
    name = forms.CharField(
        max_length=120,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Full Name',
            'id': 'signupName',
            'autocomplete': 'name',
        })
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Email Address',
            'id': 'signupEmail',
            'autocomplete': 'email',
        })
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Password (min 6 characters)',
            'id': 'signupPassword',
            'autocomplete': 'new-password',
        })
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Confirm Password',
            'id': 'signupConfirmPassword',
            'autocomplete': 'new-password',
        })
    )

    class Meta:
        model = User
        fields = ('name', 'email', 'password1', 'password2')

    def clean_email(self):
        email = self.cleaned_data.get('email', '').strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError('User with this email already exists. Please login.')
        return email

    def clean_password1(self):
        password = self.cleaned_data.get('password1', '')
        if len(password) < 6:
            raise forms.ValidationError('Password must be at least 6 characters.')
        return password

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['name']
        user.username = self.cleaned_data['email']
        if commit:
            user.save()
        return user


class LoginForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Email Address',
            'id': 'loginEmail',
            'autocomplete': 'email',
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Password',
            'id': 'loginPassword',
            'autocomplete': 'current-password',
        })
    )


class EnrollmentForm(forms.ModelForm):
    class Meta:
        model = Enrollment
        fields = ['name', 'email', 'phone', 'course', 'batch', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Full Name',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Email Address',
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Phone Number',
            }),
            'course': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Course',
            }),
            'batch': forms.TextInput(attrs={
                'class': 'form-select form-select-lg',
                'placeholder': 'Preferred Batch',
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Any specific requirements...',
            }),
        }

    def __init__(self, *args, **kwargs):
        self.is_index = kwargs.pop('is_index', False)
        super().__init__(*args, **kwargs)

        if self.is_index:
            self.fields['course'] = forms.ChoiceField(
                choices=[
                    ('Full Stack Web Development', 'Full Stack Web Development'),
                    ('Data Science & AI', 'Data Science & AI'),
                    ('Cloud & DevOps', 'Cloud & DevOps'),
                    ('Cybersecurity', 'Cybersecurity'),
                    ('Digital Marketing', 'Digital Marketing'),
                    ('Mobile App Development', 'Mobile App Development'),
                    ('Artificial Intelligence', 'Artificial Intelligence'),
                    ('Game Development', 'Game Development'),
                ],
                widget=forms.Select(attrs={
                    'class': 'form-select form-select-lg',
                    'id': 'enrollCourse',
                })
            )
            self.fields.pop('batch', None)


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Full Name',
                'id': 'contactName',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Email Address',
                'id': 'contactEmail',
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Phone Number',
                'id': 'contactPhone',
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Subject',
                'id': 'contactSubject',
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 5,
                'placeholder': 'Your Message...',
                'id': 'contactMessage',
            }),
        }