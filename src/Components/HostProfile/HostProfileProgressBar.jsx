import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import Spinner from '../ReusableComponents/Spinner';
import HostProfile from '../Icons/HostProfile';
import CreditCard from '../Icons/CreditCard';
import Verified from '../Icons/Verified';
import { Link } from 'react-router-dom';

const HostProfileProgressBar = (props) => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stripeDashboardButtonLoading, setStripeDashboardButtonLoading] = useState(false);
  const [stripeAccountErrors, setStripeAccountErrors] = useState([]);
  const [stripePendingVerification, setStripePendingVerification] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const { t, ready } = useTranslation('HostProfileProgressBar');

  const fetchStripeAccountDetails = async () => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
      setLoading(false);
    } else {
      try {
        const lang = detectLanguage();
        const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${props.hostProfileId}&occasion=retrieve`;
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        const response = await axios.get(path, { headers: headers });
        if (!response.data.message) {
          setPayoutSuccess(response.data.payouts_enabled);
          setStripeAccountErrors(response.data.requirements.errors);
          setStripePendingVerification(response.data.requirements.pending_verification.length > 0 ? true : false);
          if (response.data.payouts_enabled) {
            setActiveStep(3);
          } else if (
            response.data.requirements.errors.length > 0 ||
            response.data.requirements.pending_verification.length > 0
          ) {
            setActiveStep(2);
          }
        }
        setLoading(false);
      } catch (error) {
        if (error.response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (error.response.status === 555) {
          setErrors([error.response.data.error]);
          setLoading(false);
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors([error.response.data.error]);
          setLoading(false);
        }
      }
    }
  };

  const fetchStripeDashboardLink = async () => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      try {
        setStripeDashboardButtonLoading(true);
        const lang = detectLanguage();
        const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${props.hostProfileId}&occasion=login_link`;
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        const response = await axios.get(path, { headers: headers });
        window.open(response.data.url);
        setStripeDashboardButtonLoading(false);
      } catch (error) {
        if (error.response === undefined) {
          wipeCredentials('/is-not-available?atm');
        } else if (error.response.status === 555) {
          setErrors([error.response.data.error]);
          setStripeDashboardButtonLoading(false);
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors([error.response.data.error]);
          setStripeDashboardButtonLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchStripeAccountDetails();
    // eslint-disable-next-line
  }, []);

  let redirectStripe;

  if (process.env.REACT_APP_OFFICIAL === 'yes') {
    redirectStripe = 'https://kattbnb.se/user-page';
  } else {
    if (process.env.NODE_ENV === 'production') {
      redirectStripe = 'https://kattbnb.netlify.app/user-page';
    } else {
      redirectStripe = 'http://localhost:3000/user-page';
    }
  }

  return <div>a</div>
  // if (!loading && ready) {
  //   return (
  //     <div style={{ margin: '0 auto 5rem', maxWidth: '560px' }}>
  //       <div style={{ background: '#f5f5f5', padding: '1rem', width: 'max-content', margin: 'auto' }}>
  //         <div style={{ maxWidth: '300px', margin: 'auto' }}>
  //           <div className='explained' style={{ marginBottom: '1rem' }}>
  //             <HostProfile
  //               height={'2rem'}
  //               fill={'#e0e0e0'}
  //               class={`step-explanation ${activeStep >= 1 && 'step-done-fill'}`}
  //             />
  //             <CreditCard
  //               height={'2rem'}
  //               fill={'#e0e0e0'}
  //               class={`step-explanation ${activeStep >= 2 && 'step-done-fill'}`}
  //             />
  //             <Verified
  //               height={'2rem'}
  //               fill={'#e0e0e0'}
  //               class={`step-explanation ${activeStep >= 3 && 'step-done-fill'}`}
  //             />
  //           </div>
  //           <div className='progress-bar-wrapper'>
  //             <div className='progress-bar-steps'>
  //               <div className={`progress-bar-step ${activeStep >= 1 && 'step-done-color'}`}>1</div>
  //               <div className={`progress-bar-step ${activeStep >= 2 && 'step-done-color'}`}>2</div>
  //               <div className={`progress-bar-step ${activeStep >= 3 && 'step-done-color'}`}>3</div>
  //             </div>
  //             <div className='progress-bar-line'>
  //               <div
  //                 className='inner-line'
  //                 style={{ maxWidth: activeStep === 1 ? '25%' : activeStep === 2 ? '75%' : '100%' }}
  //               ></div>
  //             </div>
  //           </div>
  //           <div className='explained' style={{ marginTop: '1rem' }}>
  //             <div className='step-explanation'>
  //               <p
  //                 style={{ fontSize: '12px' }}
  //                 dangerouslySetInnerHTML={{ __html: t('HostProfileProgressBar:step-1') }}
  //               ></p>
  //             </div>
  //             <div className='step-explanation'>
  //               <p
  //                 style={{ fontSize: '12px' }}
  //                 dangerouslySetInnerHTML={{ __html: t('HostProfileProgressBar:step-2') }}
  //               ></p>
  //             </div>
  //             <div className='step-explanation'>
  //               <p
  //                 style={{ fontSize: '12px' }}
  //                 dangerouslySetInnerHTML={{ __html: t('HostProfileProgressBar:step-3') }}
  //               ></p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       {props.stripeAccountId === null ? (
  //         <>
  //           <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: 'unset' }}>
  //             <Trans i18nKey={'reusable:stripe:step-1-text'}>
  //               You made a host profile but have not provided us with your payment information. Without that we cannot
  //               transfer the money for your gigs!
  //               <Link to='/faq?section=payments&active=503' className='fake-link-underlined'>
  //                 Read more
  //               </Link>
  //               on how we handle payments and your information
  //             </Trans>
  //           </p>
  //           <a
  //             href={`https://connect.stripe.com/express/oauth/authorize?client_id=${
  //               process.env.REACT_APP_OFFICIAL === 'yes'
  //                 ? process.env.REACT_APP_STRIPE_CLIENT_ID
  //                 : process.env.REACT_APP_STRIPE_CLIENT_ID_TEST
  //             }&response_type=code&state=${
  //               props.stripeState
  //             }&suggested_capabilities[]=transfers&redirect_uri=${redirectStripe}&stripe_user[email]=${
  //               props.email
  //             }&stripe_user[country]=SE`}
  //           >
  //             <Button id='progress-bar-cta'>{t('HostProfileProgressBar:stripe-onboarding-cta')}</Button>
  //           </a>
  //         </>
  //       ) : payoutSuccess ? (
  //         <>
  //           <Button
  //             onClick={() => fetchStripeDashboardLink()}
  //             loading={stripeDashboardButtonLoading}
  //             disabled={stripeDashboardButtonLoading}
  //             id='progress-bar-cta'
  //           >
  //             {t('reusable:stripe:stripe-dashboard-cta')}
  //           </Button>
  //         </>
  //       ) : (
  //         stripeAccountErrors.length > 0 && (
  //           <>
  //             <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: 'unset' }}>
  //               {t('reusable:stripe:step-2-text')}&ensp;
  //               {stripePendingVerification
  //                 ? t('reusable:stripe:step-2-pending')
  //                 : t('reusable:stripe:step-2-go-to-dashboard')}
  //             </p>
  //             <Button
  //               onClick={() => fetchStripeDashboardLink()}
  //               loading={stripeDashboardButtonLoading}
  //               disabled={stripeDashboardButtonLoading}
  //               id='progress-bar-cta'
  //             >
  //               {t('reusable:stripe:stripe-dashboard-cta')}
  //             </Button>
  //           </>
  //         )
  //       )}
  //       {errors.length > 0 && (
  //         <Message negative>
  //           <Message.Header style={{ textAlign: 'center' }}>{t('reusable:errors:action-error-header')}</Message.Header>
  //           <ul id='message-error-list'>
  //             {errors.map((error) => (
  //               <li key={error}>{t(error)}</li>
  //             ))}
  //           </ul>
  //         </Message>
  //       )}
  //     </div>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

export default HostProfileProgressBar;
