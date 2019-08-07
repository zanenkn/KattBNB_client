import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Button } from 'semantic-ui-react'

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    password_confirmation: '',
    username: '',
    location: ''
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
                id="username"
                value={this.state.username}
                onChange={this.onChangeHandler}
                placeholder="Username"
              />
            </Form>

            <Button className='submit-button' id="sign-up-button" onClick={this.createUser}>Sign up</Button>

        </Segment>

      </Sidebar.Pushable>
    )
  }
}

export default SignUp
