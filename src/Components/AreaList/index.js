import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Container, Header, InlineLink, TextField } from '../../UI-Components';
import { Grid, WideContentWrapper } from './styles';
import useFilteredLocations from './useFilteredLocations';

const AreaList = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const locations = useFilteredLocations(search);

  return (
    <WideContentWrapper>
      <Header level={3}>{t('reusable:title.area')}</Header>
      <TextField
        style={{ maxWidth: '200px' }}
        space={6}
        type='text'
        label={t('reusable:cta.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid>
        {locations.map((place) => (
          <Container key={place.name}>
            <InlineLink
              as={Link}
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
