import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
const axios = require('axios');

export default class InputForm extends React.Component{
    state = {
        options: ['Choose any one to continue']
    }

    componentDidMount(){
        axios.get('http://localhost:8000/api/get-seasons').then((res) => {
            let options = res.data.seasons
            this.setState({options: [...this.state.options, ...options]})
        }).catch((err) => {
            console.log(err)
        })
    }

    render(){
        return(
            <Form>
                <FormGroup>
                    <Label for="season">Select the season</Label>
                    <Input type="select" name="selectedSeason" id="season" onChange={this.props.selectedSeason}>
                        {this.state.options.map((item) => (
                            <option>{item}</option>
                        ))}
                   </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="analysis">Select the analysis</Label>
                    <Input type="select" name="selectedChoice" id="analysis" onChange={this.props.selectedChoice}>
                        {this.props.optChoices.map((item) => (
                            <option>{item}</option>
                        ))}
                   </Input>
                </FormGroup>
            </Form>
        )
    }
}