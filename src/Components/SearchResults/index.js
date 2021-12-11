import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Geocode from 'react-geocode';
import List from './list';
import GoogleMap from './map';
import HostProfileView from '../HostProfileView/HostProfileView';
import moment from 'moment';
import axios from 'axios';
import { finalTotal } from '../../Modules/PriceCalculations';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import Popup from 'reactjs-popup';
import HostPopup from '../HostPopup';
import Spinner from '../ReusableComponents/Spinner';
import { useTranslation, Trans } from 'react-i18next';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';
import Refresh from '../Icons/Refresh';
import { Flexbox, InlineLink, SecondaryStickyHeader, Text } from '../../UI-Components';
import { Location, Cat, Availabilty, Map as MapIcon, List as ListIcon } from '../Icons';
import { SearchCriteriaWrapper, RoundButton, SearchResultWrapper, MapWrapper, JustifiedWrapper } from './styles';
import { Link } from 'react-router-dom';

const SearchResults = (props) => {
  const { t, ready } = useTranslation('SearchResults');
  const lang = detectLanguage();
  moment.locale(lang);

  const { id, history } = props;

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfCats, setNumberOfCats] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationLat, setLocationLat] = useState(null);
  const [locationLong, setLocationLong] = useState(null);
  const [hostProfileId, setHostProfileId] = useState('');
  const [score, setScore] = useState('');
  const [reviewsCount, setReviewsCount] = useState('');
  const [results, setResults] = useState('');
  const [openHostPopup, setOpenHostPopup] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hostPopupLoading, setHostPopupLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [availableByLocation, setAvailableByLocation] = useState([]);
  const [availableAllLocations, setAvailableAllLocations] = useState([]);
  const [allLocationsLoaded, setAllLocationsLoaded] = useState(false);
  const [hostId, setHostId] = useState('');
  const [hostAvatar, setHostAvatar] = useState('');
  const [hostNickname, setHostNickname] = useState('');
  const [hostLocation, setHostLocation] = useState('');
  const [hostRate, setHostRate] = useState('');
  const [hostSupplement, setHostSupplement] = useState('');
  const [hostDescription, setHostDescription] = useState('');
  const [hostLat, setHostLat] = useState('');
  const [hostLong, setHostLong] = useState('');
  const [hostAvailable, setHostAvailable] = useState('');

  const geolocationDataAddress = (place) => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE);
    Geocode.fromAddress(place).then((response) => {
      const { lat, lng } = response.results[0].geometry.location;
      setLocationLat(lat);
      setLocationLong(lng);
    });
  };

  const editHostsData = (array, status) => {
    array.map((host) => {
      host.available = status;
      host.id = host.user.id;
      host.lat = parseFloat(host.lat);
      host.lng = parseFloat(host.long);
      host.total = finalTotal(host.price_per_day_1_cat, cats, host.supplement_price_per_cat_per_day, from, to);
      return null;
    });
  };

  let from, to, location, cats;
  let today = moment.utc().hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();

  useEffect(() => {
    async function asyncDidMount() {
      if (queryString.parse(props.location.search).location === undefined) {
        history.push({ pathname: '/search' });
      } else {
        if (queryString.parse(props.location.search).from !== undefined) {
          // eslint-disable-next-line
          ({ from, to, location, cats } = queryString.parse(props.location.search));
        } else {
          location = queryString.parse(props.location.search).location;
          cats = 1;
          from = today + 86400000;
          to = today + 86400000;
        }
        if (queryString.parse(props.location.search).view === undefined) {
          window.history.replaceState(null, null, window.location.search.concat('&view=map'));
        }
        if (window.navigator.onLine === false) {
          setLoading(false);
          setErrors(['reusable:errors:window-navigator']);
        } else {
          try {
            let APIavailableByLocation = [];
            let APInotAvailableByLocation = [];
            let APIavailableAllLocations = [];
            let APInotAvailableAllLocations = [];
            const responseByLocation = await axios.get(
              `/api/v1/host_profiles?location=${location}&startDate=${from}&endDate=${to}&cats=${cats}&locale=${lang}`
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
            setCheckInDate(parseInt(from));
            setCheckOutDate(parseInt(to));
            setNumberOfCats(cats);
            setLocationName(location);
            setLoading(false);
            setResults(
              queryString.parse(props.location.search).view ? queryString.parse(props.location.search).view : 'map'
            );
            geolocationDataAddress(location);
            const responseAllLocations = await axios.get(
              `/api/v1/host_profiles?startDate=${from}&endDate=${to}&cats=${cats}&locale=${lang}`
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
              wipeCredentials('/is-not-available?atm');
            } else if (response.status === 500) {
              setLoading(false);
              setErrors(['reusable:errors:500']);
            } else {
              setLoading(false);
              setErrors(response.data.error);
            }
          }
        }
      }
    }
    asyncDidMount();
  }, []);

  useEffect(() => {
    window.scrollTo(0, scrollOffset);
    const href = new URL(window.location.href);
    href.searchParams.set('view', results || 'map');

    window.history.replaceState(null, null, href.search);
    resetHost();
  }, [results]);

  const handleHostProfileClick = () => {
    setResults('profile');
    setOpenHostPopup(false);
    setScrollOffset(window.pageYOffset);
    window.scrollTo(0, 0);
  };

  const getHostById = (id, status) => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      axios
        .get(`/api/v1/host_profiles?user_id=${id}&locale=${lang}`)
        .then(({ data }) => {
          if (data.length === 1) {
            setHostId(data[0].user.id);
            setHostAvatar(data[0].user.profile_avatar);
            setHostNickname(data[0].user.nickname);
            setHostLocation(data[0].user.location);
            setHostRate(data[0].price_per_day_1_cat);
            setHostSupplement(data[0].supplement_price_per_cat_per_day);
            setHostDescription(data[0].description);
            setHostLat(data[0].lat);
            setHostLong(data[0].long);
            setHostProfileId(data[0].id);
            setScore(data[0].score);
            setReviewsCount(data[0].reviews_count);
            setHostAvailable(status);
            setOpenHostPopup(true);
            setHostPopupLoading(false);
          } else {
            setErrors(['reusable:errors:index-no-host-1']);
          }
        })
        .catch(({ response }) => {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 500) {
            setErrors(['reusable:errors:500']);
          } else {
            setErrors(response.data.error);
          }
        });
    }
  };

  const resetHost = () => {
    setHostAvatar('');
    setHostNickname('');
    setHostLocation('');
    setHostRate('');
    setHostSupplement('');
    setHostDescription('');
    setHostLat('');
    setHostLong('');
    setHostAvailable('');
    setHostId('');
    setHostProfileId('');
    setScore('');
    setReviewsCount('');
  };

  const closeModal = () => {
    setOpenHostPopup(false);
    setHostPopupLoading(true);
    if (results !== 'profile') {
      resetHost();
    }
  };

  const requestToBookButtonClick = () => {
    if (id === undefined) {
      history.push('/login');
    } else {
      history.push({
        pathname: '/request-to-book',
        state: {
          numberOfCats: numberOfCats,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          nickname: hostNickname,
          hostRate: hostRate,
          hostSupplement: hostSupplement,
        },
      });
    }
  };

  const messageHost = (e) => {
    e.preventDefault();
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (id === undefined) {
        history.push('/login');
      } else {
        const path = '/api/v1/conversations';
        const payload = {
          user1_id: id,
          user2_id: hostId,
          locale: lang,
        };
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        axios
          .post(path, payload, { headers: headers })
          .then(({ data }) => {
            history.push({
              pathname: '/conversation',
              state: {
                id: data.id,
                user: {
                  profile_avatar: hostAvatar,
                  id: hostId,
                  location: hostLocation,
                  nickname: hostNickname,
                },
              },
            });
          })
          .catch(({ response }) => {
            if (response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (response.status === 500) {
              setErrors(['reusable:errors:500']);
            } else if (response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else if (response.status === 422) {
              setErrors(['reusable:errors:422-conversation']);
            } else {
              setErrors(response.data.error);
            }
          });
      }
    }
  };

  if (!ready || loading) return <Spinner />;

  return (
    <>
      <Helmet>
        <title>{`Kattvakt i ${location} | KattBNB`}</title>
        <meta
          name='description'
          content='Lämna din katt i trygga händer - hos en pålitlig kattvakt som verkligen bryr sig. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
        />
        <link rel='canonical' href={`https://kattbnb.se/search-results/${window.location.search}`} />
        <meta property='og:title' content={`Kattvakt i ${location} | KattBNB`} />
        <meta property='og:url' content={`https://kattbnb.se/search-results/${window.location.search}`} />
        <meta property='og:type' content='website' />
        <meta
          property='og:description'
          content='Lämna din katt i trygga händer - hos en pålitlig kattvakt som verkligen bryr sig. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
        />
        <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
      </Helmet>
      <Popup modal open={openHostPopup} closeOnDocumentClick={true} onClose={closeModal} position='top center'>
        <div>
          {hostPopupLoading ? (
            <Spinner />
          ) : (
            <HostPopup
              numberOfCats={numberOfCats}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              avatar={hostAvatar}
              nickname={hostNickname}
              location={hostLocation}
              rate={hostRate}
              supplement={hostSupplement}
              score={score}
              reviewsCount={reviewsCount}
              handleHostProfileClick={handleHostProfileClick}
              requestToBookButtonClick={requestToBookButtonClick}
              hostAvailable={hostAvailable}
              messageHost={messageHost}
              allowToBook={hostId === id ? false : true}
            />
          )}
        </div>
      </Popup>
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
              {moment(checkInDate).format('LL')} - {moment(checkOutDate).format('LL')}
            </Text>
          </Flexbox>

          <JustifiedWrapper horizontalAlign='left' space={6}>
            <Flexbox spaceItemsX={2}>
              <Flexbox spaceItemsX={1}>
                <Location />
                <Text>{locationName}</Text>
              </Flexbox>
              <Flexbox spaceItemsX={1}>
                <Cat />
                <Text>{numberOfCats}</Text>
              </Flexbox>
            </Flexbox>
            <InlineLink
              color='info'
              as={Link}
              to={{
                pathname: '/search',
                state: {
                  checkInDate: new Date(checkInDate),
                  checkOutDate: new Date(checkOutDate),
                  locationName: locationName,
                  numberOfCats: numberOfCats,
                },
              }}
            >
              Change search
            </InlineLink>
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
          <List
            finalAvailableHosts={availableByLocation}
            numberOfCats={numberOfCats}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            location={locationName}
            handleListItemClick={(id, hostStatus) => getHostById(id, hostStatus)}
          />
        </SearchResultWrapper>
      )}
      {results === 'map' && (
        <MapWrapper padding={150}>
          <GoogleMap
            numberOfCats={numberOfCats}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            mapCenterLat={locationLat}
            mapCenterLong={locationLong}
            byLocationAvailableHosts={availableByLocation}
            allAvailableHosts={availableAllLocations}
            handleDatapointClick={(id, hostStatus) => getHostById(id, hostStatus)}
          />
        </MapWrapper>
      )}
      {results === 'profile' && (
        <SearchResultWrapper padding={150}>
          <HostProfileView
            numberOfCats={numberOfCats}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            hostId={hostId}
            currentUserId={id}
            avatar={hostAvatar}
            nickname={hostNickname}
            location={hostLocation}
            rate={hostRate}
            supplement={hostSupplement}
            description={hostDescription}
            lat={hostLat}
            long={hostLong}
            hostProfileId={hostProfileId}
            score={score}
            requestToBookButtonClick={requestToBookButtonClick}
            messageHost={messageHost}
          />
        </SearchResultWrapper>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(SearchResults);
