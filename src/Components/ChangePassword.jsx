import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import axios from 'axios'
import queryString from 'query-string'


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

  changePassword = (e) => {
    this.setState({ loading: true })
    e.preventDefault()
    const path = '/api/v1/auth/password'
    const payload = {
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
      uid: queryString.parse(this.props.location.search).uid,
      'access-token': queryString.parse(this.props.location.search).token,
      client: queryString.parse(this.props.location.search).client
    }
    axios.put(path, payload)
      .then(() => {
        this.setState({
          success_display: true,
          error_display: false
        })
        setTimeout(function () { window.location.replace('/login') }, 2000)
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
        <Button className='submit-button' id='change-pass-button' onClick={this.changePassword}>Change Password</Button>
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
              required
              id='password'
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder='Password'
              type='password'
              onKeyPress={event => {
                if (event.key === "Enter") {
                  this.changePassword(event)
                }
              }}
            />

            <Form.Input
              required
              id='password_confirmation'
              value={this.state.password_confirmation}
              onChange={this.onChangeHandler}
              placeholder='Repeat password'
              type='password'
              onKeyPress={event => {
                if (event.key === "Enter") {
                  this.changePassword(event)
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
