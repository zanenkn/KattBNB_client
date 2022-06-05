import Spinner from '../../../common/Spinner';
import { Stripe } from '../../../icons';
import { Header, Text, Container } from '../../../UI-Components';
import { LoadingPaymentWrapper } from './styles';

const PaymentProcessingDisplay = ({ t }) => {
  return (
    <LoadingPaymentWrapper>
      <Container>
        <Spinner />
      </Container>

      <Header centered space={4}>{t('RequestToBook:payment-processed-header')}</Header>
      <Text centered space={8}>{t('RequestToBook:payment-processed-text')}</Text>
      <Stripe tint={60} height={6}/>
    </LoadingPaymentWrapper>
  );
};

export default PaymentProcessingDisplay;
