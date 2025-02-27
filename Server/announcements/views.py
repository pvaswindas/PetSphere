from rest_framework import viewsets, filters
from .models import Announcements
from .serializers import AnnouncementSerializer
from .permissions import IsAdminOrReadOnly
from .pagination import AnnoucementPagination


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows announcements to be viewed or edited.
    """
    queryset = Announcements.objects.filter(
        is_deleted=False
    ).order_by('-created_at')
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = AnnoucementPagination

    filter_backends = [filters.SearchFilter]
    search_fields = ['title']
