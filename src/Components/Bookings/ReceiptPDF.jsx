import React from 'react'
import KattBNBLogo from '../Icons/KattBNBLogo'
import { formatPrice, priceOfOneAmount } from '../../Modules/PriceCalculations'
import { useTranslation } from 'react-i18next'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

const ReceiptPDF = () => (
  <Document>
    <Page size='A6'>
      <View>
        <Text>Section #1</Text>
      </View>
      <View>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
)

export default ReceiptPDF
