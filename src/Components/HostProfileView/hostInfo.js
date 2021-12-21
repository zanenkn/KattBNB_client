import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import ReviewScore from '../../common/ReviewScore';
import HostLocationMap from '../../common/HostLocationMap';

import { finalTotal, roundUp } from '../../Modules/PriceCalculations';

import Spinner from '../../common/Spinner';
import { Avatar, Button, Flexbox, Text, Header, InlineLink } from '../../UI-Components';
import { ReversibleWrapper } from './styles';
import { AvailableHost, CreditCard, Location, Review, User } from '../../icons';


import AllReviews from '../Reviews/AllReviews';
const HostInfo = ({ currentSearch, host, id }) => {
  const orderTotal = finalTotal(host.rate, currentSearch.cats, host.supplement, currentSearch.start, currentSearch.end);

  // let locationAndPrice, sendMessage, requestToBook;

  //         numberOfCats={0}

  //         hostId={props.location.state.userId}
  //         avatar={props.location.state.avatar}
  //         nickname={props.location.state.nickname}

  //         location={props.location.state.location}
  //         rate={parseFloat(hostProfile.price_per_day_1_cat)}
  //         supplement={parseFloat(hostProfile.supplement_price_per_cat_per_day)}
  //         description={hostProfile.description}
  //         lat={lat}
  //         long={long}
  //         noMessage={props.location.state.noMessage}
  //         score={hostProfile.score}
  //         hostProfileId={hostProfile.id}

  const { t, ready } = useTranslation('HostInfo');

  const [isAvailable, setIsAvailable] = useState(false);

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
          !host.avatar
            ? `https://ui-avatars.com/api/?name=${host.name}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
            : host.avatar
        }
      />
      {host.reviewsCount && <ReviewScore center score={host.score} primaryColor={'neutral'} />}
      <Flexbox spaceItemsX={1} space={2}>
        <User />
        <Header level={4}>{host.name}</Header>
      </Flexbox>
      <Flexbox space={5}>
        <Flexbox wrap spaceItemsX={2} maxWidth={'300px'}>
          <Flexbox spaceItemsX={1} space={1}>
            <Location />
            <Text>{host.location}</Text>
          </Flexbox>
          <Flexbox spaceItemsX={1} space={1}>
            <CreditCard />
            <Text>from {roundUp(host.rate)} kr per day</Text>
          </Flexbox>
          {host.score && (
            <Flexbox spaceItemsX={1} space={1}>
              <Review />
              <Text>{t('reusable:reviews', { count: parseInt(host.reviewsCount) })}</Text>
            </Flexbox>
          )}
          {isAvailable && (
            <Flexbox spaceItemsX={1} space={1}>
              <AvailableHost />
              <Text>Available for your chosen dates</Text>
            </Flexbox>
          )}
        </Flexbox>
      </Flexbox>
      <Text space={5}>{host.description}</Text>

      <ReversibleWrapper revert={isAvailable}>
        <Button secondary={isAvailable} color={isAvailable ? 'neutral' : 'primary'} space={2}>
          Send a message
        </Button>
        {currentSearch && (
          <>
            <Text bold space={2}>
              or
            </Text>
            <Button secondary={!isAvailable} color={!isAvailable ? 'neutral' : 'primary'} space={2}>
              Request to book - {orderTotal} kr
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

      <Header level={4}>{t('HostInfo:reviews-title')}</Header>
      <AllReviews />
      <HostLocationMap lat={host.lat} long={host.long} nickname={host.name} address={host.address} />
    </>
  );
};

export default HostInfo;
