import React from 'react';
import { LOCATION_OPTIONS } from '../Modules/locationData';
import { Header } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const AreaList = () => {
  const { t } = useTranslation();
  return (
    <div className='content-wrapper' style={{ maxWidth: '1024px', margin: 'auto' }}>
      <Header as='h1' style={{ marginBottom: '2rem' }}>
        {t('reusable:title.area')}
      </Header>
      <div className='flex-grid'>
        {LOCATION_OPTIONS.map((place) => (
          <p key={place.text}>
            <a
              className='discreet-link'
              href={`/search-results?location=${place.text}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {place.text}
            </a>
          </p>
        ))}
      </div>
    </div>
  );
};

export default AreaList;
