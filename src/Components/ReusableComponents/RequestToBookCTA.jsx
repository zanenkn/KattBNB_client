import React from 'react'
import { Button, Header } from 'semantic-ui-react'
import Spinner from './Spinner'
import moment from 'moment'
import { Trans, useTranslation } from 'react-i18next'

const RequestToBookCTA = (props) => {
  const { t, ready } = useTranslation()
  if (ready) {
    return (
      <>
        <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
          <Trans i18nKey='reusable:request-cta.txt' count={parseInt(props.numberOfCats)}>
            The stay for <strong style={{ 'color': '#c90c61' }}>{{ count: props.numberOfCats }} cat</strong> with <strong style={{ 'color': '#c90c61' }}>{{ host: props.nickname }}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{{ checkin: moment(props.checkInDate).format('YYYY-MM-DD') }}</strong> until <strong style={{ 'color': '#c90c61' }}>{{ checkout: moment(props.checkOutDate).format('YYYY-MM-DD') }}</strong> would in total cost
          </Trans>
        </p>
        <Header id='total' as='h3' style={{ 'marginTop': '0' }}>
          {props.orderTotal} kr
        </Header>
        <Button
          id='request-to-book'
          style={{ 'marginTop': '0', 'marginBottom': '2rem' }}
          onClick={props.requestToBookButtonClick}>
          {t('reusable:request-cta.btn')}
        </Button>
      </>
    )
  } else { return <Spinner /> }
}
export default RequestToBookCTA
