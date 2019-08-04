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
            >
              Login
            </Header>

            <Header
              id='signup'
            >
              Sign up
            </Header>

            <Header
              id='about'
              as={Link}
              to='/about-us'
            >
              About us
            </Header>

            <Header
              id='legal'
            >
              Legal
            </Header>

            <Header
              id='faq'
            >
              FAQ
            </Header>

            <Header
              id='contact'
            >
              Contact us
            </Header>

            <Header
              id='blog'
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
