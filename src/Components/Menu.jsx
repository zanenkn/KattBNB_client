import React, { Component } from 'react'
import { Sidebar, Segment, Grid, Header } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

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

            <Header>
              Login
            </Header>

            <Header>
              Sign up
            </Header>

            <Header>
              About us
            </Header>

            <Header>
              Legal
            </Header>

            <Header>
              FAQ
            </Header>

            <Header>
              Contact us
            </Header>

            <Header>
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
