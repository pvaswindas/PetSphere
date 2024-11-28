from django.utils.timezone import now
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from datetime import timedelta


class CustomTokenGenerator(PasswordResetTokenGenerator):
    def make_hash_value(self, user, timestamp):
        return str(user.pk) + str(timestamp) + str(user.is_active)

    def check_token_expiry(self, token_timestamp):
        return now() - timedelta(minutes=10) < token_timestamp

token_generator = CustomTokenGenerator()
