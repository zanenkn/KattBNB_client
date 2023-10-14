import moment from 'moment';
import useCurrentScope from '../../hooks/useCurrentScope';

import { Flexbox, Text } from '../../UI-Components';
import { Availabilty, Cat, Location } from '../../icons';
import { JustifiedWrapper, BookingInfoWrapper } from './styles';

const BookingInfo = ({ start, end, cats, place, centered, space }) => {
  const { device } = useCurrentScope();
  
  return (
    <BookingInfoWrapper centered={centered} space={space}>
      <Flexbox spaceItemsX={1} horizontalAlign='left' space={2}>
        <Availabilty />
        <Text>
          {moment(start).format(device.width > 375 ? 'LL' : 'll')} -{' '}
          {moment(end).format(device.width > 375 ? 'LL' : 'll')}
        </Text>
      </Flexbox>

      <JustifiedWrapper horizontalAlign='left' space={0}>
        <Flexbox spaceItemsX={2}>
          <Flexbox spaceItemsX={1}>
            <Location />
            <Text>{place}</Text>
          </Flexbox>
          <Flexbox spaceItemsX={1}>
            <Cat />
            <Text>{cats}</Text>
          </Flexbox>
        </Flexbox>
      </JustifiedWrapper>
    </BookingInfoWrapper>
  );
};

export default BookingInfo;
