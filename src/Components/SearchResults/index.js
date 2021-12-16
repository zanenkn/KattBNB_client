import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Geocode from 'react-geocode';
import List from './list';
import GoogleMap from './map';
import HostProfileView from '../HostProfileView/HostProfileView';
import moment from 'moment';
import axios from 'axios';
import { getDaysArray } from '../../utils/getDaysArray';
import { finalTotal } from '../../Modules/PriceCalculations';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import Popup from 'reactjs-popup';
import HostPopup from './HostPopup';
import Spinner from '../../common/Spinner';
import { useTranslation, Trans } from 'react-i18next';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';
import Refresh from '../../icons/Refresh';
import { Flexbox, InlineLink, SecondaryStickyHeader, Text } from '../../UI-Components';
import { Location, Cat, Availabilty, Map as MapIcon, List as ListIcon } from '../../icons';
import { SearchCriteriaWrapper, RoundButton, SearchResultWrapper, JustifiedWrapper, BackLinkWrapper } from './styles';
import { Link } from 'react-router-dom';
import { useDeviceInfo } from '../../hooks/useDeviceInfo';

const SearchResults = ({ id, currentSearch, location }) => {
  const lang = detectLanguage();

  const { t, ready } = useTranslation('SearchResults');
  const dispatch = useDispatch();
  const device = useDeviceInfo();

  const [scrollOffset, setScrollOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const [availableByLocation, setAvailableByLocation] = useState([]);
  const [availableAllLocations, setAvailableAllLocations] = useState([]);
  const [allLocationsLoaded, setAllLocationsLoaded] = useState(false);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [cats, setCats] = useState(null);

  const [locationLat, setLocationLat] = useState(null);
  const [locationLong, setLocationLong] = useState(null);

  const [results, setResults] = useState('');
  const [hostPopupOpen, setHostPopupOpen] = useState(false);

  const today = moment.utc().hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();

  moment.locale(lang);

  const geolocationDataAddress = (place) => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE);
    Geocode.fromAddress(place).then((response) => {
      const { lat, lng } = response.results[0].geometry.location;
      setLocationLat(lat);
      setLocationLong(lng);
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

      if (!!Object.keys(currentSearch).length) {
        searchParams.from = currentSearch.start;
        searchParams.to = currentSearch.end;
        searchParams.location = currentSearch.location;
        searchParams.cats = currentSearch.cats;
      } else {
        searchParams.location = queryString.parse(location.search).location || 'Göteborg';
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
          `/api/v1/host_profiles?location=${searchParams.location}&startDate=${searchParams.from}&endDate=${searchParams.to}&cats=${searchParams.cats}&locale=${lang}`
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
          `/api/v1/host_profiles?startDate=${searchParams.from}&endDate=${searchParams.to}&cats=${searchParams.cats}&locale=${lang}`
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
          //wipeCredentials('/is-not-available?atm');
          // gotta stop wiping credentials every time something went wrong and we dont know what. a general error is needed.
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
    window.scrollTo(0, scrollOffset);
    const href = new URL(window.location.href);
    href.searchParams.set('view', results || 'map');

    window.history.replaceState(null, null, href.search);
    //resetHost();
  }, [results]);

  const toHostProfile = () => {
    // probs can be solved with useEffect somehow
    setResults('profile');
    setHostPopupOpen(false);

    setScrollOffset(window.pageYOffset);
    window.scrollTo(0, 0);
  };

  const onCloseHostPopup = () => {
    if (results !== 'profile') {
      dispatch({
        type: 'HOST_PROFILE_RESET',
      });
      setHostPopupOpen(false);
    }
  };

  // const messageHost = (e) => {
  //   e.preventDefault();
  //   if (window.navigator.onLine === false) {
  //     setErrors(['reusable:errors:window-navigator']);
  //   } else {
  //     if (id === undefined) {
  //       history.push('/login');
  //     } else {
  //       const path = '/api/v1/conversations';
  //       const payload = {
  //         user1_id: id,
  //         user2_id: hostId,
  //         locale: lang,
  //       };
  //       const headers = {
  //         uid: window.localStorage.getItem('uid'),
  //         client: window.localStorage.getItem('client'),
  //         'access-token': window.localStorage.getItem('access-token'),
  //       };
  //       axios
  //         .post(path, payload, { headers: headers })
  //         .then(({ data }) => {
  //           history.push({
  //             pathname: '/conversation',
  //             state: {
  //               id: data.id,
  //               user: {
  //                 profile_avatar: hostAvatar,
  //                 id: hostId,
  //                 location: hostLocation,
  //                 nickname: hostNickname,
  //               },
  //             },
  //           });
  //         })
  //         .catch(({ response }) => {
  //           if (response === undefined) {
  //             wipeCredentials('/is-not-available?atm');
  //           } else if (response.status === 500) {
  //             setErrors(['reusable:errors:500']);
  //           } else if (response.status === 401) {
  //             window.alert(t('reusable:errors:401'));
  //             wipeCredentials('/');
  //           } else if (response.status === 422) {
  //             setErrors(['reusable:errors:422-conversation']);
  //           } else {
  //             setErrors(response.data.error);
  //           }
  //         });
  //     }
  //   }
  // };

  if (!ready || loading) return <Spinner />;

  return (
    <>
      <Helmet>
        <title>{`Kattvakt i ${searchLocation} | KattBNB`}</title>
        <meta
          name='description'
          content='Lämna din katt i trygga händer - hos en pålitlig kattvakt som verkligen bryr sig. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
        />
        <link rel='canonical' href={`https://kattbnb.se/search-results/${window.location.search}`} />
        <meta property='og:title' content={`Kattvakt i ${searchLocation} | KattBNB`} />
        <meta property='og:url' content={`https://kattbnb.se/search-results/${window.location.search}`} />
        <meta property='og:type' content='website' />
        <meta
          property='og:description'
          content='Lämna din katt i trygga händer - hos en pålitlig kattvakt som verkligen bryr sig. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
        />
        <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
      </Helmet>

      {hostPopupOpen && (
        <HostPopup
          open={!!hostPopupOpen}
          id={hostPopupOpen}
          onClose={() => onCloseHostPopup()}
          toHostProfile={() => toHostProfile()}
        />
      )}

      <Popup
        modal
        open={errors.length > 0}
        closeOnDocumentClick={true}
        onClose={() => setErrors([])}
        position='top center'
      >
        <div>
          {/* <Message negative>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message> */}
        </div>
      </Popup>

      <SecondaryStickyHeader>
        <SearchCriteriaWrapper>
          <Flexbox spaceItemsX={1} horizontalAlign='left' space={2}>
            <Availabilty />
            <Text>
              {moment(from).format(device.width > 375 ? 'LL' : 'll')} -{' '}
              {moment(to).format(device.width > 375 ? 'LL' : 'll')}
            </Text>
          </Flexbox>

          <JustifiedWrapper horizontalAlign='left' space={6}>
            <Flexbox spaceItemsX={2}>
              <Flexbox spaceItemsX={1}>
                <Location />
                <Text>{searchLocation}</Text>
              </Flexbox>
              <Flexbox spaceItemsX={1}>
                <Cat />
                <Text>{cats}</Text>
              </Flexbox>
            </Flexbox>
            <BackLinkWrapper>
              <InlineLink color='info' as={Link} to={'/search'}>
                {device.type === 'mobile' ? 'Change' : 'Change search'}
              </InlineLink>
            </BackLinkWrapper>
          </JustifiedWrapper>

          <JustifiedWrapper>
            <Flexbox>
              <RoundButton active={results === 'map'} id='map-button' onClick={() => setResults('map')}>
                <MapIcon />
              </RoundButton>
              <RoundButton active={results === 'list'} id='list-button' onClick={() => setResults('list')}>
                <ListIcon />
              </RoundButton>
            </Flexbox>
            {results === 'list' && (
              <Text>
                <Trans values={{ count: availableByLocation.length }} i18nKey='SearchResults:counter' />
              </Text>
            )}
            {results === 'map' && (
              <Text>
                {allLocationsLoaded ? (
                  <Trans values={{ count: availableByLocation.length }} i18nKey='SearchResults:counter' />
                ) : (
                  <Refresh height={'28px'} fill={'silver'} className={'spin-it'} />
                )}
              </Text>
            )}
            {results === 'profile' && (
              <InlineLink onClick={() => setResults('map')}>{t('SearchResults:back')}</InlineLink>
            )}
          </JustifiedWrapper>
        </SearchCriteriaWrapper>
      </SecondaryStickyHeader>

      {results === 'list' && (
        <SearchResultWrapper padding={150}>
          <List finalAvailableHosts={availableByLocation} handleListItemClick={(id) => setHostPopupOpen(id)} />
        </SearchResultWrapper>
      )}
      {results === 'map' && (
        <SearchResultWrapper padding={150}>
          <GoogleMap
            mapCenterLat={locationLat}
            mapCenterLong={locationLong}
            byLocationAvailableHosts={availableByLocation}
            allAvailableHosts={availableAllLocations}
            handleDatapointClick={(id) => setHostPopupOpen(id)}
          />
        </SearchResultWrapper>
      )}
      {results === 'profile' && (
        <SearchResultWrapper padding={150}>
          <HostProfileView
          //requestToBookButtonClick={requestToBookButtonClick}
          //messageHost={messageHost}
          />
        </SearchResultWrapper>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  id: state.reduxTokenAuth.currentUser.attributes.id,
  currentSearch: state.currentSearch,
});

export default connect(mapStateToProps)(SearchResults);
