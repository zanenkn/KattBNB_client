import { BoxShadow, TopBox } from './styles';
import { Header, Text, InlineLink, Button } from '../../../UI-Components';

const BookingSegment = ({ id, header, stats, text, cta, ctaAction, ctaIsButton }) => {
  return (
    <BoxShadow>
      <TopBox>
        <Header centered tint={0} level={3}>
          {header}
        </Header>
        <Text size='sm' centered color='neutral' tint={0} dangerouslySetInnerHTML={{ __html: stats }} />
      </TopBox>
      <Text centered>{text}</Text>
      {ctaIsButton ? (
        <Button onClick={() => ctaAction()} id={`view-${id}`}>
          {cta}
        </Button>
      ) : (
        <InlineLink onClick={() => ctaAction()} id={`view-${id}`}>
          {cta}
        </InlineLink>
      )}
    </BoxShadow>
  );
};

export default BookingSegment;
