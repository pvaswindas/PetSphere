from django.urls import path
from .views import PetListView, PetBreedListView

urlpatterns = [
     path('type/', PetListView.as_view(), name='pet-list-create'),
     path('breed/', PetBreedListView.as_view(),
          name='pet-breed-create'),
]
