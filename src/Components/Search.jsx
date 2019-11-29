import React, { Component } from 'react'
import { Sidebar, Header, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Search extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          KattBNB is coming soon!
        </Header>
        <Segment className='whitebox'>
          <p style={{'textAlign': 'center'}}>
            Good things take time! But they are also worth the wait. We are working hard to get the best cat boarding site up and running. Stay tuned! 
          </p>
          <div style={{'textAlign': 'center'}}>
            <Header  as={Link} to='about-us' className='fake-link-underlined' >
              Who we are
            </Header>
          </div>

        </Segment>
      </Sidebar.Pushable>
    )
  }
}

export default Search