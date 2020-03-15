import React, { useState } from 'react'
import Spinner from './Spinner'
import { Button, Header } from 'semantic-ui-react'
import { Trans, useTranslation } from 'react-i18next'

const MessageHostCTA = (props) => {

  const { t, ready } = useTranslation('HostProfileView')

  const [loading, setLoading] = useState(false)

  const handleOnClick = (e) => {
    setLoading(true)
    e.preventDefault()
    props.messageHost(e)
  }

  if (ready) {
    return (
      <>
        <Header id='total' as='h3' style={{ 'marginBottom': '0' }}>
          {t('HostProfileView:questions')}
        </Header>
        <p className='small-centered-paragraph' style={{ 'marginBottom': '1rem' }}>
          <Trans i18nKey='HostProfileView:send-msg' values={{ host: props.nickname }} >
            You can send a message to <strong style={{ 'color': '#c90c61' }}>{props.nickname}</strong> and find out.
          </Trans>
        </p>
        <Button
          id='send-message'
          style={{ 'marginTop': '0', 'marginBottom': '2rem' }}
          loading={loading}
          disabled={loading}
          onClick={(e) => handleOnClick(e)}>
          {t('HostProfileView:send-cta')}
        </Button>
      </>
    )
  } else { return <Spinner /> }
}

export default MessageHostCTA
