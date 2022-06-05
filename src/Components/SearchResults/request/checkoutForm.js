import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { TextField, Header } from '../../../UI-Components';
import withStyling from './withStyling';

const StyledCardNumberElement = withStyling(CardNumberElement);
const StyledCardExpiryElement = withStyling(CardExpiryElement);
const StyledCardCvcElement = withStyling(CardCvcElement);

const CheckoutForm = ({ cardholderName, onChangeCardHolder, postalCode, onChangePostalCode }) => {
  const { ready, t } = useTranslation('StripeCardDetails');

  if (ready) {
    return (
      <>
        <Header level={4}>{t('StripeCardDetails:label')}</Header>
        <div class='flex-50'>
          <div>
            <TextField
              type='text'
              label={t('StripeCardDetails:cardholder')}
              id='cardholderName'
              value={cardholderName}
              onChange={(e) => onChangeCardHolder(e.target.value)}
              required
              space={0}
            />
          </div>

          <StyledCardNumberElement label={t('StripeCardDetails:card-number')} options={{ showIcon: true }} />
        </div>
        <div class='flex-30'>
          <StyledCardExpiryElement label={t('StripeCardDetails:expiry')} />
          <StyledCardCvcElement label={t('StripeCardDetails:cvc')} />
          <TextField
            type='number'
            label={t('StripeCardDetails:postal-code')}
            value={postalCode}
            onChange={(e) => onChangePostalCode(e.target.value)}
            required
            space={0}
          />
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default CheckoutForm;
