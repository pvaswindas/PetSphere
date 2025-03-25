from rest_framework import viewsets, filters
from .models import Reports
from .serializers import ReportsSerializer
from .permissions import IsAdminOrReadOnlyAllowPost
from .pagination import ReportsPagination
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from posts.models import Post, PetListing
from accounts.models import PetSphereUser
import json
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes


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


@api_view(['POST'])
@permission_classes([IsAdminUser])
def handle_report_action(request):
    data = json.loads(request.body)
    report_id = data.get('report_id')
    action = data.get('action')

    report = get_object_or_404(Reports, id=report_id)

    if report.type == 'user':
        reported_item = get_object_or_404(
            PetSphereUser, username=report.link_to_content
        )
    elif report.type == 'post':
        reported_item = get_object_or_404(Post, slug=report.link_to_content)
    elif report.type == 'listing':
        reported_item = get_object_or_404(
            PetListing, slug=report.link_to_content
        )
    else:
        return JsonResponse(
            {'status': 'error', 'message': 'Unknown report type'}, status=400
        )

    if report.type == 'user':
        if action == 'warn':
            report.status = 'resolved'
            report.save()
            return JsonResponse(
                {'status': 'success', 'message': 'User has been warned'}
            )

        elif action == 'temp-ban':
            # Set user as suspended temporarily
            reported_item.is_suspended = True
            reported_item.save()
            report.status = 'resolved'
            report.save()
            return JsonResponse(
                {
                    'status': 'success',
                    'message': 'User has been temporarily banned'
                }
            )

        elif action == 'perm-ban':
            # Permanently ban by deactivating the user
            reported_item.is_active = False
            reported_item.save()
            if hasattr(reported_item, 'account_settings'):
                reported_item.account_settings.delete()
            report.status = 'resolved'
            report.save()
            return JsonResponse(
                {
                    'status': 'success',
                    'message': 'User has been permanently banned'
                }
            )

    elif report.type == 'post':
        if action == 'delete':
            # Delete the post
            reported_item.delete()
            report.status = 'resolved'
            report.save()
            return JsonResponse(
                {'status': 'success', 'message': 'Post has been deleted'}
            )

        elif action == 'approve':
            # Mark the report as rejected (false positive)
            report.status = 'rejected'
            report.save()
            return JsonResponse(
                {'status': 'success', 'message': 'Post has been approved'}
            )

    elif report.type == 'listing':
        if action == 'flag':
            report.status = 'investigating'
            report.save()
            return JsonResponse(
                {
                    'status': 'success',
                    'message': 'Listing has been flagged as suspicious'
                }
            )

        elif action == 'remove':
            reported_item.is_available = False
            reported_item.save()
            report.status = 'resolved'
            report.save()
            return JsonResponse(
                {'status': 'success', 'message': 'Listing has been removed'}
            )

        elif action == 'safe':
            # Mark report as rejected (false positive)
            report.status = 'rejected'
            report.save()
            return JsonResponse(
                {
                    'status': 'success',
                    'message': 'Listing has been marked as safe'
                }
            )

    return JsonResponse(
        {'status': 'error', 'message': 'Invalid action'}, status=400
    )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def report_stats(request):
    """
    Get counts of reports by type
    """
    stats = (
        Reports.objects
        .filter(is_deleted=False)
        .values('type')
        .annotate(count=Count('id'))
    )

    result = {item['type']: item['count'] for item in stats}

    for report_type, _ in Reports.REPORT_TYPE_CHOICES:
        if report_type not in result:
            result[report_type] = 0

    return Response(result)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def report_types_stats(request):
    """
    Get counts of reports by status
    """
    status_stats = (
        Reports.objects
        .filter(is_deleted=False)
        .values('status')
        .annotate(count=Count('id'))
    )

    result = {item['status']: item['count'] for item in status_stats}

    for status, _ in Reports.REPORT_STATUS_CHOICES:
        if status not in result:
            result[status] = 0

    return Response(result)
