import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'

class Navbar extends Component {
  render() {
    return (
      <>
        <Grid
          id='navbar'
          verticalAlign='middle'
          columns={2}
        >
          <Grid.Column style={{ 'padding': 0 }} id='hamburger' width={4}>
            <svg className='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={() => this.props.dispatch({ type: 'CHANGE_VISIBILITY' })}><path fill='#FFFFFF' d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
          </Grid.Column>

          <Grid.Column style={{ 'padding': 0 }} width={12}>
            <Grid id='navlinks'>
              <Grid.Column className='navlink' width={4}>
                <svg className='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill='#FFFFFF' d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" /></svg>
              </Grid.Column>
              <Grid.Column className='navlink' width={4}>
                <svg className='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill='#FFFFFF' d="M17 11v3l-3-3H8a2 2 0 0 1-2-2V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1zm-3 2v2a2 2 0 0 1-2 2H6l-3 3v-3H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h2v3a4 4 0 0 0 4 4h6z" /></svg>
              </Grid.Column>
              <Grid.Column className='navlink' width={4}>
                <svg className='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill='#FFFFFF' d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" /></svg>
              </Grid.Column>
              <Grid.Column className='navlink' width={4}>
                <svg className='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill='#FFFFFF' d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
              </Grid.Column>
            </Grid>
          </Grid.Column>

        </Grid>
      </>
    )
  }
}

const mapStateToProps = state => ({
  menuVisible: state.animation.menuVisible
})

export default connect(mapStateToProps)(Navbar)
