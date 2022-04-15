import { useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';

import withAuth from '../../HOC/withAuth';
import HostProfile from '../HostProfile';
import Spinner from '../../common/Spinner';

import { Header, Notice, Text, Button, Container, Whitebox, InlineLink, ContentWrapper } from '../../UI-Components';
import { User, Location, Email, Lock, Notification, Globe } from '../../icons';
import { FlexWrapper, UpdateFormWrapper, SettingsWrapper, MaxWidth } from './styles';

import LocationUpdateForm from './locationUpdateForm';
import PasswordUpdateForm from './passwordUpdateForm';
import AvatarUpdateForm from './avatarUpdateForm';
import NotificationsUpdateForm from './notificationsUpdateForm';
import LangPrefUpdateForm from './langPrefUpdateForm';
import HostProfileProgressBar from '../HostProfile/HostProfileProgressBar';
import AllReviews from '../Reviews/allReviews';

//MIGRATION IN PROGRESS
const UserPage = (props) => {
  const hostProfileElement = useRef();
  const { t, ready } = useTranslation('UserPage');
  const history = useHistory();

  const [form, setForm] = useState({
    editLocationForm: false,
    editPasswordForm: false,
    editNotificationsForm: false,
    editLangPrefForm: false,
  });
  const [hostProfile, setHostProfile] = useState([]);
  const [element, setElement] = useState({
    description: '',
    fullAddress: '',
    rate: '',
    maxCats: '',
    supplement: '',
    availability: [],
    location: props.location,
    messageNotifications: props.messageNotifications,
    langPref: props.langPref,
    stripeAccountId: null,
  });
  const [hostProfileScore, setHostProfileScore] = useState(null);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHostProfile, setLoadingHostProfile] = useState(true);
  const [errors, setErrors] = useState([]);
  const [deleteDisplayNone, setDeleteDisplayNone] = useState(false);
  const [hostStripeState, setHostStripeState] = useState(null);

  useEffect(() => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (hostProfile.length === 1) {
        const lang = detectLanguage();
        const path = `/api/v1/host_profiles/${hostProfile[0].id}?locale=${lang}`;
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        axios
          .get(path, { headers: headers })
          .then(
            ({
              data: {
                availability,
                description,
                full_address,
                max_cats_accepted,
                price_per_day_1_cat,
                score,
                stripe_account_id,
                stripe_state,
                supplement_price_per_cat_per_day,
              },
            }) => {
              let rateToNumber = parseFloat(price_per_day_1_cat);
              let rateToString = rateToNumber.toFixed(2);
              let finalRate;
              if (rateToString[rateToString.length - 1] === '0' && rateToString[rateToString.length - 2] === '0') {
                finalRate = parseFloat(rateToString);
              } else {
                finalRate = rateToString;
              }
              let supplementToNumber = parseFloat(supplement_price_per_cat_per_day);
              let supplementToString = supplementToNumber.toFixed(2);
              let finalSupplement;
              if (
                supplementToString[supplementToString.length - 1] === '0' &&
                supplementToString[supplementToString.length - 2] === '0'
              ) {
                finalSupplement = parseFloat(supplementToString);
              } else {
                finalSupplement = supplementToString;
              }
              setElement({
                description: description,
                fullAddress: full_address,
                rate: finalRate,
                maxCats: max_cats_accepted,
                supplement: finalSupplement,
                availability: availability,
                location: props.location,
                messageNotifications: props.messageNotifications,
                langPref: props.langPref,
                stripeAccountId: stripe_account_id,
              });
              setHostStripeState(stripe_state);
              setHostProfileScore(score);
              setLoadingHostProfile(false);
              setErrors([]);
            }
          )
          .catch(({ response }) => {
            if (response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (response.status === 500) {
              setErrors(['reusable:errors:500']);
            } else if (response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else {
              setErrors(response.data.error);
            }
          });
      }
    }
  }, [hostProfile, props.messageNotifications, props.location, props.langPref, t]);

  useEffect(() => {
    fetchIncomingBookings();
    async function asyncDidMount() {
      if (window.navigator.onLine === false) {
        setErrors(['reusable:errors:window-navigator']);
      } else {
        try {
          const lang = detectLanguage();
          const response = await axios.get(`/api/v1/host_profiles?user_id=${props.id}&locale=${lang}`);
          setHostProfile(response.data);
          setLoading(false);
          setErrors([]);
        } catch ({ response }) {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 500) {
            setErrors(['reusable:errors:500']);
          } else {
            setErrors(response.data.error);
          }
        }
      }
    }
    asyncDidMount();
    // eslint-disable-next-line
  }, []);

  const fetchIncomingBookings = async () => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      try {
        const lang = detectLanguage();
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        const pathIncoming = `/api/v1/bookings?dates=only&stats=no&host_nickname=${props.username}&locale=${lang}`;
        const responseIncoming = await axios.get(pathIncoming, { headers: headers });
        setIncomingBookings(responseIncoming.data);
        setErrors([]);
      } catch ({ response }) {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 500) {
          setErrors(['reusable:errors:500']);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors(response.data.error);
        }
      }
    }
  };

  const avatarFormHandler = () => {
    setForm((old) => ({
      ...old,
      editLocationForm: false,
      editPasswordForm: false,
      editNotificationsForm: false,
      editLangPrefForm: false,
    }));
    if (hostProfile.length === 1) {
      hostProfileElement.current.closeAllForms();
    }
  };

  const closeLocationAndPasswordForms = () => {
    setForm((old) => ({
      ...old,
      editLocationForm: false,
      editPasswordForm: false,
      editNotificationsForm: false,
      editLangPrefForm: false,
    }));
  };

  const formHandler = (e) => {
    let states = ['editLocationForm', 'editPasswordForm', 'editNotificationsForm', 'editLangPrefForm'];
    states.forEach((stt) => {
      if (stt === e.target.id) {
        setForm((old) => ({
          ...old,
          editLocationForm: false,
          editPasswordForm: false,
          editNotificationsForm: false,
          editLangPrefForm: false,
          [stt]: !form[stt],
        }));
      }
    });
    if (hostProfile.length === 1) {
      hostProfileElement.current.closeAllForms();
    }
  };

  const elementUpdateHandler = (elementName, newState) => {
    let elements = Object.keys(element);
    elements.forEach((element) => {
      if (element === elementName) {
        setElement((old) => ({ ...old, [elementName]: newState }));
      }
    });
  };

  const destroyAccount = async () => {
    avatarFormHandler();
    setDeleteDisplayNone(true);
    if (window.navigator.onLine === false) {
      setDeleteDisplayNone(false);
      setErrors(['reusable:errors:window-navigator']);
    } else {
      const lang = detectLanguage();
      const bookings = `/api/v1/bookings?stats=yes&user_id=${props.id}&host_nickname=${props.username}&locale=${lang}`;
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      try {
        const {
          data: {
            stats: { out_requests, out_upcoming, out_unpaid, in_requests, in_upcoming, in_unpaid },
          },
        } = await axios.get(bookings, { headers: headers });
        if (
          parseInt(in_requests) !== 0 ||
          parseInt(in_upcoming) !== 0 ||
          parseInt(out_requests) !== 0 ||
          parseInt(out_upcoming) !== 0 ||
          parseInt(out_unpaid) !== 0 ||
          parseInt(in_unpaid) !== 0
        ) {
          window.alert(t('UserPage:delete-alert'));
          setDeleteDisplayNone(false);
        } else {
          if (hostProfile.length === 0 && window.confirm(t('UserPage:delete-confirm'))) {
            const path = '/api/v1/auth';
            axios
              .delete(path, { headers: headers })
              .then(() => {
                window.alert(t('UserPage:deletion-alert'));
                wipeCredentials('/');
              })
              .catch(({ response }) => {
                if (response === undefined) {
                  wipeCredentials('/is-not-available?atm');
                } else {
                  window.alert(t('UserPage:deletion-error'));
                  wipeCredentials('/');
                }
              });
          } else if (hostProfile.length === 1 && window.confirm(t('UserPage:delete-confirm'))) {
            const pathStripe = `/api/v1/stripe?locale=${lang}&host_profile_id=${hostProfile[0].id}&occasion=delete_account`;
            axios
              .get(pathStripe, { headers: headers })
              .then(() => {
                const path = '/api/v1/auth';
                axios
                  .delete(path, { headers: headers })
                  .then(() => {
                    window.alert(t('UserPage:deletion-alert'));
                    wipeCredentials('/');
                  })
                  .catch(({ response }) => {
                    if (response === undefined) {
                      wipeCredentials('/is-not-available?atm');
                    } else {
                      window.alert(t('UserPage:deletion-error'));
                      wipeCredentials('/');
                    }
                  });
              })
              .catch(({ response }) => {
                if (response === undefined) {
                  wipeCredentials('/is-not-available?atm');
                } else if (response.status === 555) {
                  setDeleteDisplayNone(false);
                  setErrors([t('UserPage:delete-stripe-account-error')]);
                } else if (response.status === 401) {
                  window.alert(t('reusable:errors:401'));
                  wipeCredentials('/');
                } else {
                  setDeleteDisplayNone(false);
                  setErrors([response.data.error]);
                }
              });
          } else {
            setDeleteDisplayNone(false);
          }
        }
      } catch ({ response }) {
        if (response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (response.status === 500) {
          setDeleteDisplayNone(false);
          setErrors(['reusable:errors:500']);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setDeleteDisplayNone(false);
          setErrors(response.data.error);
        }
      }
    }
  };

  if (!ready) return <Spinner />;

  if (ready && loading) {
    return (
      <div className='content-wrapper'>
        <Popup
          modal
          open={errors.length > 0}
          closeOnDocumentClick={true}
          onClose={() => setErrors([])}
          position='top center'
        >
          <Notice nature='danger' space={0}>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Notice>
        </Popup>
      </div>
    );
  }

  return (
    <ContentWrapper data-cy='user-page'>
      <Popup
        modal
        open={errors.length > 0}
        closeOnDocumentClick={true}
        onClose={() => setErrors([])}
        position='top center'
      >
        <Notice nature='danger' space={0}>
          <ul id='message-error-list'>
            {errors.map((error) => (
              <li key={error}>{t(error)}</li>
            ))}
          </ul>
        </Notice>
      </Popup>
      <Container space={8}>
        <AvatarUpdateForm
          avatar={props.avatar}
          username={props.username}
          userId={props.id}
          closeAllForms={avatarFormHandler.bind(this)}
        />
        <Header data-cy='username' level={4} space={2} centered>
          <User height={4} />
          &ensp;{props.username}
        </Header>
        <FlexWrapper centered spaceBetween={1}>
          <Location height={4} />
          <Text data-cy='location'>{element.location}</Text>
        </FlexWrapper>
      </Container>

      {hostProfile.length === 1 && loadingHostProfile === false && (
        <>
          <HostProfileProgressBar
            stripeAccountId={element.stripeAccountId}
            hostProfileId={hostProfile[0].id}
            stripeState={hostStripeState}
            email={props.email}
          />
          <HostProfile
            id={hostProfile[0].id}
            email={props.email}
            description={element.description}
            fullAddress={element.fullAddress}
            rate={element.rate}
            maxCats={element.maxCats}
            supplement={element.supplement}
            availability={element.availability}
            score={hostProfileScore}
            location={props.location}
            incomingBookings={incomingBookings}
            stripeState={hostStripeState}
            stripeAccountId={element.stripeAccountId}
            closeLocPasForms={closeLocationAndPasswordForms}
            ref={hostProfileElement}
            setElement={elementUpdateHandler.bind(this)}
          />
        </>
      )}
      {hostProfile.length === 1 && loadingHostProfile === true && <Spinner />}

      {!hostProfile.length && (
        <MaxWidth>
          <Text centered>{t('UserPage:no-host-profile')}</Text>
          <Button data-cy='create-host-profile-cta' onClick={() => history.push('/create-host-profile')}>
            {t('UserPage:host-profile-cta')}
          </Button>
        </MaxWidth>
      )}
      <Whitebox data-cy='settings-section'>
        <Header level={4} space={5} centered>
          {t('UserPage:settings-header')}
        </Header>
        <SettingsWrapper>
          <FlexWrapper spaceBetween={2}>
            <Email height={4} />
            <Text>{props.email}</Text>
          </FlexWrapper>

          <FlexWrapper spaceBetween={2} id='user-location'>
            <Location />
            <Text>{element.location}</Text>
            <InlineLink id='editLocationForm' onClick={(e) => formHandler(e)} text={'sm'} color='info'>
              {t('reusable:cta.change')}
            </InlineLink>
          </FlexWrapper>
          <UpdateFormWrapper open={form.editLocationForm}>
            {form.editLocationForm && (
              <LocationUpdateForm
                location={element.location}
                fullAddress={element.fullAddress}
                closeLocationAndPasswordForms={closeLocationAndPasswordForms}
              />
            )}
          </UpdateFormWrapper>

          <FlexWrapper spaceBetween={2}>
            <Lock />
            <Text>******</Text>
            <InlineLink id='editPasswordForm' onClick={(e) => formHandler(e)} text={'sm'} color='info'>
              {t('reusable:cta.change')}
            </InlineLink>
          </FlexWrapper>
          <UpdateFormWrapper open={form.editPasswordForm}>
            {form.editPasswordForm && (
              <PasswordUpdateForm closeLocationAndPasswordForms={closeLocationAndPasswordForms} />
            )}
          </UpdateFormWrapper>

          <FlexWrapper spaceBetween={2}>
            <Notification />
            <Text>{t('UserPage:notifications-header')}</Text>
            <InlineLink id='editNotificationsForm' onClick={(e) => formHandler(e)} text={'sm'} color='info'>
              {t('reusable:cta.change')}
            </InlineLink>
          </FlexWrapper>
          <UpdateFormWrapper open={form.editNotificationsForm}>
            {form.editNotificationsForm && (
              <NotificationsUpdateForm
                closeLocationAndPasswordForms={closeLocationAndPasswordForms}
                messageNotifications={element.messageNotifications}
              />
            )}
          </UpdateFormWrapper>

          <FlexWrapper spaceBetween={2}>
            <Globe />
            <Text>{t('UserPage:lang-pref-header')}</Text>
            <InlineLink id='editLangPrefForm' onClick={(e) => formHandler(e)} text={'sm'} color='info'>
              {t('reusable:cta.change')}
            </InlineLink>
          </FlexWrapper>
          <UpdateFormWrapper open={form.editLangPrefForm}>
            {form.editLangPrefForm && (
              <LangPrefUpdateForm
                closeLocationAndPasswordForms={closeLocationAndPasswordForms}
                langPref={element.langPref}
              />
            )}
          </UpdateFormWrapper>
        </SettingsWrapper>
      </Whitebox>
      {hostProfile.length === 1 && (
        <Whitebox data-cy='reviews'>
          <Header level={4} space={5} centered>
            {t('UserPage:reviews-header')}
          </Header>
          <AllReviews hostProfileId={hostProfile[0].id} score={hostProfileScore} />
        </Whitebox>
      )}
      {!deleteDisplayNone && (
        <Text centered style={{ opacity: '0.3' }} size='sm'>
          <InlineLink id='delete-account-link' onClick={() => destroyAccount()} color='neutral' discreet>
            {t('UserPage:delete-cta')}
          </InlineLink>
        </Text>
      )}
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  location: state.reduxTokenAuth.currentUser.attributes.location,
  email: state.reduxTokenAuth.currentUser.attributes.uid,
  id: state.reduxTokenAuth.currentUser.attributes.id,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar,
  messageNotifications: state.reduxTokenAuth.currentUser.attributes.messageNotifications,
  langPref: state.reduxTokenAuth.currentUser.attributes.langPref,
});

export default connect(mapStateToProps)(withAuth(UserPage));
