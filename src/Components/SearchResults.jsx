import React, { useState, useEffect } from 'react';
import { Form, Icon, Grid, Header, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Geocode from 'react-geocode';
import List from './List';
import GoogleMap from './Map/GoogleMap';
import HostProfileView from './HostProfileView/HostProfileView';
import moment from 'moment';
import 'moment/locale/sv';
import axios from 'axios';
import { finalTotal } from '../Modules/PriceCalculations';
import { detectLanguage } from '../Modules/detectLanguage';
import { wipeCredentials } from '../Modules/wipeCredentials';
import Popup from 'reactjs-popup';
import HostPopup from './HostPopup';
import Spinner from './ReusableComponents/Spinner';
import { useTranslation, Trans } from 'react-i18next';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';

const SearchResults = (props) => {
  const { t, ready } = useTranslation('SearchResults');
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
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState([]);
  const [availableByLocation, setAvailableByLocation] = useState([]);
  const [availableAllLocations, setAvailableAllLocations] = useState([]);
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
          setErrorDisplay(true);
          setErrors(['reusable:errors:window-navigator']);
        } else {
          try {
            const lang = detectLanguage();
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
          } catch ({ response }) {
            if (response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (response.status === 500) {
              setLoading(false);
              setErrorDisplay(true);
              setErrors(['reusable:errors:500']);
            } else {
              setLoading(false);
              setErrorDisplay(true);
              setErrors(response.data.error);
            }
          }
        }
      }
    }
    asyncDidMount();
  }, []);

  const handleHostProfileClick = () => {
    setResults('profile');
    setOpenHostPopup(false);
    setScrollOffset(window.pageYOffset);
    window.scrollTo(0, 0);
  };

  const getHostById = (id, status) => {
    if (window.navigator.onLine === false) {
      setErrorDisplay(true);
      setErrors(['reusable:errors:window-navigator']);
    } else {
      const lang = detectLanguage();
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
            setErrorDisplay(true);
            setErrors(['reusable:errors:index-no-host-1']);
          }
        })
        .catch(({ response }) => {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 500) {
            setErrorDisplay(true);
            setErrors(['reusable:errors:500']);
          } else {
            setErrorDisplay(true);
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

  const switchResultView = (e) => {
    window.scrollTo(0, scrollOffset);
    window.history.replaceState(
      null,
      null,
      window.location.search.replace(`view=${results}`, `view=${e.target.id.split('-')[0]}`)
    );
    setResults(e.target.id.split('-')[0]);
    resetHost();
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
      setErrorDisplay(true);
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (id === undefined) {
        history.push('/login');
      } else {
        const lang = detectLanguage();
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
              setErrorDisplay(true);
              setErrors(['reusable:errors:500']);
            } else if (response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else if (response.status === 422) {
              setErrorDisplay(true);
              setErrors(['reusable:errors:422-conversation']);
            } else {
              setErrorDisplay(true);
              setErrors(response.data.error);
            }
          });
      }
    }
  };

  if (ready && loading === false) {
    let listButtonStyle, mapButtonStyle, resultCounter, resultDisplay;

    switch (results) {
      case 'list':
        listButtonStyle = { backgroundColor: '#c90c61', cursor: 'pointer' };
        mapButtonStyle = { backgroundColor: 'grey', cursor: 'pointer' };
        resultCounter = <Trans values={{ count: availableByLocation.length }} i18nKey='SearchResults:counter' />;
        resultDisplay = (
          <div id='search-results-wrapper'>
            <List
              finalAvailableHosts={availableByLocation}
              numberOfCats={numberOfCats}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              location={locationName}
              handleListItemClick={(id, hostStatus) => getHostById(id, hostStatus)}
            />
          </div>
        );
        break;
      case 'map':
        listButtonStyle = { backgroundColor: 'grey', cursor: 'pointer' };
        mapButtonStyle = { backgroundColor: '#c90c61', cursor: 'pointer' };
        resultCounter = <Trans values={{ count: availableByLocation.length }} i18nKey='SearchResults:counter' />;
        resultDisplay = (
          <div id='search-results-wrapper'>
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
          </div>
        );
        break;
      case 'profile':
        resultCounter = (
          <Header
            id='list-return'
            onClick={switchResultView}
            className='fake-link-underlined'
            style={{ textAlign: 'right' }}
          >
            {t('SearchResults:back')}
          </Header>
        );
        resultDisplay = (
          <div id='search-results-wrapper' style={{ background: 'white' }}>
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
          </div>
        );
        break;
      default:
        break;
    }

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
          open={errorDisplay}
          closeOnDocumentClick={true}
          onClose={() => {
            setErrorDisplay(false);
            setErrors([]);
          }}
          position='top center'
        >
          <div>
            <Message negative>
              <ul id='message-error-list'>
                {errors.map((error) => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Message>
          </div>
        </Popup>
        <div id='secondary-sticky'>
          <div style={{ width: 'min-content', margin: 'auto' }}>
            <p style={{ color: '#c90c61', textAlign: 'left' }}>
              <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                <path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' />
              </svg>
              &nbsp;{locationName}&emsp;
              <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 236.62 236.62'>
                <path d='M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z' />
              </svg>
              &nbsp;{numberOfCats}
            </p>
            <Form style={{ padding: '0', width: '100%' }}>
              <Form.Group
                inline
                unstackable
                style={{ padding: '0', justifyContent: 'space-between', margin: 'auto', minWidth: '258px' }}
              >
                <Form.Input
                  iconPosition='left'
                  style={{ maxWidth: '125px', marginRight: '-1rem' }}
                  readOnly
                  value={moment(checkInDate).format('l')}
                  icon={<Icon fitted name='arrow right' style={{ color: '#c90c61' }} />}
                />
                <Form.Input
                  iconPosition='left'
                  style={{ maxWidth: '125px', marginRight: '-1rem' }}
                  readOnly
                  value={moment(checkOutDate).format('l')}
                  icon={<Icon fitted name='arrow left' style={{ color: '#c90c61' }} />}
                />
              </Form.Group>
            </Form>
            <Grid
              columns={2}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '1rem',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <Grid.Column width={8} style={{ padding: '0' }}>
                {results === 'profile' ? (
                  <>
                    <Icon id='list-button' name='list' disabled circular inverted style={{ backgroundColor: 'grey' }} />
                    <Icon id='map-button' name='map' disabled circular inverted style={{ backgroundColor: 'grey' }} />
                  </>
                ) : (
                  <>
                    <Icon
                      id='list-button'
                      name='list'
                      circular
                      inverted
                      style={listButtonStyle}
                      onClick={switchResultView}
                    />
                    <Icon
                      id='map-button'
                      name='map'
                      circular
                      inverted
                      style={mapButtonStyle}
                      onClick={switchResultView}
                    />
                  </>
                )}
              </Grid.Column>
              <Grid.Column
                width={8}
                style={{ padding: '0', textAlign: 'right', alignContent: 'center', display: 'grid' }}
              >
                <strong style={{ color: 'grey', fontSize: 'small' }}>{resultCounter}</strong>
              </Grid.Column>
            </Grid>
          </div>
        </div>
        {resultDisplay}
      </>
    );
  } else {
    return <Spinner />;
  }
};

const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(SearchResults);
