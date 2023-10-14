import React, { useState, useEffect } from 'react';

import { connect, useDispatch } from 'react-redux';
import Geocode from 'react-geocode';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { useTranslation, Trans } from 'react-i18next';
import queryString from 'query-string';

import { getDaysArray } from '../../utils/getDaysArray';
import { useStartConversation } from '../../utils/useStartConversation';
import { finalTotal } from '../../Modules/PriceCalculations';
import useCurrentScope from '../../hooks/useCurrentScope';

import Spinner from '../../common/Spinner';
import SEO from '../../common/SEO';

import { Flexbox, InlineLink, SecondaryStickyHeader, Text, Notice } from '../../UI-Components';
import { Location, Cat, Availabilty, Map as MapIcon, Refresh, List as ListIcon } from '../../icons';
import { SearchCriteriaWrapper, RoundButton, SearchResultWrapper, JustifiedWrapper, BackLinkWrapper } from './styles';

import List from './list';
import GoogleMap from './map';
import Profile from './profile';
import HostPopup from './HostPopup';
import RequestToBook from './request';

const SearchResults = ({ id, currentSearch, currentHostId, location }) => {
  const { locale, device } = useCurrentScope();
  const { t, ready } = useTranslation('SearchResults');
  const dispatch = useDispatch();
  const { startConversation } = useStartConversation();

  const [listScrollOffset, setListScrollOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const [availableByLocation, setAvailableByLocation] = useState([]);
  const [availableAllLocations, setAvailableAllLocations] = useState([]);
  const [allLocationsLoaded, setAllLocationsLoaded] = useState(false);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [cats, setCats] = useState(null);

  const [mapConfig, setMapConfig] = useState({});

  const [results, setResults] = useState('');
  const [hostPopupOpen, setHostPopupOpen] = useState(false);

  const today = moment.utc().hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();

  moment.locale(locale);

  const geolocationDataAddress = (place) => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE);
    Geocode.fromAddress(`${place} Sweden`).then((response) => {
      const { lat, lng } = response.results[0].geometry.location;
      setMapConfig((prev) => ({ ...prev, lat: lat, lng: lng, zoom: 12 }));
    });
  };

  useEffect(() => {
    async function onMount() {
      if (!window.navigator.onLine) {
        setLoading(false);
        setErrors(['reusable:errors:window-navigator']);
        return;
      }

      if (!queryString.parse(location.search).view) {
        window.history.replaceState(null, null, window.location.search.concat('&view=map'));
      }

      let searchParams = {};

      if (queryString.parse(location.search).location) {
        searchParams.location = queryString.parse(location.search).location;
        searchParams.cats = queryString.parse(location.search).cats || 1;
        searchParams.from = parseInt(queryString.parse(location.search).from) || today + 86400000;
        searchParams.to = parseInt(queryString.parse(location.search).to) || today + 86400000;

        dispatch({
          type: 'NEW_SEARCH',
          currentSearch: {
            start: searchParams.from,
            end: searchParams.to,
            cats: searchParams.cats,
            location: searchParams.location,
            dates: getDaysArray(searchParams.from, searchParams.to),
          },
        });
      } else {
        searchParams.from = currentSearch.start;
        searchParams.to = currentSearch.end;
        searchParams.location = currentSearch.location;
        searchParams.cats = currentSearch.cats;
      }

      setFrom(searchParams.from);
      setTo(searchParams.to);
      setSearchLocation(searchParams.location);
      setCats(searchParams.cats);

      const editHostsData = (array, status) => {
        array.map((host) => {
          host.available = status;
          host.id = host.user.id;
          host.lat = parseFloat(host.lat);
          host.lng = parseFloat(host.long);
          host.total = finalTotal(
            host.price_per_day_1_cat,
            searchParams.cats,
            host.supplement_price_per_cat_per_day,
            searchParams.from,
            searchParams.to
          );
          return null;
        });
      };

      try {
        let APIavailableByLocation = [];
        let APInotAvailableByLocation = [];
        let APIavailableAllLocations = [];
        let APInotAvailableAllLocations = [];
        const responseByLocation = await axios.get(
          `/api/v1/host_profiles?location=${searchParams.location}&startDate=${searchParams.from}&endDate=${searchParams.to}&cats=${searchParams.cats}&locale=${locale}`
        );
        if (responseByLocation.data.with.length > 0) {
          APIavailableByLocation = responseByLocation.data.with.filter((host) => host.user.id !== id);
          APIavailableByLocation.sort((a, b) => b.score - a.score);
          editHostsData(APIavailableByLocation, true);
        }
        if (responseByLocation.data.without.length > 0) {
          APInotAvailableByLocation = responseByLocation.data.without.filter((host) => host.user.id !== id);
          APInotAvailableByLocation.sort((a, b) => b.score - a.score);
          editHostsData(APInotAvailableByLocation, false);
        }
        setAvailableByLocation(APIavailableByLocation.concat(APInotAvailableByLocation));
        setLoading(false);
        setResults(queryString.parse(location.search).view ? queryString.parse(location.search).view : 'map');
        geolocationDataAddress(searchParams.location);

        const responseAllLocations = await axios.get(
          `/api/v1/host_profiles?startDate=${searchParams.from}&endDate=${searchParams.to}&cats=${searchParams.cats}&locale=${locale}`
        );
        if (responseAllLocations.data !== '' && responseAllLocations.data.with.length > 0) {
          APIavailableAllLocations = responseAllLocations.data.with.filter((host) => host.user.id !== id);
          editHostsData(APIavailableAllLocations, true);
        }
        if (responseAllLocations.data !== '' && responseAllLocations.data.without.length > 0) {
          APInotAvailableAllLocations = responseAllLocations.data.without.filter((host) => host.user.id !== id);
          editHostsData(APInotAvailableAllLocations, false);
        }
        setAvailableAllLocations(APIavailableAllLocations.concat(APInotAvailableAllLocations));
        setAllLocationsLoaded(true);
      } catch ({ response }) {
        if (response === undefined) {
          setErrors(['reusable:errors:unknown']);
        } else if (response.status === 500) {
          setLoading(false);
          setErrors(['reusable:errors:500']);
        } else {
          setLoading(false);
          setErrors(response.data.error);
        }
      }
    }
    onMount();
  }, []);

  useEffect(() => {
    setHostPopupOpen(false);
    results === 'list' && window.scrollTo(0, listScrollOffset);

    const href = new URL(window.location.href);
    href.searchParams.set('view', results);

    if ((results === 'profile' || results === 'request') && hostPopupOpen) {
      window.scrollTo(0, 0);
      href.searchParams.append('host', hostPopupOpen);
    }

    if (results === 'map' || results === 'list') {
      href.searchParams.delete('host');
      dispatch({
        type: 'HOST_PROFILE_RESET',
      });
    }

    window.history.replaceState(null, null, href.search);
  }, [results]);

  const onCloseHostPopup = () => {
    if (results !== 'profile') {
      dispatch({
        type: 'HOST_PROFILE_RESET',
      });
    }
    setHostPopupOpen(false);
  };

  if (!ready || loading) return <Spinner page />;

  return (
    <>
      <SEO
        title={`Kattvakt i ${searchLocation} | KattBNB`}
        description='Lämna din katt i trygga händer - hos en pålitlig kattvakt som verkligen bryr sig. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
        href={`/search-results/${window.location.search}`}
        type='website'
        image='KattBNB_og.jpg'
      />

      {hostPopupOpen && (
        <HostPopup
          open={!!hostPopupOpen}
          id={hostPopupOpen}
          onClose={() => onCloseHostPopup()}
          toHostProfile={() => setResults('profile')}
          requestToBook={() => setResults('request')}
          messageHost={() => startConversation({ userId1: id, userId2: currentHostId })}
        />
      )}

      <Popup
        modal
        open={errors.length > 0}
        closeOnDocumentClick={true}
        onClose={() => setErrors([])}
        position='top center'
      >
        <Notice nature='danger'>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      </Popup>

      <SecondaryStickyHeader>
        <SearchCriteriaWrapper data-cy='search-criteria'>
          <Flexbox spaceItemsX={1} horizontalAlign='left' space={2}>
            <Availabilty />
            <Text data-cy='dates'>
              {moment(from).format(device.width > 375 ? 'LL' : 'll')} -{' '}
              {moment(to).format(device.width > 375 ? 'LL' : 'll')}
            </Text>
          </Flexbox>

          <JustifiedWrapper horizontalAlign='left' space={6}>
            <Flexbox spaceItemsX={2}>
              <Flexbox spaceItemsX={1}>
                <Location />
                <Text data-cy='location'>{searchLocation}</Text>
              </Flexbox>
              <Flexbox spaceItemsX={1}>
                <Cat />
                <Text data-cy='cats'>{cats}</Text>
              </Flexbox>
            </Flexbox>
            <BackLinkWrapper>
              <InlineLink data-cy='back' color='info' as={Link} to={'/search'}>
                {device.type === 'mobile' ? t('reusable:cta:change') : t('SearchResults:change-search')}
              </InlineLink>
            </BackLinkWrapper>
          </JustifiedWrapper>

          <JustifiedWrapper>
            <Flexbox>
              <RoundButton active={results === 'map'} data-cy='map' onClick={() => setResults('map')}>
                <MapIcon />
              </RoundButton>
              <RoundButton active={results === 'list'} data-cy='list' onClick={() => setResults('list')}>
                <ListIcon />
              </RoundButton>
            </Flexbox>
            {results === 'list' && (
              <Text data-cy='result-count'>
                <Trans values={{ count: availableByLocation.length }} i18nKey='SearchResults:counter' />
              </Text>
            )}
            {results === 'map' && (
              <Text data-cy='result-count'>
                {allLocationsLoaded ? (
                  <Trans values={{ count: availableByLocation.length }} i18nKey='SearchResults:counter' />
                ) : (
                  <div className='spin-it'>
                    <Refresh height={5} tint={80} />
                  </div>
                )}
              </Text>
            )}
            {(results === 'profile' || results === 'request') && (
              <InlineLink onClick={() => setResults('map')}>{t('SearchResults:back')}</InlineLink>
            )}
          </JustifiedWrapper>
        </SearchCriteriaWrapper>
      </SecondaryStickyHeader>

      {results === 'list' && (
        <SearchResultWrapper padding={150} background='neutral' data-cy='list'>
          <List
            finalAvailableHosts={availableByLocation}
            handleListItemClick={(id) => setHostPopupOpen(id)}
            onUnmount={() => setListScrollOffset(window.pageYOffset)}
            switchToMap={() => setResults('map')}
          />
        </SearchResultWrapper>
      )}
      {results === 'map' && (
        <SearchResultWrapper padding={150} map data-cy='map'>
          <GoogleMap
            byLocationAvailableHosts={availableByLocation}
            allAvailableHosts={availableAllLocations}
            handleDatapointClick={(id) => setHostPopupOpen(id)}
            onUnmount={(lat, lng, zoom) => setMapConfig({ lat: lat, lng: lng, zoom: zoom })}
            config={mapConfig}
          />
        </SearchResultWrapper>
      )}
      {results === 'profile' && (
        <SearchResultWrapper padding={150} data-cy='profile'>
          <Profile
            currentSearch={currentSearch}
            id={queryString.parse(location.search).host}
            toRequest={() => setResults('request')}
            messageHost={() => startConversation({ userId1: id, userId2: currentHostId })}
          />
        </SearchResultWrapper>
      )}
      {results === 'request' && (
        <SearchResultWrapper padding={150} data-cy='request'>
          <RequestToBook
            currentSearch={currentSearch}
            id={queryString.parse(location.search).host}
            toHost={() => setResults('profile')}
            toResults={() => setResults('map')}
          />
        </SearchResultWrapper>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
  currentSearch: state.currentSearch,
  currentHostId: state.currentHostProfile.userId,
});

export default connect(mapStateToProps)(SearchResults);
