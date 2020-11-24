/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import Spinner from '../ReusableComponents/Spinner'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { useTranslation } from 'react-i18next'
import { Header, Segment } from 'semantic-ui-react'

const Receipt = (props) => {

  const { t, ready } = useTranslation('Error503')

  // useEffect(() => {
  //   if (props.location.search !== '?atm') {
  //     wipeCredentials('/')
  //   }
  // }, [])

  if (ready) {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('Error503:title')}
        </Header>
        <Segment className='whitebox' style={{ 'textAlign': 'center' }}>
          <p>{t('Error503:desc')}</p>
        </Segment>
      </div>
    )
  } else { return <Spinner /> }
}

export default Receipt
