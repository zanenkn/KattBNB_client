import React from 'react'
import { formatPrice, priceOfOneAmount } from '../../Modules/PriceCalculations'
import { useTranslation } from 'react-i18next'
import { Page, Text, View, Document } from '@react-pdf/renderer'

const ReceiptPDF = (props) => (
  <Document>
    <Page size='A6'>
      <View>
        <Text>KattBNB AB</Text>
        <Text>Reg. Number 559252-4481</Text>
      </View>
      <View>
        <Text>Receipt #{props.bookingId}</Text>
        <Text>{props.createdAt}</Text>
      </View>
      <View>
        <Text>For the stay of your {props.numberOfCats} cats with {props.nickname} between {props.startDate} and {props.endDate} you paid the amounts listed below:</Text>
      </View>
      <View>
        <Text>For {props.nickname} you paid: {formatPrice(props.priceTotal)} kr</Text>
      </View>
      <View>
        <Text>For KattBNB (17%) you paid: {formatPrice(props.priceTotal * 0.17)} kr</Text>
      </View>
      <View>
        <Text>For VAT (25%) you paid: {formatPrice((props.priceTotal * 0.17) * 0.25)} kr</Text>
      </View>
      <View>
        <Text>TOTAL: {priceOfOneAmount(props.priceTotal)} kr</Text>
      </View>
    </Page>
  </Document>
)

export default ReceiptPDF
