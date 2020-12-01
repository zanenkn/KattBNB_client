/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import withAuth from '../../HOC/withAuth'
import Spinner from '../ReusableComponents/Spinner'
import KattBNBLogo from '../Icons/KattBNBLogo'
import ReceiptPDF from './ReceiptPDF'
import { formatPrice, priceOfOneAmount } from '../../Modules/PriceCalculations'
import { useTranslation, Trans } from 'react-i18next'
import { Button, Header, Segment, Divider } from 'semantic-ui-react'
import { PDFDownloadLink } from '@react-pdf/renderer'

const Receipt = (props) => {

  const { t, ready } = useTranslation('Receipt')

  useEffect(() => {
    if (props.history.location.state === undefined || props.history.action === 'POP') {
      props.history.push({ pathname: '/all-bookings' })
    }
  }, [])

  if (ready) {

    const { createdAt, numberOfCats, bookingId, nickname, startDate, endDate, priceTotal } = props.history.location.state
    const swedishVAT = priceOfOneAmount(priceTotal) - formatPrice(priceTotal) - formatPrice(priceTotal * 0.17)
    return (

      <div className='content-wrapper' style={{ display: 'flex', flexDirection: 'column' }}>
        <Segment className='whitebox' style={{ marginTop: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <KattBNBLogo width={'75px'} />
          </div>
          <p>KattBNB AB
          <br />Reg. nr. 559252-4481
          <br />{t('Receipt:issued', { date: createdAt })}</p>
          <Header as='h2' style={{ margin: '3rem auto 2rem' }}>
            {t('Receipt:header', { nr: bookingId })}
          </Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <p style={{ width: '75%' }}>
              <Trans i18nKey='Receipt:info' count={parseInt(numberOfCats)}>
                A stay for <strong>{{ count: numberOfCats }} cat</strong> with <strong>{{ host: nickname }}</strong> between <strong style={{ whiteSpace: 'nowrap' }}>{{ checkin: startDate }}</strong> until <strong style={{ whiteSpace: 'nowrap' }}>{{ checkout: endDate }}</strong>:
              </Trans>
            </p>
            <p style={{ marginBottom: '1em' }}>{formatPrice(priceTotal)} kr</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ width: '75%' }}>
              {t('Receipt:service-fee')}
            </p>
            <p>{formatPrice(priceTotal * 0.17)} kr</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ width: '75%' }}>
              {t('Receipt:vat')}
            </p>
            <p>{formatPrice(swedishVAT)} kr</p>
          </div>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ width: '75%' }}><strong style={{ color: '#c90c61' }}>
              {t('Receipt:total')}
            </strong></p>
            <p><strong style={{ color: '#c90c61' }}>{priceOfOneAmount(priceTotal)} kr</strong></p>
          </div>
        </Segment>
        <div style={{ display: 'inline-block', margin: 'auto' }}>
          <PDFDownloadLink
            document={
              <ReceiptPDF
                createdAt={createdAt}
                numberOfCats={numberOfCats}
                bookingId={bookingId}
                nickname={nickname}
                startDate={startDate}
                endDate={endDate}
                priceTotal={priceTotal}
              />}
            fileName={t('Receipt:filename-pdf')}
          >
            {({ loading }) => (loading ? <Button loading disabled /> : <Button>{t('Receipt:download')}</Button>)}
          </PDFDownloadLink>
        </div>
      </div>
    )
  } else { return <Spinner /> }
}

export default withAuth(Receipt)
