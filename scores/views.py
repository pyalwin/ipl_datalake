from django.shortcuts import render
from rest_framework import viewsets
from scores.models import Deliveries, Matches
from scores.serializers import DeliveriesSerializer, MatchesSerializer
from django.http import JsonResponse
from django.db.models import Count

# Create your views here.
class DeliveriesViewSet(viewsets.ModelViewSet):
    queryset = Deliveries.objects.all()
    serializer_class = DeliveriesSerializer


class MatchesViewSet(viewsets.ModelViewSet):
    queryset = Matches.objects.all()
    serializer_class = MatchesSerializer


def get_unique_seasons(request):
    seasons = list(Matches.objects.values_list('season',flat=True).distinct())
    return JsonResponse({'seasons': seasons},safe=False)

def get_season_statistics(request):
    season = request.GET.get('season', None)
    number_of_winners = request.GET.get('numberOfWinners', 4)
    if not season:
        return JsonResponse({'message': 'Please provide proper season'},status=400)

    return_obj = {}

    season_obj = Matches.objects.filter(season=season)

    ## Top {number of winners} teams in terms of match wins
    winner_statistics = list(season_obj.values('winner').annotate(winning_count=Count('winner')).order_by('-winning_count'))
    return_obj['match_winning_stats'] = winner_statistics[:number_of_winners]

    ## Top team with maximum number of toss wins
    toss_winner_obj = season_obj.values('toss_winner').annotate(tossWon=Count('toss_winner')).order_by('-tossWon')
    maximum_won_toss = toss_winner_obj.first()['tossWon']
    teams_won_maximum_toss = list(toss_winner_obj.filter(tossWon=maximum_won_toss))
    return_obj['highest_number_of_toss_won'] = teams_won_maximum_toss

    ## Top player with maximum player of match awards
    player_of_match = season_obj.values('player_of_match').annotate(awardsCount=Count('player_of_match')).order_by('-awardsCount')
    maximum_won_award_count = player_of_match.first()['awardsCount']
    max_player_of_match = list(player_of_match.filter(awardsCount=maximum_won_award_count))
    return_obj['top_player_of_match_award_winner'] = max_player_of_match

    ## Team won maximum matches 
    return_obj['team_won_maximum_matches'] = winner_statistics[0]

    ## Location with max win for top team
    top_team = winner_statistics[0]['winner']
    max_won_location_obj = season_obj.filter(winner=top_team).values('city').annotate(winCount=Count('city')).order_by('-winCount')
    max_won_count = max_won_location_obj.first()['winCount']
    max_won_locations = list(max_won_location_obj.filter(winCount=max_won_count))
    return_obj['max_won_locations'] = max_won_locations


    return JsonResponse(return_obj)