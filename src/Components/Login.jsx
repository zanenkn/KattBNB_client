import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Message, Button } from 'semantic-ui-react'

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: '',
    error_display: false
  }

  render() {
    let errorDisplay

    if(this.state.error_display) {
      errorDisplay = (
        <Message negative >
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
          Log in
        </Header>

        <Segment className='whitebox'>

          {errorDisplay}

          <Form id="login-form">
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
            <Button className="submit-button" id="log-in-button">Log in</Button>
          </Form>

        </Segment>
        
      </Sidebar.Pushable>
    )
  }
}

export default Login
