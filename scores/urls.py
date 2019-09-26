from rest_framework import routers
from scores.views import DeliveriesViewSet, MatchesViewSet,get_season_statistics, get_unique_seasons
from django.urls import path, include


router = routers.DefaultRouter()
router.register(r'deliveries', DeliveriesViewSet)
router.register(r'matches', MatchesViewSet)

urlpatterns = [
    path('get-seasons', get_unique_seasons),
    path('season-stats', get_season_statistics),
    path('', include(router.urls))    
]