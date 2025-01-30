from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Profile
from django.db.models import Q
from .serializers import ProfileSerializer
from socials.utils.mutual_friends import get_mutual_friends_count
from socials.models import Follower
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        username = request.query_params.get('username')
        try:
            if username:
                profile = Profile.objects.get(user__username=username)
                is_other_account = True
            else:
                profile = Profile.objects.get(user=user)
                is_other_account = False
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            serializer = ProfileSerializer(
                profile, context={'request': request}
            )
            data = serializer.data.copy()

            if is_other_account:
                mutual_friends_count = get_mutual_friends_count(
                    user, profile.user
                )
                data['mutual_friends_count'] = mutual_friends_count
                data.pop('push_notification')

            return Response(
                data,
                status=status.HTTP_200_OK
            )
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = ProfileSerializer(
            profile, data=request.data, partial=True,
            context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PeopleListView(APIView):
    def get(self, request):
        search_query = request.query_params.get('search', None)
        current_user = request.user

        if search_query:
            users = Profile.objects.filter(
                Q(user__username__icontains=search_query) | Q(
                    user__name__icontains=search_query)
            )
        else:
            users = Profile.objects.all()

        users_with_mutual_friends = []
        for profile in users:
            mutual_friends_count = get_mutual_friends_count(current_user,
                                                            profile.user)
            is_following = Follower.objects.filter(
                follower=current_user, following=profile.user).exists()
            user_data = ProfileSerializer(profile).data
            user_data['mutualFriends'] = mutual_friends_count
            user_data['isFollowing'] = is_following
            users_with_mutual_friends.append(user_data)

        return Response(users_with_mutual_friends, status=status.HTTP_200_OK)


class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'count': self.page.paginator.count,
            'page': self.page.number,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })


class AccountListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ProfileSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        role = self.request.query_params.get('role', None)
        search_query = self.request.query_params.get('search', None)
        queryset = Profile.objects.all().order_by('-user__date_joined')

        if role == 'admin':
            queryset = queryset.filter(user__is_staff=True)
        else:
            queryset = queryset.filter(user__is_staff=False)

        if search_query:
            queryset = queryset.filter(
                Q(user__username__icontains=search_query) |
                Q(user__name__icontains=search_query)
            )
        return queryset


class AccountDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    lookup_field = "user_id"

    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get(self.lookup_field)
        try:
            profile = Profile.objects.get(user__id=user_id)
            serializer = self.serializer_class(profile)
            return Response(
                {
                    "success": "User data found",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile with the given user ID does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

    def update(self, request, *args, **kwargs):
        user_id = self.kwargs.get(self.lookup_field)
        try:
            print(request.data)
            profile = Profile.objects.get(user__id=user_id)
            pet_sphere_user = profile.user

            if 'email' in request.data:
                pet_sphere_user.email = request.data['email']
            if 'mobile_no' in request.data:
                pet_sphere_user.mobile_no = request.data['mobile_no']

            if 'is_active' in request.data:
                pet_sphere_user.is_active = request.data['is_active']

            pet_sphere_user.save()

            return super().update(request, *args, **kwargs)
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile with the given user ID does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
