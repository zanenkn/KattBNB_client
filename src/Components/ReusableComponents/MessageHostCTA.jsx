import React from 'react'
import { Button, Header } from 'semantic-ui-react'
import { Trans, useTranslation } from 'react-i18next'

const MessageHostCTA = (nickname, messageHost) => {
  const { t } = useTranslation()
  return (
    <>
      <Header id='total' as='h3' style={{ 'marginBottom': '0' }}>
        {t('HostProfileView:questions')}
      </Header>
      <p className='small-centered-paragraph' style={{ 'marginBottom': '1rem' }}>
        <Trans i18nKey='HostProfileView:send-msg' values={{ host: nickname }} >
          You can send a message to <strong style={{ 'color': '#c90c61' }}>{nickname}</strong> and find out.
        </Trans>
      </p>
      {/* {errorDisplay} */}
      <Button
        id='send-message'
        style={{ 'marginTop': '0', 'marginBottom': '2rem' }}
        onClick={messageHost}>
        {t('HostProfileView:send-cta')}
      </Button>
    </>
  )
}
export default MessageHostCTA
