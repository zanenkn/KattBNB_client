import { Text, Button, InlineLink } from '../../../UI-Components';
import { BookingContainer, BookingLinks } from './styles';

const Booking = ({ header, text, extraText, links, cta, booking, testId, children }) => {
  return (
    <BookingContainer id={booking.id} data-cy={testId}>
      {header && (
        <Text bold centered>
          {header}
        </Text>
      )}
      <Text>{text}</Text>
      {extraText && (
        <Text centered italic>
          {extraText}
        </Text>
      )}
      {cta && (
        <Button onClick={() => cta.action()} space={0}>
          {cta.text}
        </Button>
      )}
      <BookingLinks>
        {links?.map((link, i) => (
          <InlineLink color='info' key={'link' + booking.id + '-' + i} onClick={() => link.action()}>
            {link.text}
          </InlineLink>
        ))}
      </BookingLinks>
      {children}
    </BookingContainer>
  );
};

export default Booking;
