from django.contrib import admin
from .models import Enrollment, ContactMessage


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'course', 'batch', 'source', 'user', 'created_at')
    list_filter = ('course', 'source', 'created_at')
    search_fields = ('name', 'email', 'phone', 'course', 'user__username')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'subject', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'phone', 'subject', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)