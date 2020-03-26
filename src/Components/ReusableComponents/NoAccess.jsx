import React from 'react'
import Spinner from './Spinner'
import { Trans, useTranslation } from 'react-i18next'
import { Header, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const NoAccess = () => {

  const { t, ready } = useTranslation('NoAccess')

  if (ready) {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('NoAccess:title')}
        </Header>
        <Segment className='whitebox' style={{ 'textAlign': 'center' }}>
          <p>
            <Trans i18nKey='NoAccess:description'>
              Don't be a stranger. You need to <Header as={Link} to='login' className='fake-link' >log in</Header> to view this section!
            </Trans>
          </p>
        </Segment>
      </div>
    )
  } else { return <Spinner /> }
}

export default NoAccess
