from django.db import models
from accounts.models import PetSphereUser
from django.utils.timezone import now


class Seller(models.Model):
    user = models.OneToOneField(PetSphereUser, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
    joined_date = models.DateTimeField(auto_now_add=True)
    review_count = models.PositiveBigIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    listing_count = models.PositiveBigIntegerField(default=0)
    total_sales = models.PositiveBigIntegerField(default=0)
    seller_level = models.PositiveBigIntegerField(default=0)
    all_in_one_badge = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class BadgeLevel(models.Model):
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE,
                              related_name="levels")
    level = models.PositiveIntegerField(default=1)
    name = models.CharField(max_length=50)
    criteria = models.JSONField()
    icon = models.ImageField(upload_to="badge_level_icons/", blank=True,
                             null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.badge.name} - Level {self.level} ({self.name})"


class SellerBadge(models.Model):
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE,
                               related_name='sellerbadges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE,
                              related_name='sellerbadges')
    current_level = models.PositiveIntegerField(default=0)
    progress_data = models.JSONField(default=dict)
    awarded_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('seller', 'badge')

    def __str__(self):
        return f"{self.seller.user.username} - {self.badge.name} " \
            f"{self.current_level}"

    def update_badge_level(self):
        levels = self.badge.levels.all().order_by('level')
        for level in levels:
            if self.meets_criteria(level.criteria):
                self.current_level = level.level
            else:
                break
        self.last_updated = now()
        self.save()

    def meets_criteria(self, criteria):
        for key, value in criteria.items():
            if self.progress_data.get(key, 0) < value:
                return False
        return True
