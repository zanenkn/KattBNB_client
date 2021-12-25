import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Geocode from 'react-geocode';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import DayPicker, { DateUtils } from 'react-day-picker';
import '../../NpmPackageCSS/react-day-picker.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import Spinner from '../../common/Spinner';
import { generateRandomNumber } from '../../Modules/locationRandomizer';
import { search } from '../../Modules/addressLocationMatcher';
import { ContentWrapper, Text, Header, TextArea, TextField, Flexbox, Button } from '../../UI-Components';
import { formValidation } from '../../Modules/formValidation';

const HostProfileForm = ({ closeForm }) => {
  const { t, ready } = useTranslation('HostProfileForm');

  const [newHost, setNewHost] = useState({ description: '', rate: '', maxCats: '' });
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const today = new Date();
  const lang = detectLanguage();

  const validator = formValidation({
    fields: [
      {
        condition: newHost.maxCats < 1 || newHost.maxCats % 1 !== 0,
        error: 'HostProfileForm:create-error-1',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  // constructor(props) {
  //   super(props);
  //   this.handleDayClick = this.handleDayClick.bind(this);
  //   this.state = {
  //     selectedDays: [],
  //     description: '',
  //     userInputAddress: '',
  //     addressSearch: true,
  //     latitude: '',
  //     longitude: '',
  //     lat: '',
  //     long: '',
  //     address: '',
  //     rate: '',
  //     addressError: '',
  //     addressErrorDisplay: false,
  //     errors: '',
  //     maxCats: '',
  //     supplement: '',
  //     availability: '',
  //     loading: false,
  //   };
  // }

  // onChangeHandler = (e) => {
  //   this.setState({ [e.target.id]: e.target.value });
  // };

  // convertAvailabilityDates() {
  //   let availableDates = this.state.selectedDays.map(function (day) {
  //     let date = new Date(day);
  //     let utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  //     return new Date(utc).getTime();
  //   });
  //   let sortedAvailableDates = availableDates.sort(function (a, b) {
  //     return a - b;
  //   });
  //   this.setState({ availability: sortedAvailableDates });
  // }

  const convertToMs = (day) => {
    let date = new Date(day);
    let utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return new Date(utc).getTime();
  };

  const handleDayClick = (day, { selected }) => {
    // const { selectedDays } = this.state;
    const today = new Date();
    const tomorrowNumber = today.getTime() + 86400000;
    const tomorrowDate = new Date(tomorrowNumber);
    if (day > tomorrowDate || day.toDateString() === tomorrowDate.toDateString()) {
      if (selected) {
        setSelectedDays((prev) => [...prev.filter((existing) => existing !== selected)]);
      } else {
        setSelectedDays((prev) => [...prev, convertToMs(day)]);
      }
      //   this.setState({ selectedDays });
      //   this.convertAvailabilityDates();
    }
  };

  // geolocationDataAddress = () => {
  //   const { t } = this.props;
  //   Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE);
  //   Geocode.setLanguage('sv');
  //   Geocode.fromAddress(this.state.userInputAddress).then(
  //     (response) => {
  //       const { lat, lng } = response.results[0].geometry.location;
  //       if (search(this.props.location, response.results[0].address_components) === undefined) {
  //         if (window.confirm(t('reusable:alerts.no-match-address'))) {
  //           this.setState({
  //             latitude: lat,
  //             longitude: lng,
  //             lat: lat - generateRandomNumber(),
  //             long: lng + generateRandomNumber(),
  //             address: response.results[0].formatted_address,
  //             addressSearch: false,
  //             addressErrorDisplay: false,
  //             addressError: '',
  //           });
  //         }
  //       } else {
  //         this.setState({
  //           latitude: lat,
  //           longitude: lng,
  //           lat: lat - generateRandomNumber(),
  //           long: lng + generateRandomNumber(),
  //           address: response.results[0].formatted_address,
  //           addressSearch: false,
  //           addressErrorDisplay: false,
  //           addressError: '',
  //         });
  //       }
  //     },
  //     (error) => {
  //       if (error.message === 'Server returned status code ZERO_RESULTS') {
  //         this.setState({
  //           addressErrorDisplay: true,
  //           addressError: t('reusable:errors:google-error-1'),
  //         });
  //       } else if (error.message === 'Server returned status code REQUEST_DENIED') {
  //         this.setState({
  //           addressErrorDisplay: true,
  //           addressError: t('reusable:errors:google-error-2'),
  //         });
  //       } else {
  //         this.setState({
  //           addressErrorDisplay: true,
  //           addressError: error.message,
  //         });
  //       }
  //     }
  //   );
  // };

  // listenEnterKey = (event) => {
  //   if (event.key === 'Enter') {
  //     this.createHostProfile(event);
  //   }
  // };

  const createHostProfile = (e) => {
    console.log('bajs');
    //   const { t } = this.props;
    //   const lang = detectLanguage();
    //   e.preventDefault();
    //   this.setState({ loading: true });
    //   if (window.navigator.onLine === false) {
    //     this.setState({
    //       loading: false,
    //       errors: ['reusable:errors:window-navigator'],
    //     });
    //   } else {
    //     if (this.state.maxCats < 1 || this.state.rate < 0.01 || this.state.supplement < 0) {
    //       this.setState({
    //         loading: false,
    //         errors: ['HostProfileForm:create-error-1'],
    //       });
    //     } else {
    //       const path = '/api/v1/host_profiles';
    //       const payload = {
    //         description: this.state.description,
    //         full_address: this.state.address,
    //         price_per_day_1_cat: this.state.rate,
    //         supplement_price_per_cat_per_day: this.state.supplement,
    //         max_cats_accepted: this.state.maxCats,
    //         availability: this.state.availability,
    //         lat: this.state.lat,
    //         long: this.state.long,
    //         latitude: this.state.latitude,
    //         longitude: this.state.longitude,
    //         user_id: this.props.user_id,
    //         locale: lang,
    //       };
    //       const headers = {
    //         uid: window.localStorage.getItem('uid'),
    //         client: window.localStorage.getItem('client'),
    //         'access-token': window.localStorage.getItem('access-token'),
    //       };
    //       axios
    //         .post(path, payload, { headers: headers })
    //         .then(() => {
    //           this.setState({ errors: '' });
    //           window.alert(t('HostProfileForm:create-success'));
    //           setTimeout(function () {
    //             window.location.replace('/user-page');
    //           }, 500);
    //         })
    //         .catch((error) => {
    //           if (error.response === undefined) {
    //             wipeCredentials('/is-not-available?atm');
    //           } else if (error.response.status === 500) {
    //             this.setState({
    //               loading: false,
    //               errors: ['reusable:errors:500'],
    //             });
    //           } else if (error.response.status === 401) {
    //             window.alert(t('reusable:errors:401'));
    //             wipeCredentials('/');
    //           } else {
    //             this.setState({
    //               loading: false,
    //               errors: error.response.data.error,
    //             });
    //           }
    //         });
    //     }
    //   }
  };

  if (!ready) return <Spinner />;

  return (
    <>
      <Header centered level={3} color='primary' space={2}>
        {t('HostProfileForm:create-profile')}
      </Header>
      <Text centered>{t('HostProfileForm:create-profile-main-title')}</Text>
      <TextArea
        label={t('HostProfileForm:about-you-label')}
        value={newHost.description}
        onChange={(e) => setNewHost((prev) => ({ ...prev, description: e.target.value }))}
        required
      />

      {/* Address error
      Address search */}

      <TextField
        type='number'
        label={t('HostProfileForm:rate-label')}
        id='rate'
        value={newHost.rate}
        onChange={(e) => setNewHost((prev) => ({ ...prev, rate: e.target.value }))}
        required
        onKeyPress={(e) => e.key === 'Enter' && createHostProfile(e)}
      />

      <TextField
        type='number'
        label={t('HostProfileForm:max-cats-label')}
        id='maxCats'
        value={newHost.maxCats}
        onChange={(e) => setNewHost((prev) => ({ ...prev, maxCats: e.target.value }))}
        required
        onKeyPress={(e) => e.key === 'Enter' && createHostProfile(e)}
      />
      <TextField
        type='number'
        label={t('HostProfileForm:supplement-label')}
        id='supplement'
        value={newHost.supplement}
        onChange={(e) => setNewHost((prev) => ({ ...prev, supplemnent: e.target.value }))}
        required
        onKeyPress={(e) => e.key === 'Enter' && createHostProfile(e)}
      />

      <Text>{t('HostProfileForm:availability-title')}</Text>
      <DayPicker
        showWeekNumbers
        fromMonth={today}
        disabledDays={{ before: today }}
        firstDayOfWeek={1}
        selectedDays={selectedDays}
        onDayClick={() => handleDayClick()}
        localeUtils={MomentLocaleUtils}
        locale={lang}
      />

      <Flexbox spaceItemsX={2}>
        <Button secondary color='neutral' onClick={() => closeForm()}>
          Cancel
        </Button>
        <Button id='save-host-profile-button' disabled={loading} loading={loading} onClick={() => createHostProfile()}>
          {t('reusable:cta:save')}
        </Button>
      </Flexbox>
    </>
  );

  //   let addressSearch, addressErrorMessage, onCreateErrorMessage;

  //   if (this.state.addressSearch === true) {
  //     addressSearch = (
  //       <div style={{ display: 'flex', alignItems: 'flex-end' }}>
  //         <Form.Input
  //           style={{ paddingRight: '1rem' }}
  //           label={t('HostProfileForm:address-label')}
  //           placeholder={t('HostProfileForm:address-search-plch')}
  //           required
  //           id='userInputAddress'
  //           value={this.state.userInputAddress}
  //           onChange={this.onChangeHandler}
  //           onBlur={this.state.userInputAddress !== '' ? this.geolocationDataAddress : undefined}
  //         />
  //         <div>
  //           <Button style={{ margin: '0 0 1em' }} id='search' onClick={this.geolocationDataAddress}>
  //             {t('reusable:cta:confirm')}
  //           </Button>
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     addressSearch = (
  //       <div className='required field'>
  //         <label for='userInputAddress'>{t('HostProfileForm:address-label')}</label>
  //         <p>
  //           {this.state.address}&nbsp;
  //           <Header
  //             as='strong'
  //             id='change-address-link'
  //             onClick={() => {
  //               this.setState({ addressSearch: true, address: '', lat: '', long: '', latitude: '', longitude: '' });
  //             }}
  //             className='fake-link-underlined'
  //           >
  //             {t('HostProfileForm:not-right')}
  //           </Header>
  //         </p>
  //       </div>
  //     );
  //   }

  //   if (this.state.addressErrorDisplay) {
  //     addressErrorMessage = <Message negative>{this.state.addressError}</Message>;
  //   }

  //   if (this.state.errors !== '') {
  //     onCreateErrorMessage = (
  //       <Message negative>
  //         <Message.Header>{t('HostProfileForm:create-error-2')}</Message.Header>
  //         <ul>
  //           {this.state.errors.map((error) => (
  //             <li key={error}>{t(error)}</li>
  //           ))}
  //         </ul>
  //       </Message>
  //     );
  //   }

  //   return (

  //

  //

  //         {addressErrorMessage}
  //         {addressSearch}
  //         <p className='small-left-paragraph'>{t('HostProfileForm:address-message')}</p>
  //         <Form.Group widths='equal'>

  //       {onCreateErrorMessage}

  //

  //
};

export default HostProfileForm;
