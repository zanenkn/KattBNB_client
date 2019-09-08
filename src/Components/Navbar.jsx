import React, { Component } from 'react'
import { Grid, Image } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Navbar extends Component {
  render() {

    let userIcon
    let hamburgerIcon
    let noAvatar

    if (this.props.currentUserIn) {
      noAvatar = `https://ui-avatars.com/api/?name=${this.props.username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
      userIcon = (
        <Grid.Column className='navlink' width={4} as={Link} to='/user-page'>
          <Image id='user-icon' src={this.props.avatar === null ? noAvatar : this.props.avatar} style={{'height': '5vh', 'width': '5vh', 'padding': '1px', 'border': 'white solid 2px', 'border-radius': '50%'}}></Image>
        </Grid.Column>
      )
    } else {
      userIcon = (
        <Grid.Column className='navlink' width={4} as={Link} to='/login'>
          <svg id='user-icon' className='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='#FFFFFF' d='M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Zm0,19a9,9,0,1,1,9-9A9,9,0,0,1,10,19Z' /><path fill='#FFFFFF' d='M10,11a3,3,0,0,0,3-3V6a3,3,0,0,0-3-3A3,3,0,0,0,7,6V8A3,3,0,0,0,10,11Z' /><path fill='#FFFFFF' d='M3.3,14.4a7.94,7.94,0,0,0,11.1,2.2,7.68,7.68,0,0,0,2.2-2.2A16.23,16.23,0,0,0,3.3,14.4Z' /></svg>
        </Grid.Column>
      )
    }

    if (this.props.menuVisible) {
      hamburgerIcon = (
        <Grid.Column style={{ 'padding': 0 }} id='hamburger' width={4}>
          <svg className='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' onClick={() => this.props.dispatch({ type: 'CHANGE_VISIBILITY' })}><path fill='#FFFFFF' d='M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z' /></svg>
        </Grid.Column>
      )
    } else {
      hamburgerIcon = (
        <Grid.Column style={{ 'padding': 0 }} id='hamburger' width={4}>
          <svg className='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' onClick={() => this.props.dispatch({ type: 'CHANGE_VISIBILITY' })}><path fill='#FFFFFF' d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' /></svg>
        </Grid.Column>
      )
    }

    return (
      <>
        <Grid
          id='navbar'
          verticalAlign='middle'
          columns={2}
        >
          {hamburgerIcon}
          <Grid.Column style={{ 'padding': 0 }} width={12}>
            <Grid id='navlinks'>
              <Grid.Column className='navlink' width={4} as={Link} to='/' onClick={this.props.menuVisible ? () => { this.props.dispatch({ type: 'CHANGE_VISIBILITY' }) } : () => { }}>
                <svg className='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='#FFFFFF' d='M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z' /></svg>
              </Grid.Column>
              <Grid.Column className='navlink' width={4}>
                <svg className='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='#FFFFFF' d='M17 11v3l-3-3H8a2 2 0 0 1-2-2V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1zm-3 2v2a2 2 0 0 1-2 2H6l-3 3v-3H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h2v3a4 4 0 0 0 4 4h6z' /></svg>
              </Grid.Column>
              <Grid.Column className='navlink' width={4}>
                <svg className='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='#FFFFFF' d='M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z' /></svg>
              </Grid.Column>
              {userIcon}
            </Grid>
          </Grid.Column>
        </Grid>
      </>
    )
  }
}

const mapStateToProps = state => ({
  menuVisible: state.animation.menuVisible,
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar,
  username: state.reduxTokenAuth.currentUser.attributes.username
})

export default connect(mapStateToProps)(Navbar)
