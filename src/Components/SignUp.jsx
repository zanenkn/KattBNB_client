import React, { Component } from 'react'
import { Header, Segment, Form, Button, Dropdown, Message } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../Modules/locationData'
import { registerUser } from '../reduxTokenAuthConfig'
import { connect } from 'react-redux'

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    password_confirmation: '',
    nickname: '',
    location: '',
    errors: '',
    url: 'https://kattbnb.netlify.com/login',
    error_display: false,
    loading: false
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleLocationChange = (e, { value }) => {
    this.setState({ location: value })
  }

  createUser = (e) => {
    this.setState({ loading: true })
    e.preventDefault()
    const { history, registerUser } = this.props
    const {
      email,
      password,
      password_confirmation,
      location,
      nickname,
      url
    } = this.state
    registerUser({ email, password, password_confirmation, location, nickname, url })
      .then(() => {
        history.push('/signup-success')
      }).catch(error => {
        this.setState({
          errors: error.response.data.errors.full_messages,
          error_display: true,
          loading: false
        })
      })
  }

  listenEnterKey = (event) => {
    if (event.key === "Enter") {
      this.createUser(event)
    }
  }

  render() {
    let errorDisplay
    let submitButton

    if (this.state.error_display) {
      errorDisplay = (
        <Message negative >
          <Message.Header textAlign='center'>User could not be registered because of following error(s):</Message.Header>
          <ul id="message-error-list">
            {this.state.errors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Message>
      )
    }

    if (this.state.loading) {
      submitButton = (
        <Button id="sign-up-button" loading>Loading</Button>
      )
    } else {
      submitButton = (
        <Button id="sign-up-button" onClick={this.createUser}>Sign up</Button>
      )
    }

    return (
      <div className='content-wrapper' >

        <Header as='h1'>
          Sign up
        </Header>

        <Segment className='whitebox'>

          <p style={{ 'textAlign': 'center' }}>
            Password must be at least 6 characters in length. Email and Username must be unique.
          </p>

          {errorDisplay}

          <Form id="signup-form">
            <Form.Input
              required
              id="email"
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder="Email"
              onKeyPress={this.listenEnterKey}
            />
            <Form.Input
              required
              id="password"
              type="password"
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder="Password"
              onKeyPress={this.listenEnterKey}
            />
            <Form.Input
              required
              id="password_confirmation"
              type="password"
              value={this.state.password_confirmation}
              onChange={this.onChangeHandler}
              placeholder="Repeat password"
              onKeyPress={this.listenEnterKey}
            />
            <Form.Input
              required
              id="nickname"
              value={this.state.username}
              onChange={this.onChangeHandler}
              placeholder="Username / Nickname"
              onKeyPress={this.listenEnterKey}
            />
            <Dropdown
              clearable
              search
              selection
              style={{ 'width': '100%' }}
              placeholder="Select location"
              options={LOCATION_OPTIONS}
              id="location"
              onChange={this.handleLocationChange}
              onKeyPress={this.listenEnterKey}
            />
          </Form>

          {submitButton}

        </Segment>

      </div>
    )
  }
}

export default connect(
  null,
  { registerUser },
)(SignUp)
