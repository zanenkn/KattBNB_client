import React, { Component } from 'react'
import { Sidebar, Segment, Grid, Header } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class Menu extends Component {

  handleMenuVisibilty = (e) => {
    this.props.menuVisbilityHandler()
  }

  render() {
    return(
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
          <br></br>
          <br></br>

          <Header>
            Sign up
          </Header>
          <br></br>
          <br></br>

          <Header>
            About us
          </Header>
          <br></br>
          <br></br>

          <Header>
            Legal
          </Header>
          <br></br>
          <br></br>

          <Header>
            FAQ
          </Header>
          <br></br>
          <br></br>

          <Header>
            Contact us
          </Header>
          <br></br>
          <br></br>

          <Header>
            Blog
          </Header>
          <br></br>
          <br></br>

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
