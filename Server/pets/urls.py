from django.urls import path
from .views import PetListView, PetBreedListView

urlpatterns = [
     path('type/', PetListView.as_view(), name='pet-list-create'),
     path('breeds/', PetBreedListView.as_view(),
          name='all_breeds'),
     path('breeds/<str:pet_type>/', PetBreedListView.as_view(),
          name='breeds_by_pet_type'),
]
