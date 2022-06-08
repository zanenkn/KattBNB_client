import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { TextField, Header, Container } from '../../../UI-Components';
import withStyling from './withStyling';

const StyledCardNumberElement = withStyling(CardNumberElement);
const StyledCardExpiryElement = withStyling(CardExpiryElement);
const StyledCardCvcElement = withStyling(CardCvcElement);

const CheckoutForm = ({ cardholderName, onChangeCardHolder, postalCode, onChangePostalCode, t }) => {
  return (
    <Container>
      <Header level={4}>{t('RequestToBook:label')}</Header>
      <div class='flex-50'>
        <div>
          <TextField
            type='text'
            label={t('RequestToBook:cardholder')}
            id='cardholderName'
            value={cardholderName}
            onChange={(e) => onChangeCardHolder(e.target.value)}
            required
            space={0}
          />
        </div>

        <StyledCardNumberElement label={t('RequestToBook:card-number')} options={{ showIcon: true }} />
      </div>
      <div class='flex-30'>
        <StyledCardExpiryElement label={t('RequestToBook:expiry')} />
        <StyledCardCvcElement label={t('RequestToBook:cvc')} />
        <TextField
          type='number'
          label={t('RequestToBook:postal-code')}
          value={postalCode}
          onChange={(e) => onChangePostalCode(e.target.value)}
          required
          space={0}
        />
      </div>
    </Container>
  );
};

export default CheckoutForm;
