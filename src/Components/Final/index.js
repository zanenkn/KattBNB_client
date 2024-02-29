import { Text, Container } from '../../UI-Components';
import { KattBNBLogo } from '../../icons';
import { Wrapper } from './styles';

const Final = () => {
  return (
    <Wrapper>
      <Container space={6}>
        <KattBNBLogo width={'150px'} />
      </Container>

      <Text centered>KattBNB har stängt. Tack för vår tid tillsammans!</Text>
    </Wrapper>
  );
};

export default Final;
