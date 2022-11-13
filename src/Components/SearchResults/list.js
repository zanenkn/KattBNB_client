import React, { useLayoutEffect } from 'react';

import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { finalTotal } from '../../Modules/PriceCalculations';

import Spinner from '../../common/Spinner';
import ReviewScore from '../../common/ReviewScore';

import { Avatar, Container, Flexbox, Header, InlineLink, Text } from '../../UI-Components';
import { InnerResultWrapper, ListItem, Badge } from './styles';
import { AvailableHost, Review, User } from '../../icons';

const List = ({ currentSearch, finalAvailableHosts, handleListItemClick, onUnmount, switchToMap }) => {
  useLayoutEffect(() => {
    return () => {
      onUnmount();
    };
  }, []);

  const { t, ready } = useTranslation('List');
  if (!ready) return <Spinner />;

  if (!finalAvailableHosts.length) {
    return (
      <InnerResultWrapper>
        <Text centered>
          <Trans i18nKey='List:no-results'>
            Your search did not yield any results! Try
            <InlineLink as={Link} to='/search' color='info'>
              changing your search criteria
            </InlineLink>
            or
            <InlineLink onClick={() => switchToMap()} color='info' data-cy='map'>
              go to the map view
            </InlineLink>{' '}
            to find cat sitters in nearby areas.
          </Trans>
        </Text>
      </InnerResultWrapper>
    );
  }

  return (
    <InnerResultWrapper data-cy='inner-wrapper'>
      {finalAvailableHosts.map((host) => {
        return (
          <ListItem key={host.id} onClick={() => handleListItemClick(host.id)} data-cy={`list-card-${host.id}`}>
            {(host.available || host.reviews_count) && (
              <Badge
                responsive
                nature={host.available ? 'availability' : 'reviews'}
                data-cy='badge'
                data-cy-badge-nature={host.available ? 'availability' : 'reviews'}
              >
                {host.available ? <AvailableHost fill='white' height={6} /> : <Review fill='white' height={6} />}
              </Badge>
            )}
            {host.score && (
              <Container data-cy='score'>
                <ReviewScore score={host.score} displayNumerical={true} primaryColor='neutral' margin={0} />
              </Container>
            )}
            <Flexbox horizontalAlign='left' spaceItemsX={4}>
              <Flexbox direction='column'>
                <Avatar
                  data-cy='avatar'
                  responsive
                  src={
                    !host.user.profile_avatar
                      ? `https://ui-avatars.com/api/?name=${host.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
                      : host.user.profile_avatar
                  }
                />
              </Flexbox>

              <Flexbox direction='column' horizontalAlign='left'>
                <Container space={2}>
                  <Header level={3} data-cy='price'>
                    {finalTotal(
                      host.price_per_day_1_cat,
                      currentSearch.cats,
                      host.supplement_price_per_cat_per_day,
                      currentSearch?.start,
                      currentSearch?.end
                    )}{' '}
                    kr
                  </Header>
                </Container>
                <Container space={1}>
                  <Flexbox spaceItemsX={1}>
                    <User />
                    <Text bold level={5} data-cy='username'>
                      {host.user.nickname}
                    </Text>
                  </Flexbox>
                </Container>
                {host.score && (
                  <Flexbox spaceItemsX={1}>
                    <Review />
                    <Text data-cy='reviews'>{t('reusable:reviews', { count: host.reviews_count })}</Text>
                  </Flexbox>
                )}
                {host.available && (
                  <Flexbox spaceItemsX={1}>
                    <AvailableHost />
                    <Text data-cy='available'>{t('reusable:available')}</Text>
                  </Flexbox>
                )}
              </Flexbox>
            </Flexbox>
          </ListItem>
        );
      })}
    </InnerResultWrapper>
  );
};

const mapStateToProps = (state) => ({
  currentSearch: state.currentSearch,
});

export default connect(mapStateToProps)(List);
