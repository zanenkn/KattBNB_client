import React, { Component } from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

class IncomingUpcoming extends Component {

  messageUser = (e, userId, userAvatar, userLocation, userNickname) => {
    e.preventDefault()
    const path = '/api/v1/conversations'
    const payload = {
      user1_id: this.props.id,
      user2_id: userId
    }
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    axios.post(path, payload, { headers: headers })
      .then(response => {
        this.props.history.push({
          pathname: '/conversation',
          state: {
            id: response.data.id,
            user: {
              avatar: userAvatar,
              id: userId,
              location: userLocation,
              nickname: userNickname
            }
          }
        })
      })
  }

  render() {

    let sortedUpcoming = this.props.upcoming
    sortedUpcoming.sort((a, b) => (a.dates[0] - b.dates[0]))
    let page

    if (this.props.upcoming.length > 0) {
      page = (
        <>
          <p className='small-centered-paragraph'>
            <strong>
              You have {this.props.upcoming.length} upcoming {this.props.upcoming.length > 1 ? 'bookings' : 'booking'}.
            </strong>
          </p>
          <p style={{ 'textAlign': 'center' }}>
            These are finalized bookings coming up soon. Get in touch with these cat owners to organize the drop-off and pick-up.
          </p>
          {sortedUpcoming.map(upcoming => {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={upcoming.id} data-cy='incoming-upcoming' key={upcoming.id}>
                <p className='small-centered-paragraph'>
                  You have approved a stay for <strong>{upcoming.user.nickname}'s</strong> <strong>{upcoming.number_of_cats} {upcoming.number_of_cats > 1 ? 'cats' : 'cat'}</strong> for the dates of <strong>{moment(upcoming.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD')}</strong>.
                </p>
                <p className='fake-link-underlined' onClick={(e) => this.messageUser(e, upcoming.user_id, upcoming.user.avatar, upcoming.user.location, upcoming.user.nickname)}>
                  Message {upcoming.user.nickname}
                </p>
              </Container>
            )
          })}
        </>
      )
    } else {
      page = (
        <>
          <p className='small-centered-paragraph'>
            <strong>
              You don't have any upcoming bookings.
          </strong>
          </p>
        </>
      )
    }

    return (
      <>
        {page}
      </>
    )
  }
}


const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default withRouter(connect(mapStateToProps)(IncomingUpcoming))
