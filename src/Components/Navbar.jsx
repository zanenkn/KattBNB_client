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
          <p>yo</p>
        </Grid>
      </>
    )
  }
}

export default Navbar