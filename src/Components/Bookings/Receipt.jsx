/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import withAuth from '../../HOC/withAuth'
import Spinner from '../ReusableComponents/Spinner'
import KattBNBLogo from '../Icons/KattBNBLogo'
import ReceiptPDF from './ReceiptPDF'
import { formatPrice, priceOfOneAmount } from '../../Modules/PriceCalculations'
import { useTranslation } from 'react-i18next'
import { Header, Segment } from 'semantic-ui-react'
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
    return (
      <>
        <div>
          <PDFDownloadLink
            document={<ReceiptPDF />}
            fileName={t('Receipt:filename-pdf')}
          >
            {({ loading }) => (loading ? t('Receipt:loading') : t('Receipt:download'))}
          </PDFDownloadLink>
        </div>
        <div className='content-wrapper' >
          <KattBNBLogo width={'100px'} />
          <p>KattBNB AB</p>
          <p>Reg. Number 559252-4481</p>
          <Header as='h1'>
            Receipt #{bookingId}
          </Header>
          <Header as='h3'>
            {createdAt}
          </Header>
          <Segment className='whitebox' style={{ 'textAlign': 'center' }}>
            <p>For the stay of your {numberOfCats} cats with {nickname} between {startDate} and {endDate} you paid the amounts listed below:</p>
          </Segment>
          <Segment className='whitebox' style={{ 'textAlign': 'right' }}>
            <p>For {nickname} you paid: {formatPrice(priceTotal)} kr</p>
          </Segment>
          <Segment className='whitebox' style={{ 'textAlign': 'right' }}>
            <p>For KattBNB (17%) you paid: {formatPrice(priceTotal * 0.17)} kr</p>
          </Segment>
          <Segment className='whitebox' style={{ 'textAlign': 'right' }}>
            <p>For VAT (25%) you paid: {formatPrice((priceTotal * 0.17) * 0.25)} kr</p>
          </Segment>
          <Segment className='whitebox' style={{ 'textAlign': 'right' }}>
            <p>TOTAL: {priceOfOneAmount(priceTotal)} kr</p>
          </Segment>
        </div>
      </>
    )
  } else { return <Spinner /> }
}

export default withAuth(Receipt)
