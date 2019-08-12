import React, { Component } from 'react'
import { Sidebar, Segment, Grid, Header } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'

class Menu extends Component {

  handleMenuVisibilty = (e) => {
    this.props.menuVisbilityHandler()
  }

  render() {
    let userLinks
    if (this.props.currentUserIn) {
      userLinks = (
        <Header
          id='signout'
          className='menu-link'
          as={Link}
          to='/login'
        >
          Sign Out
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
            Login
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
              id='blog'
              className='menu-link'
              as={Link}
              to='/blog'
            >
              Blog
            </Header>

            <Header
              id='legal'
              className='menu-link'
              as={Link}
              to='/legal'
            >
              Legal
            </Header>

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
