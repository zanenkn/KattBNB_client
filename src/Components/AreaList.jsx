import React from 'react';
import { LOCATION_OPTIONS } from '../Modules/locationData';
import { Header } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

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
            <Link
              className='discreet-link'
              to={`/search-results?location=${place.text}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {place.text}
            </Link>
          </p>
        ))}
      </div>
    </div>
  );
};

export default AreaList;
