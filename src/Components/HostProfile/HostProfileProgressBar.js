import React, { useState, useEffect } from 'react';

import { useTranslation, Trans } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';

import Spinner from '../../common/Spinner';

import { Button, Container, InlineLink, Notice, Text } from '../../UI-Components';
import {
  Explained,
  InnerLine,
  ProggressBarLine,
  ProgressBarStep,
  ProgressBarSteps,
  ProgressBarWrapper,
  ProgressStepWrapper,
  StepExplanation,
  StepIcon,
  CtaWrapper,
} from './styles';
import { HostProfile, CreditCard, Verified } from '../../icons';

const HostProfileProgressBar = ({ email, stripeAccountId, stripeState, hostProfileId }) => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stripeLink, setStripeLink] = useState('');
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
        const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${hostProfileId}&occasion=retrieve`;
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
          setErrors(['reusable:errors.unknown']);
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
      setStripeDashboardButtonLoading(true);
      try {
        const lang = detectLanguage();
        const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${hostProfileId}&occasion=login_link`;
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        const response = await axios.get(path, { headers: headers });
        setStripeLink(response.data.url);
      } catch (error) {
        if (error.response === undefined) {
          setErrors('reusable:errors.unknown');
        } else if (error.response.status === 555) {
          setErrors([error.response.data.error]);
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors.401'));
          wipeCredentials('/');
        } else {
          setErrors([error.response.data.error]);
        }
      } finally {
        setStripeDashboardButtonLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStripeAccountDetails();
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    payoutSuccess && fetchStripeDashboardLink();
  }, [payoutSuccess]);

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
  if (loading || !ready) return <Spinner />;

  return (
    <Container space={8} data-cy='host-profile-progress-bar'>
      <ProgressBarWrapper space={5}>
        <Explained>
          <StepIcon active={activeStep >= 1}>
            <HostProfile height={6} />
          </StepIcon>
          <StepIcon active={activeStep >= 2}>
            <CreditCard height={6} />
          </StepIcon>
          <StepIcon active={activeStep >= 3}>
            <Verified height={6} />
          </StepIcon>
        </Explained>
        <ProgressStepWrapper>
          <ProgressBarSteps>
            <ProgressBarStep active={activeStep >= 1} data-cy-active={activeStep >= 1} data-cy='step-1'>
              1
            </ProgressBarStep>
            <ProgressBarStep active={activeStep >= 2} data-cy-active={activeStep >= 2} data-cy='step-2'>
              2
            </ProgressBarStep>
            <ProgressBarStep active={activeStep >= 3} data-cy-active={activeStep >= 3} data-cy='step-3'>
              3
            </ProgressBarStep>
          </ProgressBarSteps>
          <ProggressBarLine>
            <InnerLine width={activeStep === 1 ? '25%' : activeStep === 2 ? '75%' : '100%'} />
          </ProggressBarLine>
        </ProgressStepWrapper>
        <Explained>
          <StepExplanation
            size='xs'
            centered
            dangerouslySetInnerHTML={{ __html: t('HostProfileProgressBar:step-1') }}
          />
          <StepExplanation
            size='xs'
            centered
            dangerouslySetInnerHTML={{ __html: t('HostProfileProgressBar:step-2') }}
          />
          <StepExplanation
            size='xs'
            centered
            dangerouslySetInnerHTML={{ __html: t('HostProfileProgressBar:step-3') }}
          />
        </Explained>
      </ProgressBarWrapper>
      {stripeAccountId === null ? (
        <CtaWrapper>
          <Text centered space={5}>
            <Trans i18nKey={'reusable:stripe:step-1-text'}>
              text
              <InlineLink as={Link} to='/faq?active=503' color='info'>
                link
              </InlineLink>
            </Trans>
          </Text>

          <Button
            as='a'
            data-cy='progress-bar-cta'
            href={`https://connect.stripe.com/express/oauth/authorize?client_id=${
              process.env.REACT_APP_OFFICIAL === 'yes'
                ? process.env.REACT_APP_STRIPE_CLIENT_ID
                : process.env.REACT_APP_STRIPE_CLIENT_ID_TEST
            }&response_type=code&state=${stripeState}&suggested_capabilities[]=transfers&redirect_uri=${redirectStripe}&stripe_user[email]=${email}&stripe_user[country]=SE`}
          >
            {t('HostProfileProgressBar:stripe-onboarding-cta')}
          </Button>
        </CtaWrapper>
      ) : payoutSuccess ? (
        <>
          <Button
            as='a'
            color='info'
            href={stripeLink}
            target='_blank'
            disabled={stripeDashboardButtonLoading}
            data-cy='progress-bar-cta'
          >
            {t('reusable:stripe:stripe-dashboard-cta')}
          </Button>
        </>
      ) : (
        stripeAccountErrors.length > 0 && (
          <CtaWrapper>
            <Text centered space={5}>
              {t('reusable:stripe:step-2-text')}&ensp;
              {stripePendingVerification
                ? t('reusable:stripe:step-2-pending')
                : t('reusable:stripe:step-2-go-to-dashboard')}
            </Text>
            <Button
              as='a'
              color={stripePendingVerification ? 'info' : 'primary'}
              href={stripeLink}
              target='_blank'
              disabled={stripeDashboardButtonLoading}
              data-cy='progress-bar-cta'
            >
              {t('reusable:stripe:stripe-dashboard-cta')}
            </Button>
          </CtaWrapper>
        )
      )}
      {errors.length > 0 && (
        <Notice nature='danger'>
          <Text centered bold>
            {t('reusable:errors:action-error-header')}
          </Text>
          <ul id='message-error-list'>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      )}
    </Container>
  );
};

export default HostProfileProgressBar;
