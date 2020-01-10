import React from 'react'
import { Button, Header } from 'semantic-ui-react'
import moment from 'moment'
import { Trans, useTranslation } from 'react-i18next'

const RequestToBookCTA = (numberOfCats, nickname, checkInDate, checkOutDate, orderTotal, requestToBookButtonClick) => {
  const { t } = useTranslation()
  return (
    <>
      <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
        <Trans i18nKey='reusable:request-cta.txt' count={parseInt(numberOfCats)}>
          The stay for <strong style={{ 'color': '#c90c61' }}>{{count: numberOfCats}} cat</strong> with <strong style={{ 'color': '#c90c61' }}>{{host: nickname}}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{{checkin: moment(checkInDate).format('YYYY-MM-DD')}}</strong> until <strong style={{ 'color': '#c90c61' }}>{{checkout: moment(checkOutDate).format('YYYY-MM-DD')}}</strong> would in total cost
        </Trans>
      </p>
      <Header id='total' as='h3' style={{ 'marginTop': '0' }}>
        {orderTotal} kr
      </Header>
      <Button
        id='request-to-book'
        style={{ 'marginTop': '0', 'marginBottom': '2rem' }}
        onClick={requestToBookButtonClick}>
        {t('reusable:request-cta.btn')}
      </Button>
    </>
  )
}
export default RequestToBookCTA
