from rest_framework.response import Response
from rest_framework import status
import random


def validate_authenticated_user(request):
    """
    Validates if the request has an authenticated user.
    Returns a Response object if the user is not authenticated.
    Otherwise, returns the authenticated user.
    """
    user = getattr(request, 'user', None)
    if not user or not user.is_authenticated:
        return Response(
            {"error": "User not found or not authenticated"},
            status=status.HTTP_400_BAD_REQUEST
        )
    return user


def validate_request_data(request, required_fields):
    """
    Validates if the required fields are present in the request data.
    Parameters:
        - request: The HTTP request object.
        - required_fields (list): A list of required field names.
    Returns:
        - dict: The cleaned data if all fields are present.
        - Response: A Response object with an error if validation fails.
    """
    data = request.data
    missing_fields = [
        field for field in required_fields
        if field not in data
    ]
    if missing_fields:
        print(f"MISSING FIELDS : {missing_fields}")
        return Response(
            {"error": f"Missing required fields: {', '.join(missing_fields)}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    return data


def validate_post_user_permission(user, comment, post):
    """
    Validates if the user has permission to modify a comment.
    Permissions:
        - User is the author of the comment
        - User is the owner of the post
        - User is an admin

    Args:
        user (User): The authenticated user making the request.
        comment (Comment): The comment to be modified.
        post (Post): The post that the comment belongs to.

    Returns:
        Response object with an error if the user lacks permission.
        None if the user has permission.
    """
    if comment.user == user:
        return None

    if post.user == user:
        return None

    if user.is_superuser:
        return None

    return Response(
        {"error": "Permission denied"},
        status=status.HTTP_403_FORBIDDEN
    )


def generate_random_otp():
    otp = random.randint(100000, 999999)
    return otp
