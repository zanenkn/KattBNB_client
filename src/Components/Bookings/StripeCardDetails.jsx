import React from 'react'
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { Form } from 'semantic-ui-react'

const StripeCardDetails = (props) => {
  let style = {
 
      base: {
        fontSize: '13px',
        '::placeholder': {
          fontStyle: 'italic',
          color: 'silver'
        },
      }
  }

  return (
    <div style={{ 'display': 'flex', 'flexDirection': 'column' }}>
      <div className='stripe-wrapper'>
        <Form.Input
          style={{ 'width': '100%' }}
          type='text'
          placeholder='Cardholder name'
          required
          id='cardholderName'
          value={props.cardholderName}
          onChange={props.onChange}
        />
        <div className='stripe-card-element-full'>
          <CardNumberElement options={{style: style, placeholder: 'Kortnummer'}}/>
        </div>

      </div>
      <div className='stripe-secondary-wrapper'>
        <div style={{ 'marginRight': '4px' }} className='stripe-card-element-small'>
          <CardExpiryElement options={{style: style, placeholder: 'MM/ÅÅ'}} />
        </div>
        <div className='stripe-card-element-small'>
          <CardCvcElement options={{style: style, placeholder: 'CVC'}}/>
        </div>
      </div>
    </div>
  )
}

export default StripeCardDetails
