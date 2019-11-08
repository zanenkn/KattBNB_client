import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Form } from 'semantic-ui-react'
import moment from 'moment'

class RequestToBook extends Component {
  state = {
    message: ''
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }


  render() {
    let checkIn = moment(this.props.location.state.checkInDate).format('l')
    let checkOut = moment(this.props.location.state.checkOutDate).format('l')
    
    return(
      <>
        <Header>
          Request to book
        </Header>
        <p>
          You are requesting a booking for {this.props.location.state.numberOfCats} cat with {this.props.location.state.nickname} during the dates of {checkIn} - {checkOut}.
        </p>

        <Form>
          <Form.TextArea
            label='Message'
            placeholder='Message'
            required
            id='message'
            value={this.state.message}
            onChange={this.onChangeHandler}
          />
        </Form>
      </>
    )
  }
}

const mapStateToProps = state => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(RequestToBook)