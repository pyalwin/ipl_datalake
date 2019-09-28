from django.shortcuts import render
from rest_framework import viewsets
from scores.models import Deliveries, Matches
from scores.serializers import DeliveriesSerializer, MatchesSerializer
from django.http import JsonResponse
from django.db.models import Count, F, Sum

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
    team_win_obj = season_obj.values('winner').annotate(winning_count=Count('winner')).order_by('-winning_count')
    winner_statistics = list(team_win_obj)
    return_obj['Top Winning Teams'] = winner_statistics[:number_of_winners]

    ## Top team with maximum number of toss wins
    toss_winner_obj = season_obj.values('toss_winner').annotate(tossWon=Count('toss_winner')).order_by('-tossWon')
    # maximum_won_toss = toss_winner_obj.first()['tossWon']
    # teams_won_maximum_toss_obj = toss_winner_obj.filter(tossWon=maximum_won_toss)
    teams_won_maximum_toss = list(toss_winner_obj.annotate(label=F('toss_winner'),value=F('tossWon')).values('label','value'))
    return_obj['Team won highest number of tosses'] = teams_won_maximum_toss

    ## Top player with maximum player of match awards
    player_of_match = season_obj.values('player_of_match').annotate(awardsCount=Count('player_of_match')).order_by('-awardsCount')
    # maximum_won_award_count = player_of_match.first()['awardsCount']
    # max_player_of_match = list(player_of_match.filter(awardsCount=maximum_won_award_count))
    # return_obj['top_player_of_match_award_winner'] = max_player_of_match
    return_obj['Players by Maximum Player of Match Awards'] = list(player_of_match)

    ## Team won maximum matches 
    return_obj['Team with maximum match win in season'] = [winner_statistics[0]]

    ## Location with max win for top team
    top_team = winner_statistics[0]['winner']
    max_won_location_obj = season_obj.filter(winner=top_team).values('city').annotate(winCount=Count('city')).order_by('-winCount')
    # max_won_count = max_won_location_obj.first()['winCount']
    # max_won_locations = list(max_won_location_obj.filter(winCount=max_won_count))
    # return_obj['max_won_locations'] = max_won_locations
    return_obj['Maximum won locations for top winning team'] = list(max_won_location_obj)

    ### Percentage of team  who won toss decided to bat ###
    number_of_toss_choices = list(season_obj.values('toss_decision').annotate(decisionCount=Count('toss_decision')))
    return_obj['Team winning percentage based on toss decision'] = number_of_toss_choices

    ### Top location statistics ###
    hosted_location = list(season_obj.values('city').annotate(hostCount=Count('city')).order_by('-hostCount'))
    return_obj['Match count by host location'] = hosted_location

    ## Team winning highest margins ###
    team_winning_margins = list(season_obj.values('winner').annotate(winMargin=Sum('win_by_runs')).order_by('-winMargin'))
    return_obj['Teams winning margins by runs'] = team_winning_margins

    ## Teams won by highest wickets ###
    team_winning_margins = list(season_obj.values('winner').annotate(maxWickets=Sum('win_by_wickets')).order_by('-maxWickets'))
    return_obj['Teams winning margins by wickets'] = team_winning_margins

    ## Team winning statistics when won toss ###
    team_win_stats = []
    for item in team_win_obj:
        team = item['winner']
        team_data = list(season_obj.filter(toss_winner=team, winner=team).values('winner').annotate(winCount=Count('winner')))
        if team_data:
            team_win_stats.append(team_data[0])
        else:
            team_win_stats.append({'winner': team, 'winCount': 0})
    return_obj['Teams win count when they won toss'] = team_win_stats

    ## Players bowling economny in season ##
    match_ids = list(season_obj.values_list('id',flat=True))
    delivery_obj = Deliveries.objects.filter(match_id__in=match_ids)
    season_deliveries_obj = list(delivery_obj.values('bowler').annotate(totalRuns=Sum('total_runs')).order_by('-totalRuns'))
    return_obj['Players who delivered maximum runs'] = season_deliveries_obj[:10]

    ## Most catches by fielder in season ##
    season_field_obj = list(delivery_obj.filter(dismissal_kind='caught').values('fielder').annotate(totalCount=Count('fielder')).order_by('-totalCount'))
    return_obj['Fielders with maximum catches'] = season_field_obj[:10]       

    return JsonResponse(return_obj)