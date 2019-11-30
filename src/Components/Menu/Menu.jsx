import React, { Component } from 'react'
import { Sidebar, Segment, Grid, Header, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import i18n from '../../i18n'

class Menu extends Component {

  handleMenuVisibilty = (e) => {
    this.props.menuVisbilityHandler()
  }

  signOut = (e) => {
    e.preventDefault()
    const path = '/api/v1/auth/sign_out'
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token')
    }
    axios.delete(path, { headers: headers })
      .then(() => {
        window.localStorage.clear()
        window.location.replace('/')
      })
      .catch(() => {
        window.alert('There was a problem signing you out. Please try again in a minute')
      })
  }

  render() {
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng)
    }
    let userLinks

    if (this.props.currentUserIn) {
      userLinks = (
        <Header
          id='logout'
          className='menu-link'
          as={Link}
          onClick={this.signOut}
        >
          Log out
        </Header>
      )
    } else {
      userLinks = (
        <>
          <Header
            id='login'
            className='menu-link'
            as={Link}
            to='/login'
          >
            Log in
          </Header>
          <Header
            id='signup'
            className='menu-link'
            as={Link}
            to='/sign-up'
          >
            Sign up
          </Header>
        </>
      )
    }

    return (
      <Sidebar
        id='menu'
        as={Segment}
        animation='overlay'
        direction='left'
        visible={this.props.menuVisible}
      >
        <Grid
          verticalAlign='middle'
          id='menu-grid'
        >
          <Grid.Column id='menu-grid-column'>
            {userLinks}
            <Header
              id='about'
              className='menu-link'
              as={Link}
              to='/about-us'
            >
              About us
            </Header>
            <Header
              id='faq'
              className='menu-link'
              as={Link}
              to='faq'
            >
              FAQ
            </Header>
            <Header
              id='contact'
              className='menu-link'
              as={Link}
              to='/contact-us'
            >
              Contact us
            </Header>

            <Header
              id='legal'
              className='menu-link'
              as={Link}
              to='/legal'
            >
              Legal
            </Header>
            <div>
              <Button size='mini' style={{'display': 'inline', 'marginTop': '2rem', 'marginLeft': '0.5rem', 'marginRight': '0.5rem'}} onClick={() => changeLanguage('sv')}>Svenska</Button>
              <Button size='mini' style={{'display': 'inline', 'marginTop': '2rem', 'marginLeft': '0.5rem', 'marginRight': '0.5rem'}} onClick={() => changeLanguage('en')}>English</Button>
            </div>
          </Grid.Column>
        </Grid>
      </Sidebar>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    menuVisible: state.animation.menuVisible,
    currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
  }
}

const mapDispatchToProps = {
  menuVisbilityHandler: menuVisible => ({
    type: 'CHANGE_VISIBILITY',
    menuVisbible: menuVisible
  })
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu))
