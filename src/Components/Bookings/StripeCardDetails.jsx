import React from 'react'
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { Form } from 'semantic-ui-react'

const StripeCardDetails = (props) => {
  let style = {
    base: {
      fontSize: '13px',
      '::placeholder': {
        fontStyle: 'italic',
        color: 'silver',
      },
    }
  }

  return (
    <Form>
      <div className='required field' style={{ 'display': 'flex', 'flexDirection': 'column' }}>
        <label>
          Your card details
          </label>
        <div className='stripe-wrapper'>
          <input className='stripe-card-element-full'
            type='text'
            placeholder='Cardholder name'
            id='cardholderName'
            value={props.cardholderName}
            onChange={props.onChange}>
          </input>
          <div className='stripe-card-element-full'>
            <CardNumberElement options={{ style: style, placeholder: 'Card number' }} />
          </div>
        </div>
        <div className='stripe-secondary-wrapper'>
          <div style={{ 'marginRight': '4px' }} className='stripe-card-element-small'>
            <CardExpiryElement options={{ style: style, placeholder: 'MM/YY' }} />
          </div>
          <div className='stripe-card-element-small'>
            <CardCvcElement options={{ style: style, placeholder: 'CVC' }} />
          </div>
        </div>
      </div>
    </Form>
  )
}

export default StripeCardDetails
