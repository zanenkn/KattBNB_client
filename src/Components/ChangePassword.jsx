import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import axios from 'axios'


class PasswordReset extends Component {
  state = {
    errors: '',
    error_display: false,
    success_display: false,
    loading: false,
    password: '',
    password_confirmation: ''
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  change = (e) => {
    this.setState({ loading: true })
    e.preventDefault();
    const path = '/api/v1/auth/password'
    const payload = {
      password: this.state.password,
      password_confirmation: this.state.password_confirmation
    }
    axios.put(path, payload)
      .then(() => {
        this.setState({
          success_display: true,
          error_display: false
        })
      })
      .catch(error => {
        this.setState({
          loading: false,
          error_display: true,
          errors: error.response.data.errors
        })
      })
  }

  render() {
    let errorDisplay
    let successDisplay
    let submitButton

    if (this.state.error_display) {
      errorDisplay = (
        <Message negative textAlign='center'>
          {this.state.errors}
        </Message>
      )
    }

    if (this.state.success_display) {
      successDisplay = (
        <Message success textAlign='center'>
          YAY!!!
        </Message>
      )
    }

    if (this.state.loading) {
      submitButton = (
        <Button className='submit-button' id='change-pass-button' loading>Change Password</Button>
      )
    } else {
      submitButton = (
        <Button className='submit-button' id='change-pass-button' onClick={this.change}>Change Password</Button>
      )
    }

    return (
      <Sidebar.Pushable className='content-wrapper' >

        <Header as='h1'>
          Change password
        </Header>

        <Segment className='whitebox'>

          <p style={{ 'textAlign': 'center' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          {errorDisplay}
          {successDisplay}

          <Form>
            <Form.Input
              id='password'
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder='Password'
              type='password'
            />

            <Form.Input
              id='password_confirmation'
              value={this.state.password_confirmation}
              onChange={this.onChangeHandler}
              placeholder='Repeat password'
              type='password'
              onKeyPress={event => {
                if (event.key === "Enter") {
                  this.change(event)
                }
              }}
            />
          </Form>

          {submitButton}

        </Segment>

      </Sidebar.Pushable>

    )
  }
}

export default PasswordReset
