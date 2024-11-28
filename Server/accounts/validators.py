import re
from rest_framework.exceptions import ValidationError


# Validates that the password meets length, case, and numeric requirements.
def validate_password(password):
    if len(password) < 8:
        raise ValidationError(
            "Password must be atleast at least 8characters long."
            )
    if not re.search(r'[A-Z]', password):
        raise ValidationError(
            "Password must contain at least one uppercase letter."
        )
    if not re.search(r'[a-z]', password):
        raise ValidationError(
            "Password must contain at least one lowercase letter."
        )
    if not re.search(r'[0-9]', password):
        raise ValidationError(
            "Password must contain at least one number."
        )
    return password
