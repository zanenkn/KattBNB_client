import React from 'react'
import { formatPrice, priceOfOneAmount } from '../../Modules/PriceCalculations'
import { useTranslation, Trans } from 'react-i18next'
import { Page, Text, View, Document, Image } from '@react-pdf/renderer'

const ReceiptPDF = (props) => {

  const { t, ready } = useTranslation('Receipt')

  if (ready) {
    const { createdAt, bookingId, numberOfCats, nickname, startDate, endDate, priceTotal } = props
    return (
      <Document>
        <Page size='A4'>
          <View style={{ padding: '60px' }}>
            <Image src='/KattBNB_logo.png' style={{ 'width': '200px', marginBottom: '20px' }}></Image>
            <Text>KattBNB AB</Text>
            <Text>Reg. nr. 559252-4481</Text>
            <Text>{t('Receipt:issued', { date: createdAt })}</Text>
            <Text style={{ paddingTop: '60px', paddingBottom: '30px', textAlign: 'center', fontSize: '25pt' }}>
              {t('Receipt:header', { nr: bookingId })}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'justify-between', width: '475px' }}>
              <View style={{ width: '400px' }}>
                <Text>
                  <Trans
                    i18nKey='Receipt:info'
                    count={parseInt(numberOfCats)}
                  >
                    A stay for {{ count: numberOfCats }} cat with
                    {{ host: nickname }} between
                    {{ checkin: startDate }} until
                    {{ checkout: endDate }}:
                  </Trans>
                </Text>
              </View>
              <View style={{ width: '75px', textAlign: 'right' }}>
                <Text>{formatPrice(priceTotal)} kr</Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'justify-between', width: '475px', marginTop: '20px' }}>
              <View style={{ width: '400px' }}>
                <Text>
                  {t('Receipt:service-fee')}
                </Text>
              </View>
              <View style={{ width: '75px', textAlign: 'right' }}>
                <Text>{formatPrice(priceTotal * 0.17)} kr</Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'justify-between', width: '475px', marginTop: '20px' }}>
              <View style={{ width: '400px' }}>
                <Text>
                  {t('Receipt:vat')}
                </Text>
              </View>
              <View style={{ width: '75px', textAlign: 'right' }}>
                <Text>{formatPrice((priceTotal * 0.17) * 0.25)} kr</Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'justify-between', width: '475px', paddingTop: '20px', marginTop: '20px', borderTopColor: '#000', borderTopWidth: 1 }}>
              <View style={{ width: '325px' }}>
                <Text style={{ fontSize: '25pt' }}>
                  {t('Receipt:total')}
                </Text>
              </View>
              <View style={{ width: '150px', textAlign: 'right' }}>
                <Text style={{ fontSize: '25pt' }}>{priceOfOneAmount(priceTotal)} kr</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    )
  } else {
    return (
      <Document>
        <Page size='A4'>
          <View>
            <Text>Error: Please try again!</Text>
          </View>
        </Page>
      </Document>
    )
  }
}

export default ReceiptPDF
