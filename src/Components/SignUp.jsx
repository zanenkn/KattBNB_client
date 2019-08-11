import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Button, Dropdown } from 'semantic-ui-react'
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
    errors: ''
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
      .then(response => {
        console.log('yay')
        history.push('/signup-success')
      }).catch(error => {
        console.log('no')
        console.log(error.response.data)
        this.setState({
          errors: error.response.data.errors.full_messages,
        })
      })
  }

  render() {
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

