import React from 'react';
import Spinner from '../ReusableComponents/Spinner';
import GoogleMapReact from 'google-map-react';
import mapStyles from '../../Modules/MapStyle.js';
import { Header, Icon } from 'semantic-ui-react';
import { useTranslation, Trans } from 'react-i18next';

const HostLocationMap = ({ address, lat, long, nickname }) => {
  const { t, ready } = useTranslation('HostLocationMap');

  if (ready) {
    let googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${parseFloat(lat)},${parseFloat(long)}`;

    return (
      <>
        <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
          <Header as='h3' style={{ textAlign: 'left', margin: '2rem 0 1rem' }}>
            {t('HostLocationMap:header-location')}
          </Header>
          <GoogleMapReact
            defaultCenter={{ lat: 59.330651, lng: 18.068562 }}
            center={{ lat: parseFloat(lat), lng: parseFloat(long) }}
            defaultZoom={15}
            options={{ scrollwheel: false, zoomControl: false, gestureHandling: 'none', styles: mapStyles }}
            yesIWantToUseGoogleMapApiInternals
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
          >
            <Icon
              name='map marker alternate'
              size='huge'
              style={{ color: '#c90c61' }}
              lat={parseFloat(lat)}
              lng={parseFloat(long)}
            />
          </GoogleMapReact>
        </div>
        {address === undefined ? (
          <p className='small-centered-paragraph' style={{ marginBottom: '0.5rem' }}>
            <Trans i18nKey='HostLocationMap:under-map-txt' values={{ nickname: nickname }}>
              This is the approximate area of <strong style={{ color: '#c90c61' }}>{nickname}</strong>. You will receive
              the exact location when booking is confirmed.
            </Trans>
          </p>
        ) : (
          <p style={{ margin: '1rem', textAlign: 'center' }}>
            <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' />
            </svg>
            &nbsp;
            <a href={googleMapsLink} target='_blank' rel='noopener noreferrer'>
              {address}
            </a>
          </p>
        )}
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default HostLocationMap;
