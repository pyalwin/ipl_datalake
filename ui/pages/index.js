import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Nav from '../components/nav'
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
    jsonResult: {}
  }
  selectedSeason = (e, v) => {
    let selectedSeason = e.target.value
    axios.get('http://localhost:8000/api/season-stats',{
      params: {
        season: selectedSeason
      }
    }).then((res) => {
      console.log(res)
      this.setState({jsonResult: res.data})
    }).catch((err) => {
        console.log(err)
    })
  }

  render(){
    return(
      <div>
      <Head>
        <title>Home</title>
      </Head>
  
      <Nav />
      <Container>
        <Row>
        <Col xs="6">
            <DynamicReactJson src={this.state.jsonResult} />
          </Col>
          <Col xs="6">
            <InputForm selectedSeason={this.selectedSeason}></InputForm>
          </Col>
        </Row>
      </Container>
    </div>  
    )
  }
}
