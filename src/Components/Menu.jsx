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
    return (
      <Sidebar
        id='menu'
        as={Segment}
        animation='overlay'
        direction='left'
        visible={this.props.menuVisible}

      >
        <Grid
          textAlign='center'
          verticalAlign='middle'
          id='menu-wrapper'
        >
          <Grid.Column>

            <Header
              id='login'
              as={Link}
              to='/login'
            >
              Login
            </Header>
            <br />

            <Header
              id='signup'
              as={Link}
              to='/sign-up'
            >
              Sign up
            </Header>
            <br />

            <Header
              id='about'
              as={Link}
              to='/about-us'
            >
              About us
            </Header>
            <br />

            <Header
              id='legal'
              as={Link}
              to='/legal'
            >
              Legal
            </Header>
            <br />

            <Header
              id='faq'
              as={Link}
              to='faq'
            >
              FAQ
            </Header>
            <br />

            <Header
              id='contact'
              as={Link}
              to='/contact-us'
            >
              Contact us
            </Header>
            <br />

            <Header
              id='blog'
              as={Link}
              to='/blog'
            >
              Blog
            </Header>

          </Grid.Column>
        </Grid>

      </Sidebar>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    menuVisible: state.animation.menuVisible
  }
}
const mapDispatchToProps = {
  menuVisbilityHandler: menuVisible => ({
    type: 'CHANGE_VISIBILITY',
    menuVisbible: menuVisible
  })
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu))
