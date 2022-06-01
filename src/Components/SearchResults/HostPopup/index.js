import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import moment from 'moment';
import { useTranslation, Trans } from 'react-i18next';
import Popup from 'reactjs-popup';

import { finalTotal } from '../../../Modules/PriceCalculations';
import { useFetchHost } from './useFetchHost';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { useDeviceInfo } from '../../../hooks/useDeviceInfo';

import ReviewScore from '../../../common/ReviewScore';
import Responsive from '../../../common/Responsive';
import Spinner from '../../../common/Spinner';

import { Badge } from '../styles';
import { Avatar, Flexbox, Text, Header, Container, InlineLink, Button } from '../../../UI-Components';
import { Location, User, Review, AvailableHost } from '../../../icons';

const HostPopup = ({ id, open, onClose, currentSearch, host, loggedInUserId, toHostProfile, requestToBook }) => {
  const { t, ready } = useTranslation('HostPopup');
  const { loading } = useFetchHost(id);
  const history = useHistory();
  const device = useDeviceInfo().type;

  const lang = detectLanguage();
  moment.locale(lang);

  const [isAvailable, setIsAvailable] = useState(false);

  const orderTotal = finalTotal(host.rate, currentSearch.cats, host.supplement, currentSearch.start, currentSearch.end);

  useEffect(() => {
    if (currentSearch?.dates?.every((date) => host?.availability?.includes(date))) {
      setIsAvailable(true);
    }
  }, [currentSearch, host]);

  if (loading || !ready) {
    return (
      <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
        <Spinner />
      </Popup>
    );
  }

  return (
    <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
      <>
        {(isAvailable || host?.reviewsCount) && (
          <Badge nature={isAvailable ? 'availability' : 'reviews'}>
            {isAvailable ? <AvailableHost fill={'white'} height={6} /> : <Review fill={'white'} height={6} />}
          </Badge>
        )}
        <Avatar
          size={device === 'mobile' ? 'md' : 'xl'}
          centered
          space={4}
          src={
            host.avatar ??
            `https://ui-avatars.com/api/?name=${host.name}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
          }
        />
        {host.score && (
          <Container>
            <ReviewScore score={host.score} center={true} height={6} margin={0} primaryColor='neutral' />
          </Container>
        )}

        <Flexbox spaceItemsX={1} space={2}>
          <User />
          <Header level={4}>{host.name}</Header>
        </Flexbox>
        <Flexbox spaceItemsX={2} space={2} wrap>
          <Flexbox spaceItemsX={1}>
            <Location />
            <Text>{host.location}</Text>
          </Flexbox>
          {host.reviewsCount && (
            <Flexbox spaceItemsX={1}>
              <Review />
              <Text>{t('reusable:reviews', { count: parseInt(host.reviewsCount) })}</Text>
            </Flexbox>
          )}
          {isAvailable && (
            <Flexbox spaceItemsX={1}>
              <AvailableHost />
              <Text>{t('reusable:available')}</Text>
            </Flexbox>
          )}
        </Flexbox>

        {loggedInUserId !== host.userId && (
          <Flexbox space={4}>
            <InlineLink color={'primary'} onClick={() => toHostProfile()}>
              {t('HostPopup:more')}
            </InlineLink>
          </Flexbox>
        )}
        <Responsive displayIn={['tablet', 'laptop', 'desktop']}>
          <Text centered space={4}>
            <Trans i18nKey='reusable:request-cta.txt' count={parseInt(currentSearch.cats)}>
              The stay for <strong>{{ count: currentSearch.cats }} cat</strong> with
              <strong>{{ host: host.name }}</strong> during the dates of
              <strong>{{ checkin: moment(currentSearch.checkInDate).format('MMMM Do') }}</strong>
              until
              <strong>{{ checkout: moment(currentSearch.checkOutDate).format('MMMM Do') }}</strong>
              would in total cost
            </Trans>
          </Text>
        </Responsive>

        <Responsive displayIn={['mobile']}>
          <Text bold centered space={0}>
            {t('HostPopup:total')}
          </Text>
        </Responsive>

        <Header level={4} centered space={4}>
          {orderTotal} kr
        </Header>

        {!isAvailable && (
          <>
            {/* idea: push to messenger with a default message? */}
            <Button id='message-host' onClick={() => console.log('TODO: to the messenger i go')} space={2}>
              {t('reusable:cta.send-message')}
            </Button>

            <Text centered bold space={2}>
              {t('reusable:or')}
            </Text>
          </>
        )}

        <Button
          secondary={!isAvailable}
          space={6}
          id='request-to-book'
          onClick={() => requestToBook()}
          color={isAvailable ? 'primary' : 'neutral'}
        >
          {isAvailable ? t('reusable:cta.book') : t('reusable:request-cta.btn')}
        </Button>

        {loggedInUserId !== host.userId && !isAvailable && (
          <Responsive displayIn={['tablet', 'laptop', 'desktop']}>
            <Text size='sm'>{t('HostPopup:host-availability-disclaimer')}</Text>
          </Responsive>
        )}
      </>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  loggedInUserId: state.reduxTokenAuth.currentUser.attributes.id,
  currentSearch: state.currentSearch,
  host: state.currentHostProfile,
});

export default connect(mapStateToProps)(HostPopup);
