import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import WIP from '../ReusableComponents/WorkInProgress'
import { withTranslation } from 'react-i18next'

class SignUp extends Component {

  render() {
    const { t } = this.props
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('menu.signup')}
        </Header>
        <WIP />
      </div>
    )
  }
}

export default withTranslation()(SignUp)