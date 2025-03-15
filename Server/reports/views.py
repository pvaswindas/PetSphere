from rest_framework import viewsets, filters
from .models import Reports
from .serializers import ReportsSerializer
from .permissions import IsAdminOrReadOnlyAllowPost
from .pagination import ReportsPagination


class ReportsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows reports to be viewed or edited.
    """
    queryset = Reports.objects.filter(
        is_deleted=False
    ).order_by('-created_at')
    serializer_class = ReportsSerializer
    permission_classes = [IsAdminOrReadOnlyAllowPost]
    pagination_class = ReportsPagination

    filter_backends = [filters.SearchFilter]
    search_fields = ['type', 'description']
