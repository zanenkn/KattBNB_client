import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'

class Navbar extends Component {
  render() {
    return(
      <>
        <Grid 
          id='navbar'
          verticalAlign='middle'
          centered columns={2}
        >
          <Grid.Column
            id='hamburger'
            textAlign='center'
            
            width={4}>
            <svg className='navlink' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill='#FFFFFF' d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
          </Grid.Column>

          <Grid.Column
            id='navlinks'
            textAlign='center'
       
            width={12}>
            <svg className='navlink' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill='#FFFFFF' d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" /></svg>
          </Grid.Column>
        </Grid>
      </>
    )
  }
}

export default Navbar