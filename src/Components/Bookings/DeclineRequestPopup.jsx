import React, { Component } from 'react'
import { Header, Form } from 'semantic-ui-react'

class DeclineRequestPopup extends Component {
  render() {
    return (
      <>
        <Header as='h2'>
          Decline a request
        </Header>
        <p className='small-centered-paragraph'>
          You are about to decline a booking request from <strong>{this.props.nickname}</strong> for the dates of <strong>{this.props.startDate}</strong> until <strong>{this.props.endDate}</strong>
        </p>
        <Form>
          <Form.TextArea
            label='Message'
            placeholder='Let them know why..'
            required
            id='message'
            //value={this.state.message}
            //onChange={this.onChangeHandler}
          />
        </Form>
      </>
    )
  }
}

export default DeclineRequestPopup