import React from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { TextField, Header, Flexbox } from '../../../UI-Components';

const StripeCardDetails = (props) => {
  let style = {
    base: {
      fontSize: '13px',
      '::placeholder': {
        fontStyle: 'italic',
        color: 'silver',
      },
    },
  };

  const { ready, t } = useTranslation('StripeCardDetails');

  if (ready) {
    return (
      <div className='stripe-wrapper'>
        <div className='required field' style={{ display: 'flex', flexDirection: 'column' }}>
          <Header level={4}>{t('StripeCardDetails:label')}</Header>

          <TextField
            className='stripe-card-element-full'
            type='text'
            label={t('StripeCardDetails:cardholder')}
            id='cardholderName'
            value={props.cardholderName}
            onChange={props.onChangeCardHolder}
          />

          <div className='stripe-card-element-full'>
            <CardNumberElement
              options={{ style: style, placeholder: t('StripeCardDetails:card-number'), showIcon: true }}
            />
          </div>

          <div className='stripe-secondary-wrapper'>
            <div className='stripe-card-element-small'>
              <CardExpiryElement options={{ style: style, placeholder: t('StripeCardDetails:expiry') }} />
            </div>
            <div className='stripe-card-element-small'>
              <CardCvcElement options={{ style: style, placeholder: t('StripeCardDetails:cvc') }} />
            </div>
            <input
              style={{ marginTop: '4px' }}
              className='stripe-card-element-small'
              type='number'
              placeholder={t('StripeCardDetails:postal-code')}
              id='postalCode'
              value={props.postalCode}
              onChange={props.onChangePostalCode}
            ></input>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default StripeCardDetails;
