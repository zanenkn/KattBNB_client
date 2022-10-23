import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import { finalTotal, roundUp } from '../../Modules/PriceCalculations';

import ReviewScore from '../../common/ReviewScore';
import HostLocationMap from '../../common/HostLocationMap';
import Spinner from '../../common/Spinner';

import { Avatar, Button, Flexbox, Text, Header, InlineLink, Container, Whitebox } from '../../UI-Components';
import { ReversibleWrapper } from './styles';
import { AvailableHost, CreditCard, Location, Review, User } from '../../icons';

import AllReviews from '../Reviews/allReviews';
import BookingInfo from '../../common/BookingInfo';

const HostInfo = ({ currentSearch, host, toRequest, messageHost }) => {
  const { t, ready } = useTranslation('HostInfo');

  const [isAvailable, setIsAvailable] = useState(false);

  const orderTotal = currentSearch
    ? finalTotal(host.rate, currentSearch.cats, host.supplement, currentSearch.start, currentSearch.end)
    : null;

  useEffect(() => {
    if (currentSearch?.dates?.every((date) => host?.availability?.includes(date))) {
      setIsAvailable(true);
    }
  }, [currentSearch, host]);

  if (!ready) return <Spinner />;

  return (
    <>
      <Avatar
        centered
        space={4}
        src={
          host.avatar ??
          `https://ui-avatars.com/api/?name=${host.name}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
        }
      />
      {host.reviewsCount && <ReviewScore center score={host.score} primaryColor={'neutral'} />}
      <Flexbox spaceItemsX={1} space={2}>
        <User />
        <Header level={4}>{host.name}</Header>
      </Flexbox>
      <Flexbox space={5} maxWidth='300px' direction='column' center>
        <Flexbox spaceItemsX={2}>
          <Flexbox spaceItemsX={1} space={1}>
            <Location />
            <Text>{host.location}</Text>
          </Flexbox>
          <Flexbox spaceItemsX={1} space={1}>
            <CreditCard />
            <Text>{t('reusable:price.from-per-day', { rate: roundUp(host.rate) })}</Text>
          </Flexbox>
        </Flexbox>

        {host.reviewsCount && (
          <Flexbox spaceItemsX={1} space={1}>
            <Review />
            <Text>{t('reusable:reviews', { count: parseInt(host.reviewsCount) })}</Text>
          </Flexbox>
        )}
        {isAvailable && (
          <Flexbox spaceItemsX={1} space={1}>
            <AvailableHost />
            <Text>{t('reusable:available-for-dates')}</Text>
          </Flexbox>
        )}
      </Flexbox>
      <Container space={6}>
        <Text space={5}>{host.description}</Text>

        <ReversibleWrapper revert={isAvailable}>
          <Button
            secondary={isAvailable}
            color={isAvailable ? 'neutral' : 'primary'}
            space={2}
            onClick={() => messageHost()}
          >
            {t('reusable:cta.send-message')}
          </Button>
          {currentSearch && (
            <>
              <Text bold space={2}>
                or
              </Text>
              <Button
                secondary={!isAvailable}
                color={isAvailable ? 'primary' : 'neutral'}
                space={2}
                onClick={() => toRequest()}
              >
                {isAvailable ? `${t('reusable:cta.book')} - ${orderTotal} kr` : t('reusable:request-cta.btn')}
              </Button>
            </>
          )}
        </ReversibleWrapper>
        {currentSearch && !isAvailable && (
          <Text size='xs'>
            {/* TODO: fix a proper link to FAQ when its ready */}
            <Trans i18nKey='HostInfo:host-availability-disclaimer' values={{ amount: orderTotal }}>
              Text
              <InlineLink as={Link} to={'/faq'}>
                here
              </InlineLink>
              .
            </Trans>
          </Text>
        )}
      </Container>
      <Container space={6}>
        <Header level={4}>{t('HostInfo:reviews-title')}</Header>
        <AllReviews />
      </Container>
      <Container space={6}>
        <HostLocationMap lat={host.lat} long={host.long} nickname={host.name} address={host.address} />
      </Container>
      {isAvailable && currentSearch && (
        <Whitebox responsive={false}>
          <Header level={3} centered>
            {t('reusable:cta.book-host-now', { host: host.name })}
          </Header>
          <BookingInfo
            start={currentSearch.from}
            end={currentSearch.to}
            cats={currentSearch.cats}
            place={currentSearch.location}
            centered
            space={5}
          />
          <Button secondary={!isAvailable} space={2} onClick={() => toRequest()}>
            {t('reusable:cta.book')} - {orderTotal} kr
          </Button>
        </Whitebox>
      )}
    </>
  );
};

export default HostInfo;
