import GoogleMapReact from 'google-map-react';
import mapStyles from '../../Modules/MapStyle.js';
import { useTranslation, Trans } from 'react-i18next';
import { Flexbox, Header, Text } from '../../UI-Components/index.js';
import { Location } from '../../icons/index.js';
import { MapWrapper } from './styles';

const HostLocationMap = ({ address, lat, long, nickname }) => {
  const { t } = useTranslation('HostLocationMap');
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
  return (
    <>
      <Header level={4}>{t('HostLocationMap:header-location')}</Header>
      <MapWrapper>
        <GoogleMapReact
          defaultCenter={{ lat: 59.330651, lng: 18.068562 }}
          center={{ lat: lat, lng: long }}
          defaultZoom={15}
          options={{ scrollwheel: false, zoomControl: false, gestureHandling: 'none', styles: mapStyles }}
          yesIWantToUseGoogleMapApiInternals
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
        >
          <Location lat={lat} lng={long} height={8} fill='primary' />
        </GoogleMapReact>
      </MapWrapper>

      {!address ? (
        <Text centered>
          <Trans i18nKey='HostLocationMap:under-map-txt' values={{ nickname: nickname }}>
            This is the approximate area of <strong>{nickname}</strong>. You will receive the exact location when
            booking is confirmed.
          </Trans>
        </Text>
      ) : (
        <Flexbox>
          <Location />
          <a href={googleMapsLink} target='_blank' rel='noopener noreferrer'>
            {address}
          </a>
        </Flexbox>
      )}
    </>
  );
};

export default HostLocationMap;
