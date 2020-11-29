import React from 'react'
import { formatPrice, priceOfOneAmount } from '../../Modules/PriceCalculations'
import { useTranslation, Trans } from 'react-i18next'
import { Page, Text, View, Document, Image } from '@react-pdf/renderer'

const ReceiptPDF = (props) => {

  const { t, ready } = useTranslation('Receipt')

  if (ready) {
    return (
      <Document>
        <Page size='A4'>
          <View style={{ padding: '60px' }}>
            <Image src='/KattBNB_logo.png' style={{ 'width': '200px', marginBottom: '20px' }}></Image>
            <Text>KattBNB AB</Text>
            <Text>Reg. nr. 559252-4481</Text>
            <Text>{t('Receipt:issued', { date: props.createdAt })}</Text>
            <Text style={{ paddingTop: '60px', paddingBottom: '30px', textAlign: 'center', fontSize: '25pt' }}>
              {t('Receipt:header', { nr: props.bookingId })}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'justify-between', width: '475px' }}>
              <View style={{ width: '400px' }}>
                <Text>
                  <Trans
                    i18nKey='Receipt:info'
                    count={parseInt(props.numberOfCats)}
                  >
                    A stay for {{ count: props.numberOfCats }} cat with
                    {{ host: props.nickname }} between
                    {{ checkin: props.startDate }} until
                    {{ checkout: props.endDate }}:
                  </Trans>
                </Text>
              </View>
              <View style={{ width: '75px', textAlign: 'right' }}>
                <Text>{formatPrice(props.priceTotal)} kr</Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'justify-between', width: '475px', marginTop: '20px' }}>
              <View style={{ width: '400px' }}>
                <Text>
                  {t('Receipt:service-fee')}
                </Text>
              </View>
              <View style={{ width: '75px', textAlign: 'right' }}>
                <Text>{formatPrice(props.priceTotal * 0.17)} kr</Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'justify-between', width: '475px', marginTop: '20px' }}>
              <View style={{ width: '400px' }}>
                <Text>
                  {t('Receipt:vat')}
                </Text>
              </View>
              <View style={{ width: '75px', textAlign: 'right' }}>
                <Text>{formatPrice((props.priceTotal * 0.17) * 0.25)} kr</Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'justify-between', width: '475px', paddingTop: '20px', marginTop: '20px', borderTopColor: '#000', borderTopWidth: 1 }}>
              <View style={{ width: '325px' }}>
                <Text style={{ fontSize: '25pt' }}>
                  {t('Receipt:total')}
                </Text>
              </View>
              <View style={{ width: '150px', textAlign: 'right' }}>
                <Text style={{ fontSize: '25pt' }}>{priceOfOneAmount(props.priceTotal)} kr</Text>
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
            <Text>{t('Receipt:pdf-error')}</Text>
          </View>
        </Page>
      </Document>
    )
  }
}

export default ReceiptPDF
