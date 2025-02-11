from django.utils.timezone import now
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from datetime import timedelta


class CustomTokenGenerator(PasswordResetTokenGenerator):
    """
    Custom token generator for creating and validating tokens used in
    authentication flows.

    Methods:
        make_hash_value(user, timestamp):
            Generates a hash value based on the user's primary key,
            timestamp, and active status.

        check_token_expiry(token_timestamp):
            Checks whether the token has expired based on a 10-minute
            expiry window.
    """

    def make_hash_value(self, user, timestamp):
        """
        Generates a unique hash value for a user based on their primary
        key, a timestamp, and their active status.

        Parameters:
            user (User): The user object for whom the token is being
                generated.
            timestamp (int): The timestamp used to create the hash.

        Returns:
            str: A unique hash value as a string.
        """
        return str(user.pk) + str(timestamp) + str(user.is_active)

    def check_token_expiry(self, token_timestamp):
        """
        Checks if the token is still valid based on its timestamp.

        Parameters:
            token_timestamp (datetime): The timestamp associated with
                the token.

        Returns:
            bool: True if the token has not expired, otherwise False.
        """
        return now() - timedelta(minutes=10) < token_timestamp


# Instance of the custom token generator
token_generator = CustomTokenGenerator()
