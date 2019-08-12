import React, { Component } from 'react'
import { Sidebar, Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { signInUser } from '../reduxTokenAuthConfig'
import { Link } from 'react-router-dom'

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: '',
    error_display: false
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { history, signInUser } = this.props
    const {
      email,
      password
    } = this.state
    signInUser({ email, password })
      .then(() => {
        setTimeout(function () { history.push('/') }, 1000)
      }).catch(error => {
        this.setState({
          error_display: true,
          errors: error.response.data.errors[0]
        })
      })
  }

  render() {
    let errorDisplay

    if(this.state.error_display) {
      errorDisplay = (
        <Message negative >
          {this.state.errors}
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

          <Form id='login-form' onSubmit={this.onSubmit}>
            <Form.Input
              id='email'
              value={this.state.email}
              onChange={this.onChangeHandler}
              placeholder='Email'
            />
            <Form.Input
              id='password'
              type='password'
              value={this.state.password}
              onChange={this.onChangeHandler}
              placeholder='Password'
            />
            <Button className='submit-button' id='log-in-button'>Log in</Button>
          </Form>

          <p style={{'textAlign': 'center', 'marginTop': '2rem'}}>
            Not registered? 
          <br></br>
          <Header as={Link} to='sign-up' className='fake-link'>
            Create an account!
          </Header>  
          </p>

        </Segment>
        
      </Sidebar.Pushable>
    )
  }
}

export default connect(
  null,
  {signInUser},
  )(Login)
