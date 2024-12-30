from rest_framework.response import Response
from rest_framework import status


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
