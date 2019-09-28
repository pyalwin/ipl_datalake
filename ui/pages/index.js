import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Nav from '../components/nav'
import Charts from '../components/charts';
import InputForm from '../components/inputForm';
import { Container, Row, Col } from 'reactstrap';
const axios = require('axios');
import 'bootstrap/dist/css/bootstrap.min.css';

const DynamicReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false }
)

export default class Home extends React.Component{
  state = {
    jsonResult: {},
    choices: ['Select a season'],
    selectedSeason: null
  }

  selectedSeason = (e, v) => {
    let selectedSeason = e.target.value
    axios.get('http://localhost:8000/api/season-stats',{
      params: {
        season: selectedSeason
      }
    }).then((res) => {
      let choices = ['Choose an option', ...Object.keys(res.data)]
      this.setState({jsonResult: res.data, choices: choices, selectedSeason: selectedSeason})
    }).catch((err) => {
        console.log(err)
    })
  }

  selectedChoice = (e, v) => {
    this.setState({chosenChoice: e.target.value})
  }

  render(){
    return(
      <div>
      <Head>
        <title>Home</title>
      </Head>
  
      <Nav />
      <div>
        <Row className="chartContainer">
        <Col xs="8">
            {/*<DynamicReactJson src={this.state.jsonResult} />*/}
            <Charts chartData={this.state.jsonResult} chosenChoice={this.state.chosenChoice} selectedSeason={this.state.selectedSeason}/>
          </Col>
          <Col xs="4">
            <InputForm selectedSeason={this.selectedSeason} selectedChoice={this.selectedChoice} optChoices={this.state.choices}></InputForm>
          </Col>
        </Row>
      </div>
      <style jsx global>{`
         .chartContainer {
           height: 80vh;
           padding: 2%;
         }
      `}</style>
    </div>  
    )
  }
}
