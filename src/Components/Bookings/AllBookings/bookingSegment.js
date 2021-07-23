import { BoxShadow, Section } from './styles';
import { Header, Text, InlineLink, Button } from '../../../UI-Components';

const BookingSegment = ({ id, header, stats, text, cta, ctaAction, ctaIsButton }) => {
  return (
    <BoxShadow space={8}>
      <Section top>
        <Header centered color='white' level={3} space={2}>
          {header}
        </Header>
        <Text centered color='white' dangerouslySetInnerHTML={{ __html: stats }} />
      </Section>
      <Section>
        <Text centered space={5}>{text}</Text>
        {ctaIsButton ? (
          <Button onClick={() => ctaAction()} id={`view-${id}`}>
            {cta}
          </Button>
        ) : (
          <Text centered>
            <InlineLink onClick={() => ctaAction()} id={`view-${id}`}>
              {cta}
            </InlineLink>
          </Text>
        )}
      </Section>
    </BoxShadow>
  );
};

export default BookingSegment;
