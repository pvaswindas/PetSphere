from django.db import models


class Reports(models.Model):
    type = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    reported_content = models.TextField()
    link_to_content = models.TextField(blank=True, null=True)
    reason = models.TextField()
    status = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.reported_content
