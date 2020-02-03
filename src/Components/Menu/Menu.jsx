import React, { Component } from 'react'
import { Sidebar, Segment, Grid, Header, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import i18n from '../../i18n'
import { withTranslation } from 'react-i18next'

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

  changeLng(lng) {
    i18n.changeLanguage(lng)
    window.localStorage.setItem('I18N_LANGUAGE', lng)
  }

  render() {
    const { t } = this.props

    if (this.props.tReady) {
      let userLinks

      if (this.props.currentUserIn) {
        userLinks = (
          <Header
            id='logout'
            className='menu-link'
            as={Link}
            onClick={this.signOut}
          >
            {t('reusable:title.logout')}
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
              {t('reusable:title.login')}
            </Header>
            <Header
              id='signup'
              className='menu-link'
              as={Link}
              to='/sign-up'
            >
              {t('reusable:title.signup')}
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
                {t('reusable:title.about')}
              </Header>
              <Header
                id='faq'
                className='menu-link'
                as={Link}
                to='faq'
              >
                {t('reusable:title.faq')}
              </Header>
              <Header
                id='contact'
                className='menu-link'
                as={Link}
                to='/contact-us'
              >
                {t('reusable:title.contact')}
              </Header>
              <Header
                id='legal'
                className='menu-link'
                as={Link}
                to='/legal'
              >
                {t('reusable:title.legal')}
              </Header>
              <div>
                <Button id='se' size='mini' style={{ 'display': 'inline', 'marginTop': '2rem', 'marginLeft': '0.5rem', 'marginRight': '0.5rem' }} onClick={() => this.changeLng('sv')}>Svenska</Button>
                <Button id='en' size='mini' style={{ 'display': 'inline', 'marginTop': '2rem', 'marginLeft': '0.5rem', 'marginRight': '0.5rem' }} onClick={() => this.changeLng('en')}>English</Button>
              </div>
            </Grid.Column>
          </Grid>
        </Sidebar>
      )
    } else { return null }
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
export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu)))
