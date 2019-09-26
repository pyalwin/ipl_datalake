import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
const axios = require('axios');

export default class InputForm extends React.Component{
    state = {
        options: [2017,2018]
    }

    componentDidMount(){
        axios.get('http://localhost:8000/api/get-seasons').then((res) => {
            console.log(res)
            this.setState({options: res.data.seasons})
        }).catch((err) => {
            console.log(err)
        })
    }

    render(){
        return(
            <Form>
                <FormGroup>
                    <Label for="season"></Label>
                    <Input type="select" name="selectedSeason" id="season" onChange={this.props.selectedSeason}>
                        {this.state.options.map((item) => (
                            <option>{item}</option>
                        ))}
                   </Input>
                </FormGroup>
            </Form>
        )
    }
}