import React, { Component } from 'react'
import { Header, Form, Button } from 'semantic-ui-react'

class DeclineRequestPopup extends Component {
  state = {
    message: ''
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  render() {
    return (
      <>
        <Header as='h2'>
          Decline a request
        </Header>
        <p className='small-centered-paragraph'>
          You are about to decline a booking request from <strong style={{ 'color': '#c90c61' }}>{this.props.nickname}</strong> for the dates of <strong style={{ 'color': '#c90c61' }}>{this.props.startDate}</strong> until <strong style={{ 'color': '#c90c61' }}>{this.props.endDate}</strong>
        </p>
        <Form>
          <Form.TextArea
            style={{ 'minHeight': '150px' }}
            label='Message'
            placeholder='Let them know why..'
            required
            id='message'
            value={this.state.message}
            onChange={this.onChangeHandler}
          />
        </Form>
        <div className='button-wrapper'>
          <Button secondary>Back</Button>
          <Button>Decline</Button>
        </div>
      </>
    )
  }
}

export default DeclineRequestPopup