import { Container, Text, Button } from '../../../UI-Components';

const Booking = ({ header, text, extraText, links, cta, booking, testId, children }) => {
  return (
    <Container
      id={booking.id}
      data-cy={testId}
    >
      {header && <Text bold>{header}</Text>}
      <Text>{text}</Text>
      {extraText && (
        <Text centered italic>
          {extraText}
        </Text>
      )}
      {cta && <Button onClick={() => cta.action()}>{cta.text}</Button>}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {links.map((link, i) => (
          <p key={'link' + i} onClick={() => link.action()}>
            {link.text}
          </p>
        ))}
      </div>
      {children}
    </Container>
  );
};

export default Booking;
