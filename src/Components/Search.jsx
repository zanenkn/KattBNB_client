import React, { Component } from 'react'
import { Sidebar, Header, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class Search extends Component {
  render() {
    const { t } = this.props
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          {t('landing.title')}
        </Header>
        <Segment className='whitebox'>
          <p style={{'textAlign': 'center'}}>
            {t('landing.paragraph')} 
          </p>
          <div style={{'textAlign': 'center'}}>
            <Header  as={Link} to='about-us' className='fake-link-underlined' >
              {t('landing.link-to-about')}
            </Header>
          </div>

        </Segment>
      </Sidebar.Pushable>
    )
  }
}

export default withTranslation()(Search)