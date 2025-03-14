from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only admins to create, update,
    and delete reports.
    """

    def has_permission(self, request, view):
        # Read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions only for admins
        return request.user and request.user.is_staff
