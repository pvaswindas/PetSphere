from django.db import models


class Reports(models.Model):
    REPORT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
    ]

    REPORT_TYPE_CHOICES = [
        ('user', 'User'),
        ('listing', "Listing"),
        ('post', 'Post'),
    ]

    type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    description = models.TextField(blank=True, null=True)
    reported_content = models.TextField(blank=True, null=True)
    link_to_content = models.TextField(blank=True, null=True)
    reason = models.TextField()
    status = models.CharField(
        max_length=20, choices=REPORT_STATUS_CHOICES, default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.type} Report: {self.reported_content[:30]}"

    class Meta:
        verbose_name = "Report"
        verbose_name_plural = "Reports"
