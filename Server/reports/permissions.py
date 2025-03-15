from rest_framework import permissions


class IsAdminOrReadOnlyAllowPost(permissions.BasePermission):
    """
    Custom permission to allow:
    - Everyone to read (GET, HEAD, OPTIONS)
    - Normal users to create (POST)
    - Only admins to update and delete (PUT, PATCH, DELETE)
    """
    
    def has_permission(self, request, view):
        # Read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # POST permission for any authenticated user
        if request.method == 'POST':
            return request.user and request.user.is_authenticated
            
        # Other write permissions (PUT, PATCH, DELETE) only for admins
        return request.user and request.user.is_staff