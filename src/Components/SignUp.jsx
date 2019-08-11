import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Button, Dropdown, Message } from 'semantic-ui-react'
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
    error_display: false
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
    e.preventDefault();
    const { history, registerUser } = this.props
    const {
      email,
      password,
      password_confirmation,
      location,
      nickname
    } = this.state
    registerUser({ email, password, password_confirmation, location, nickname })
      .then(() => {
        history.push('/signup-success')
      }).catch(error => {
        console.log(error.response.data)
        this.setState({
          errors: error.response.data.errors.full_messages,
          error_display: true
        })
      })
  }

  render() {
    let errorDisplay

    if(this.state.error_display) {
      errorDisplay = (
        <Message negative className='message'>
        <Message.Header textAlign='center'>User could not be registered because of following error(s):</Message.Header>
        <ul id="message-error-list">
          {this.state.errors.map(error => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </Message>
      )
    }
    return (
      <Sidebar.Pushable className='content-wrapper' >
        
        <Header as='h1'>
          Sign up
        </Header>

        <Segment className='whitebox'>
          <Form id="signup-form">
            <Form.Input
              id="email"
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder="Email"
            />
            <Form.Input
              id="password"
              type="password"
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder="Password"
            />
            <Form.Input
              id="password_confirmation"
              type="password"
              value={this.state.password_confirmation}
              onChange={this.onChangeHandler}
              placeholder="Repeat password"
            />
            <Form.Input
              id="nickname"
              value={this.state.username}
              onChange={this.onChangeHandler}
              placeholder="Username"
            />
            <Dropdown
              clearable
              search
              selection
              style={{'width': '100%'}}
              placeholder="Select location"
              options={LOCATION_OPTIONS}
              id="location"
              onChange={this.handleLocationChange}
            />
          </Form>

          <Button id="sign-up-button" onClick={this.createUser}>Sign up</Button>
        </Segment>

        {errorDisplay}

      </Sidebar.Pushable>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.reduxTokenAuth.currentUser
  }
}
export default connect(
  mapStateToProps,
  { registerUser },
)(SignUp) 

