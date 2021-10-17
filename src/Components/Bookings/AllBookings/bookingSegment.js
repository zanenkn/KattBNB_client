import { BoxShadow, Section } from '../common/styles';
import { Header, Text, InlineLink, Button } from '../../../UI-Components';

const BookingSegment = ({ id, header, stats, text, cta, ctaAction, ctaIsButton }) => {
  return (
    <BoxShadow space={8}>
      <Section top>
        <Header centered level={3} space={2}>
          {header}
        </Header>
        <Text centered dangerouslySetInnerHTML={{ __html: stats }} />
      </Section>
      <Section>
        <Text centered space={5}>{text}</Text>
        {ctaIsButton ? (
          <Button onClick={() => ctaAction()} data-cy={`view-${id}`}>
            {cta}
          </Button>
        ) : (
          <Text centered>
            <InlineLink onClick={() => ctaAction()} data-cy={`view-${id}`}>
              {cta}
            </InlineLink>
          </Text>
        )}
      </Section>
    </BoxShadow>
  );
};

export default BookingSegment;
