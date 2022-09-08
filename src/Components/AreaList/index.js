import React from 'react';
import LOCATION_OPTIONS from '../../Modules/locationData.json';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container, Header, InlineLink } from '../../UI-Components';
import { Grid, WideContentWrapper } from './styles';

const AreaList = () => {
  const { t } = useTranslation();
  return (
    <WideContentWrapper>
      <Header level={3}>{t('reusable:title.area')}</Header>
      <Grid>
        {LOCATION_OPTIONS.map((place) => (
          <Container key={place.name}>
            <InlineLink as={Link}
              discreet
              className='discreet-link'
              to={`/search-results?location=${place.name}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {place.name}
            </InlineLink>
          </Container>
        ))}
      </Grid>
    </WideContentWrapper>
  );
};

export default AreaList;
