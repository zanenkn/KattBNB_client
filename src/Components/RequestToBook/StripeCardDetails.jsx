import React from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';

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
  return <div>a</div>
  // if (ready) {
  //   return (
  //     <Form className='stripe-wrapper'>
  //       <div className='required field' style={{ display: 'flex', flexDirection: 'column' }}>
  //         <label>{t('StripeCardDetails:label')}</label>
  //         <input
  //           className='stripe-card-element-full'
  //           type='text'
  //           placeholder={t('StripeCardDetails:cardholder')}
  //           id='cardholderName'
  //           value={props.cardholderName}
  //           onChange={props.onChangeCardHolder}
  //         ></input>
  //         <div className='stripe-card-element-full'>
  //           <CardNumberElement
  //             options={{ style: style, placeholder: t('StripeCardDetails:card-number'), showIcon: true }}
  //           />
  //         </div>
  //         <div className='stripe-secondary-wrapper'>
  //           <div className='stripe-card-element-small'>
  //             <CardExpiryElement options={{ style: style, placeholder: t('StripeCardDetails:expiry') }} />
  //           </div>
  //           <div className='stripe-card-element-small'>
  //             <CardCvcElement options={{ style: style, placeholder: t('StripeCardDetails:cvc') }} />
  //           </div>
  //           <input
  //             style={{ marginTop: '4px' }}
  //             className='stripe-card-element-small'
  //             type='number'
  //             placeholder={t('StripeCardDetails:postal-code')}
  //             id='postalCode'
  //             value={props.postalCode}
  //             onChange={props.onChangePostalCode}
  //           ></input>
  //         </div>
  //       </div>
  //     </Form>
  //   );
  // } else {
  //   return null;
  // }
};

export default StripeCardDetails;
