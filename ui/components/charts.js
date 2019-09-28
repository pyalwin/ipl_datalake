import React, {Component} from 'react';
import { ResponsivePie } from '@nivo/pie';
import _ from 'lodash';

export default class Plot extends Component {
    state = {
        chartData: [],
        chosenChoice: 'NA',
        selectedSeason: 'NA'
    }

    static getDerivedStateFromProps = (props,state) => {
        let data = props.chartData
        let choice = props.chosenChoice
        let selectedSeason = props.selectedSeason
        let chartData = []
        console.log(props.chosenChoice, state.chosenChoice)
        if (props.chosenChoice !== state.chosenChoice || 
            props.selectedSeason !== state.selectedSeason){
            console.log(data, choice)
            if (data[choice] !== undefined){
                let keyName='label'
                let valueName='value'
                switch(choice){
                    case 'Top Winning Teams':
                        keyName   = 'winner'
                        valueName = 'winning_count'
                        break;
                    case 'Maximum won locations for top winning team':
                        keyName   = 'city'
                        valueName = 'winCount'
                        break;
                    case 'Team with maximum match win in season':
                        keyName   = 'winner'
                        valueName = 'winning_count'
                        break;
                    case 'Players by Maximum Player of Match Awards':
                        keyName   = 'player_of_match'
                        valueName = 'awardsCount'
                        break;
                    case 'Team winning percentage based on toss decision':
                        keyName   = 'toss_decision'
                        valueName   = 'decisionCount'
                        break;
                    case 'Match count by host location':
                        keyName   = 'city'
                        valueName = 'hostCount'
                        break;
                    case 'Teams winning margins by runs':
                        keyName   = 'winner'
                        valueName = 'winMargin'
                        break;
                    case 'Teams winning margins by wickets':
                        keyName   = 'winner'
                        valueName = 'maxWickets'
                        break;
                    case 'Teams win count when they won toss':
                        keyName   = 'winner'
                        valueName = 'winCount'
                        break;
                    case 'Players who delivered maximum runs':
                        keyName   = 'bowler'
                        valueName = 'totalRuns'
                        break;
                    case 'Fielders with maximum catches':
                        keyName   = 'fielder'
                        valueName = 'totalCount'
                        break;
                    default:
                        break;
                }

                data[choice].forEach((item) => {
                    chartData.push(
                        {
                            id: item[keyName],
                            label: item[keyName],
                            value: item[valueName]
                        }
                    )
                })
                return ({chartData:chartData, chosenChoice: choice, selectedSeason: selectedSeason})    
            }else{
                return false
            }
        }else{
            return false
        }
    }

    render(){
        let values = _.map(this.state.chartData, 'value');
        let totalValue = _.sum(values)
        return (
            <ResponsivePie
                data={this.state.chartData}
                margin={{ top: 40, right: 150, bottom: 80, left: 0 }}
                colors={{ scheme: 'nivo' }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                padAngle={0.7}
                cornerRadius={3}   
                tooltipFormat={(d)=>Number.parseFloat((d/totalValue)*100).toFixed(1)+'%'}             
                legends={[
                    {
                        anchor: 'right',
                        direction: 'column',
                        translateX: 50,
                        itemWidth: 50,
                        itemHeight: 20,
                        itemTextColor: '#999',
                        symbolSize: 10,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ],
                        legendFormat: (d) => {console.log(d); return d.value + d.id}
                    }
                ]}
            />
        )
    }
}
