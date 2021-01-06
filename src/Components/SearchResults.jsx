/* eslint-disable react-hooks/exhaustive-deps */
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

const SearchResults = (props) => {
  const { t, ready } = useTranslation('SearchResults');

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfCats, setNumberOfCats] = useState('');
  const [location, setLocation] = useState('');
  const [locationLat, setLocationLat] = useState('');
  const [locationLong, setLocationLong] = useState('');
  const [hostProfileId, setHostProfileId] = useState('');
  const [score, setScore] = useState('');
  const [reviewsCount, setReviewsCount] = useState('');
  const [results, setResults] = useState('list');
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

  const geolocationDataAddress = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE);
    Geocode.fromAddress(props.history.location.state.location).then((response) => {
      const { lat, lng } = response.results[0].geometry.location;
      setLocationLat(lat);
      setLocationLong(lng);
    });
  };

  useEffect(() => {
    async function asyncDidMount() {
      if (props.history.location.state === undefined) {
        props.history.push({ pathname: '/search' });
      } else {
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
              `/api/v1/host_profiles?location=${props.history.location.state.location}&startDate=${props.history.location.state.from}&endDate=${props.history.location.state.to}&cats=${props.history.location.state.cats}&locale=${lang}`
            );
            if (responseByLocation.data.with.length > 0) {
              APIavailableByLocation = responseByLocation.data.with.filter((host) => host.user.id !== props.id);
              APIavailableByLocation.sort((a, b) => b.score - a.score);
              APIavailableByLocation.map((host) => {
                host.available = true;
                return null;
              });
            }
            if (responseByLocation.data.without.length > 0) {
              APInotAvailableByLocation = responseByLocation.data.without.filter((host) => host.user.id !== props.id);
              APInotAvailableByLocation.sort((a, b) => b.score - a.score);
              APInotAvailableByLocation.map((host) => {
                host.available = false;
                return null;
              });
            }
            setAvailableByLocation(APIavailableByLocation.concat(APInotAvailableByLocation));
            const responseAllLocations = await axios.get(
              `/api/v1/host_profiles?startDate=${props.history.location.state.from}&endDate=${props.history.location.state.to}&cats=${props.history.location.state.cats}&locale=${lang}`
            );
            if (responseAllLocations.data !== '' && responseAllLocations.data.with.length > 0) {
              APIavailableAllLocations = responseAllLocations.data.with.filter((host) => host.user.id !== props.id);
              APIavailableAllLocations.map((host) => {
                host.available = true;
                host.id = host.user.id;
                host.lat = parseFloat(host.lat);
                host.lng = parseFloat(host.long);
                host.total = finalTotal(
                  host.price_per_day_1_cat,
                  props.history.location.state.cats,
                  host.supplement_price_per_cat_per_day,
                  props.history.location.state.from,
                  props.history.location.state.to
                );
                return null;
              });
            }
            if (responseAllLocations.data !== '' && responseAllLocations.data.without.length > 0) {
              APInotAvailableAllLocations = responseAllLocations.data.without.filter(
                (host) => host.user.id !== props.id
              );
              APInotAvailableAllLocations.map((host) => {
                host.available = false;
                host.id = host.user.id;
                host.lat = parseFloat(host.lat);
                host.lng = parseFloat(host.long);
                host.total = finalTotal(
                  host.price_per_day_1_cat,
                  props.history.location.state.cats,
                  host.supplement_price_per_cat_per_day,
                  props.history.location.state.from,
                  props.history.location.state.to
                );
                return null;
              });
            }
            setAvailableAllLocations(APIavailableAllLocations.concat(APInotAvailableAllLocations));
          } catch (error) {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 500) {
              setLoading(false);
              setErrorDisplay(true);
              setErrors(['reusable:errors:500']);
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm');
            } else {
              setLoading(false);
              setErrorDisplay(true);
              setErrors(error.response.data.error);
            }
          }
          setCheckInDate(props.history.location.state.from);
          setCheckOutDate(props.history.location.state.to);
          setNumberOfCats(props.history.location.state.cats);
          setLocation(props.history.location.state.location);
          setLoading(false);
          geolocationDataAddress();
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
        .then((response) => {
          if (response.data.length === 1) {
            setHostId(response.data[0].user.id);
            setHostAvatar(response.data[0].user.profile_avatar);
            setHostNickname(response.data[0].user.nickname);
            setHostLocation(response.data[0].user.location);
            setHostRate(response.data[0].price_per_day_1_cat);
            setHostSupplement(response.data[0].supplement_price_per_cat_per_day);
            setHostDescription(response.data[0].description);
            setHostLat(response.data[0].lat);
            setHostLong(response.data[0].long);
            setHostProfileId(response.data[0].id);
            setScore(response.data[0].score);
            setReviewsCount(response.data[0].reviews_count);
            setHostAvailable(status);
            setOpenHostPopup(true);
            setHostPopupLoading(false);
          } else {
            setErrorDisplay(true);
            setErrors(['reusable:errors:index-no-host-1']);
          }
        })
        .catch((error) => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (error.response.status === 500) {
            setErrorDisplay(true);
            setErrors(['reusable:errors:500']);
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm');
          } else {
            setErrorDisplay(true);
            setErrors(error.response.data.error);
          }
        });
    }
  };

  const handleDatapointClick = (id, status) => {
    getHostById(id, status);
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
    setResults(e.target.id.split('-')[0]);
    resetHost();
  };

  const requestToBookButtonClick = () => {
    if (props.id === undefined) {
      props.history.push('/login');
    } else {
      props.history.push({
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
      if (props.id === undefined) {
        props.history.push('/login');
      } else {
        const lang = detectLanguage();
        const path = '/api/v1/conversations';
        const payload = {
          user1_id: props.id,
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
          .then((response) => {
            props.history.push({
              pathname: '/conversation',
              state: {
                id: response.data.id,
                user: {
                  profile_avatar: hostAvatar,
                  id: hostId,
                  location: hostLocation,
                  nickname: hostNickname,
                },
              },
            });
          })
          .catch((error) => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 500) {
              setErrorDisplay(true);
              setErrors(['reusable:errors:500']);
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else if (error.response.status === 422) {
              setErrorDisplay(true);
              setErrors(['reusable:errors:422-conversation']);
            } else {
              setErrorDisplay(true);
              setErrors(error.response.data.error);
            }
          });
      }
    }
  };





};

const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(SearchResults);

// import React, { Component } from 'react';
// import { Form, Icon, Grid, Header, Message } from 'semantic-ui-react';
// import { connect } from 'react-redux';
// import Geocode from 'react-geocode';
// import List from './List';
// import GoogleMap from './Map/GoogleMap';
// import HostProfileView from './HostProfileView/HostProfileView';
// import moment from 'moment';
// import 'moment/locale/sv';
// import axios from 'axios';
// import { finalTotal } from '../Modules/PriceCalculations';
// import { detectLanguage } from '../Modules/detectLanguage';
// import { wipeCredentials } from '../Modules/wipeCredentials';
// import Popup from 'reactjs-popup';
// import HostPopup from './HostPopup';
// import Spinner from './ReusableComponents/Spinner';
// import { withTranslation, Trans } from 'react-i18next';

// class SearchResults extends Component {
//   state = {
//     checkInDate: '',
//     checkOutDate: '',
//     numberOfCats: '',
//     location: '',
//     locationLat: '',
//     locationLong: '',
//     hostProfileId: '',
//     score: '',
//     reviewsCount: '',
//     results: 'list',
//     openHostPopup: false,
//     scrollOffset: 0,
//     loading: true,
//     hostPopupLoading: true,
//     errorDisplay: false,
//     errors: [],
//     availableByLocation: [],
//     availableAllLocations: [],
//   };

//   geolocationDataAddress = () => {
//     Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE);
//     Geocode.fromAddress(this.props.history.location.state.location).then((response) => {
//       const { lat, lng } = response.results[0].geometry.location;
//       this.setState({
//         locationLat: lat,
//         locationLong: lng,
//       });
//     });
//   };

//   async componentDidMount() {
//     if (this.props.history.location.state === undefined) {
//       this.props.history.push({ pathname: '/search' });
//     } else {
//       if (window.navigator.onLine === false) {
//         this.setState({
//           loading: false,
//           errorDisplay: true,
//           errors: ['reusable:errors:window-navigator'],
//         });
//       } else {
//         try {
//           const lang = detectLanguage();
//           let availableAllLocations = [];
//           let notAvailableAllLocations = [];
//           let availableByLocation = [];
//           let notAvailableByLocation = [];
//           const responseByLocation = await axios.get(
//             `/api/v1/host_profiles?location=${this.props.history.location.state.location}&startDate=${this.props.history.location.state.from}&endDate=${this.props.history.location.state.to}&cats=${this.props.history.location.state.cats}&locale=${lang}`
//           );
//           if (responseByLocation.data.with.length > 0) {
//             availableByLocation = responseByLocation.data.with.filter((host) => host.user.id !== this.props.id);
//             availableByLocation.sort((a, b) => b.score - a.score);
//             availableByLocation.map((host) => {
//               host.available = true;
//               return null;
//             });
//           }
//           if (responseByLocation.data.without.length > 0) {
//             notAvailableByLocation = responseByLocation.data.without.filter((host) => host.user.id !== this.props.id);
//             notAvailableByLocation.sort((a, b) => b.score - a.score);
//             notAvailableByLocation.map((host) => {
//               host.available = false;
//               return null;
//             });
//           }
//           this.setState({
//             availableByLocation: availableByLocation.concat(notAvailableByLocation),
//           });
//           const responseAllLocations = await axios.get(
//             `/api/v1/host_profiles?startDate=${this.props.history.location.state.from}&endDate=${this.props.history.location.state.to}&cats=${this.props.history.location.state.cats}&locale=${lang}`
//           );
//           if (responseAllLocations.data !== '' && responseAllLocations.data.with.length > 0) {
//             availableAllLocations = responseAllLocations.data.with.filter((host) => host.user.id !== this.props.id);
//             availableAllLocations.map((host) => {
//               host.available = true;
//               host.id = host.user.id;
//               host.lat = parseFloat(host.lat);
//               host.lng = parseFloat(host.long);
//               host.total = finalTotal(
//                 host.price_per_day_1_cat,
//                 this.props.history.location.state.cats,
//                 host.supplement_price_per_cat_per_day,
//                 this.props.history.location.state.from,
//                 this.props.history.location.state.to
//               );
//               return null;
//             });
//           }
//           if (responseAllLocations.data !== '' && responseAllLocations.data.without.length > 0) {
//             notAvailableAllLocations = responseAllLocations.data.without.filter(
//               (host) => host.user.id !== this.props.id
//             );
//             notAvailableAllLocations.map((host) => {
//               host.available = false;
//               host.id = host.user.id;
//               host.lat = parseFloat(host.lat);
//               host.lng = parseFloat(host.long);
//               host.total = finalTotal(
//                 host.price_per_day_1_cat,
//                 this.props.history.location.state.cats,
//                 host.supplement_price_per_cat_per_day,
//                 this.props.history.location.state.from,
//                 this.props.history.location.state.to
//               );
//               return null;
//             });
//           }
//           this.setState({
//             availableAllLocations: availableAllLocations.concat(notAvailableAllLocations),
//           });
//         } catch (error) {
//           if (error.response === undefined) {
//             wipeCredentials('/is-not-available?atm');
//           } else if (error.response.status === 500) {
//             this.setState({
//               loading: false,
//               errorDisplay: true,
//               errors: ['reusable:errors:500'],
//             });
//           } else if (error.response.status === 503) {
//             wipeCredentials('/is-not-available?atm');
//           } else {
//             this.setState({
//               loading: false,
//               errorDisplay: true,
//               errors: error.response.data.error,
//             });
//           }
//         }
//         this.setState({
//           checkInDate: this.props.history.location.state.from,
//           checkOutDate: this.props.history.location.state.to,
//           numberOfCats: this.props.history.location.state.cats,
//           location: this.props.history.location.state.location,
//           loading: false,
//         });
//         this.geolocationDataAddress();
//       }
//     }
//   }

//   handleHostProfileClick() {
//     this.setState({
//       results: 'profile',
//       openHostPopup: false,
//       scrollOffset: window.pageYOffset,
//     });
//     window.scrollTo(0, 0);
//   }

//   getHostById(id, status) {
//     if (window.navigator.onLine === false) {
//       this.setState({
//         errorDisplay: true,
//         errors: ['reusable:errors:window-navigator'],
//       });
//     } else {
//       const lang = detectLanguage();
//       axios
//         .get(`/api/v1/host_profiles?user_id=${id}&locale=${lang}`)
//         .then((response) => {
//           if (response.data.length === 1) {
//             this.setState({
//               hostId: response.data[0].user.id,
//               hostAvatar: response.data[0].user.profile_avatar,
//               hostNickname: response.data[0].user.nickname,
//               hostLocation: response.data[0].user.location,
//               hostRate: response.data[0].price_per_day_1_cat,
//               hostSupplement: response.data[0].supplement_price_per_cat_per_day,
//               hostDescription: response.data[0].description,
//               hostLat: response.data[0].lat,
//               hostLong: response.data[0].long,
//               hostProfileId: response.data[0].id,
//               score: response.data[0].score,
//               reviewsCount: response.data[0].reviews_count,
//               hostAvailable: status,
//               openHostPopup: true,
//               hostPopupLoading: false,
//             });
//           } else {
//             this.setState({
//               errorDisplay: true,
//               errors: ['reusable:errors:index-no-host-1'],
//             });
//           }
//         })
//         .catch((error) => {
//           if (error.response === undefined) {
//             wipeCredentials('/is-not-available?atm');
//           } else if (error.response.status === 500) {
//             this.setState({
//               errorDisplay: true,
//               errors: ['reusable:errors:500'],
//             });
//           } else if (error.response.status === 503) {
//             wipeCredentials('/is-not-available?atm');
//           } else {
//             this.setState({
//               errorDisplay: true,
//               errors: error.response.data.error,
//             });
//           }
//         });
//     }
//   }

//   handleDatapointClick(id, status) {
//     this.getHostById(id, status);
//   }

//   resetHost() {
//     this.setState({
//       hostAvatar: '',
//       hostNickname: '',
//       hostLocation: '',
//       hostRate: '',
//       hostSupplement: '',
//       hostDescription: '',
//       hostLat: '',
//       hostLong: '',
//       hostAvailable: '',
//       hostId: '',
//       hostProfileId: '',
//       score: '',
//       reviewsCount: '',
//     });
//   }

//   closeModal = () => {
//     this.setState({
//       openHostPopup: false,
//       hostPopupLoading: true,
//     });
//     if (this.state.results !== 'profile') {
//       this.resetHost();
//     }
//   };

//   switchResultView = (e) => {
//     window.scrollTo(0, this.state.scrollOffset);
//     this.setState({ results: e.target.id.split('-')[0] });
//     this.resetHost();
//   };

//   requestToBookButtonClick = () => {
//     if (this.props.id === undefined) {
//       this.props.history.push('/login');
//     } else {
//       this.props.history.push({
//         pathname: '/request-to-book',
//         state: {
//           numberOfCats: this.state.numberOfCats,
//           checkInDate: this.state.checkInDate,
//           checkOutDate: this.state.checkOutDate,
//           nickname: this.state.hostNickname,
//           hostRate: this.state.hostRate,
//           hostSupplement: this.state.hostSupplement,
//         },
//       });
//     }
//   };

//   messageHost = (e) => {
//     e.preventDefault();
//     const { t } = this.props;
//     if (window.navigator.onLine === false) {
//       this.setState({
//         errorDisplay: true,
//         errors: ['reusable:errors:window-navigator'],
//       });
//     } else {
//       if (this.props.id === undefined) {
//         this.props.history.push('/login');
//       } else {
//         const lang = detectLanguage();
//         const path = '/api/v1/conversations';
//         const payload = {
//           user1_id: this.props.id,
//           user2_id: this.state.hostId,
//           locale: lang,
//         };
//         const headers = {
//           uid: window.localStorage.getItem('uid'),
//           client: window.localStorage.getItem('client'),
//           'access-token': window.localStorage.getItem('access-token'),
//         };
//         axios
//           .post(path, payload, { headers: headers })
//           .then((response) => {
//             this.props.history.push({
//               pathname: '/conversation',
//               state: {
//                 id: response.data.id,
//                 user: {
//                   profile_avatar: this.state.hostAvatar,
//                   id: this.state.hostId,
//                   location: this.state.hostLocation,
//                   nickname: this.state.hostNickname,
//                 },
//               },
//             });
//           })
//           .catch((error) => {
//             if (error.response === undefined) {
//               wipeCredentials('/is-not-available?atm');
//             } else if (error.response.status === 500) {
//               this.setState({
//                 errorDisplay: true,
//                 errors: ['reusable:errors:500'],
//               });
//             } else if (error.response.status === 503) {
//               wipeCredentials('/is-not-available?atm');
//             } else if (error.response.status === 401) {
//               window.alert(t('reusable:errors:401'));
//               wipeCredentials('/');
//             } else if (error.response.status === 422) {
//               this.setState({
//                 errorDisplay: true,
//                 errors: ['reusable:errors:422-conversation'],
//               });
//             } else {
//               this.setState({
//                 errorDisplay: true,
//                 errors: error.response.data.error,
//               });
//             }
//           });
//       }
//     }
//   };

//   render() {
//     const { t } = this.props;
//     let inDate = moment(this.state.checkInDate).format('l');
//     let outDate = moment(this.state.checkOutDate).format('l');
//     let listButton, mapButton, mapButtonStyle, listButtonStyle, resultCounter, results, errorDisplay;

//     if (this.props.tReady && this.state.loading === false) {
//       switch (this.state.results) {
//         case 'list':
//           results = (
//             <div id='search-results-wrapper'>
//               <List
//                 finalAvailableHosts={this.state.availableByLocation}
//                 numberOfCats={this.state.numberOfCats}
//                 checkInDate={this.state.checkInDate}
//                 checkOutDate={this.state.checkOutDate}
//                 location={this.state.location}
//                 handleListItemClick={this.handleDatapointClick.bind(this)}
//               />
//             </div>
//           );
//           mapButtonStyle = { backgroundColor: 'grey', cursor: 'pointer' };
//           listButtonStyle = { backgroundColor: '#c90c61', cursor: 'pointer' };
//           resultCounter = (
//             <Trans values={{ count: this.state.availableByLocation.length }} i18nKey='SearchResults:counter' />
//           );
//           break;
//         case 'map':
//           results = (
//             <div id='search-results-wrapper'>
//               <GoogleMap
//                 numberOfCats={this.state.numberOfCats}
//                 checkInDate={this.state.checkInDate}
//                 checkOutDate={this.state.checkOutDate}
//                 mapCenterLat={this.state.locationLat}
//                 mapCenterLong={this.state.locationLong}
//                 allAvailableHosts={this.state.availableAllLocations}
//                 handleDatapointClick={this.handleDatapointClick.bind(this)}
//               />
//             </div>
//           );
//           mapButtonStyle = { backgroundColor: '#c90c61', cursor: 'pointer' };
//           listButtonStyle = { backgroundColor: 'grey', cursor: 'pointer' };
//           resultCounter = (
//             <Trans values={{ count: this.state.availableByLocation.length }} i18nKey='SearchResults:counter' />
//           );
//           break;
//         case 'profile':
//           results = (
//             <div id='search-results-wrapper' style={{ background: 'white' }}>
//               <HostProfileView
//                 numberOfCats={this.state.numberOfCats}
//                 checkInDate={this.state.checkInDate}
//                 checkOutDate={this.state.checkOutDate}
//                 hostId={this.state.hostId}
//                 currentUserId={this.props.id}
//                 avatar={this.state.hostAvatar}
//                 nickname={this.state.hostNickname}
//                 location={this.state.hostLocation}
//                 rate={this.state.hostRate}
//                 supplement={this.state.hostSupplement}
//                 description={this.state.hostDescription}
//                 lat={this.state.hostLat}
//                 long={this.state.hostLong}
//                 hostProfileId={this.state.hostProfileId}
//                 score={this.state.score}
//                 requestToBookButtonClick={this.requestToBookButtonClick.bind(this)}
//                 messageHost={this.messageHost.bind(this)}
//               />
//             </div>
//           );
//           resultCounter = (
//             <Header
//               id='list-return'
//               onClick={this.switchResultView}
//               className='fake-link-underlined'
//               style={{ textAlign: 'right' }}
//             >
//               {t('SearchResults:back')}
//             </Header>
//           );
//           break;
//       }

//       if (this.state.results === 'profile') {
//         listButton = (
//           <Icon id='list-button' name='list' disabled circular inverted style={{ backgroundColor: 'grey' }} />
//         );
//         mapButton = <Icon id='map-button' name='map' disabled circular inverted style={{ backgroundColor: 'grey' }} />;
//       } else {
//         listButton = (
//           <Icon
//             id='list-button'
//             name='list'
//             circular
//             inverted
//             style={listButtonStyle}
//             onClick={this.switchResultView}
//           />
//         );
//         mapButton = (
//           <Icon id='map-button' name='map' circular inverted style={mapButtonStyle} onClick={this.switchResultView} />
//         );
//       }

//       if (this.state.errorDisplay) {
//         errorDisplay = (
//           <Message negative>
//             <ul id='message-error-list'>
//               {this.state.errors.map((error) => (
//                 <li key={error}>{t(error)}</li>
//               ))}
//             </ul>
//           </Message>
//         );
//       }

//       return (
//         <>
//           <Popup
//             modal
//             open={this.state.openHostPopup}
//             closeOnDocumentClick={true}
//             onClose={this.closeModal}
//             position='top center'
//           >
//             <div>
//               {this.state.hostPopupLoading ? (
//                 <Spinner />
//               ) : (
//                 <HostPopup
//                   numberOfCats={this.state.numberOfCats}
//                   checkInDate={this.state.checkInDate}
//                   checkOutDate={this.state.checkOutDate}
//                   avatar={this.state.hostAvatar}
//                   nickname={this.state.hostNickname}
//                   location={this.state.hostLocation}
//                   rate={this.state.hostRate}
//                   supplement={this.state.hostSupplement}
//                   score={this.state.score}
//                   reviewsCount={this.state.reviewsCount}
//                   handleHostProfileClick={this.handleHostProfileClick.bind(this)}
//                   requestToBookButtonClick={this.requestToBookButtonClick.bind(this)}
//                   hostAvailable={this.state.hostAvailable}
//                   messageHost={this.messageHost.bind(this)}
//                 />
//               )}
//             </div>
//           </Popup>
//           <Popup
//             modal
//             open={this.state.errorDisplay}
//             closeOnDocumentClick={true}
//             onClose={() => {
//               this.setState({ errorDisplay: false, errors: [] });
//             }}
//             position='top center'
//           >
//             <div>{errorDisplay}</div>
//           </Popup>
//           <div id='secondary-sticky'>
//             <div style={{ width: 'min-content', margin: 'auto' }}>
//               <p style={{ color: '#c90c61', textAlign: 'left' }}>
//                 <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
//                   <path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' />
//                 </svg>
//                 &nbsp;{this.state.location}&emsp;
//                 <svg fill='#c90c61' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 236.62 236.62'>
//                   <path d='M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z' />
//                 </svg>
//                 &nbsp;{this.state.numberOfCats}
//               </p>
//               <Form style={{ padding: '0', width: '100%' }}>
//                 <Form.Group
//                   inline
//                   unstackable
//                   style={{ padding: '0', justifyContent: 'space-between', margin: 'auto', minWidth: '258px' }}
//                 >
//                   <Form.Input
//                     iconPosition='left'
//                     style={{ maxWidth: '125px', marginRight: '-1rem' }}
//                     readOnly
//                     value={inDate}
//                     icon={<Icon fitted name='arrow right' style={{ color: '#c90c61' }} />}
//                   />
//                   <Form.Input
//                     iconPosition='left'
//                     style={{ maxWidth: '125px', marginRight: '-1rem' }}
//                     readOnly
//                     value={outDate}
//                     icon={<Icon fitted name='arrow left' style={{ color: '#c90c61' }} />}
//                   />
//                 </Form.Group>
//               </Form>
//               <Grid
//                 columns={2}
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   marginTop: '1rem',
//                   marginLeft: 'auto',
//                   marginRight: 'auto',
//                 }}
//               >
//                 <Grid.Column width={8} style={{ padding: '0' }}>
//                   {listButton}
//                   {mapButton}
//                 </Grid.Column>
//                 <Grid.Column
//                   width={8}
//                   style={{ padding: '0', textAlign: 'right', alignContent: 'center', display: 'grid' }}
//                 >
//                   <strong style={{ color: 'grey', fontSize: 'small' }}>{resultCounter}</strong>
//                 </Grid.Column>
//               </Grid>
//             </div>
//           </div>
//           {results}
//         </>
//       );
//     } else {
//       return <Spinner />;
//     }
//   }
// }

// const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

// export default withTranslation('SearchResults')(connect(mapStateToProps)(SearchResults));
