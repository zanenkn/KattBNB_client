import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

class PasswordResetSuccess extends Component {

  render() {
    const { t } = this.props
    
    if (this.props.currentUserIn) {
      window.localStorage.clear()
      setTimeout(function () { window.location.reload(true) }, 500)
    }

    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('PasswordResetSuccess.title')}
        </Header>
        <Segment className='whitebox' textAlign='center'>
          <p>
          {t('PasswordResetSuccess.p')}
          </p>
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = state => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn })

export default withTranslation()(connect(mapStateToProps)(PasswordResetSuccess))
