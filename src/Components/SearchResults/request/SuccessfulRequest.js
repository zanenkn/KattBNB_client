import { useEffect } from 'react';

import moment from 'moment';
import { useTranslation, Trans } from 'react-i18next';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';

import Spinner from '../../../common/Spinner';
import { getAvatar } from '../../../Modules/getAvatar';
import useCurrentScope from '../../../hooks/useCurrentScope';

import { ContentWrapper, Avatar, Whitebox, Header, Flexbox, Text, InlineLink } from '../../../UI-Components';
import { User, Availabilty, Location, Cat } from '../../../icons';
import { SearchCriteriaWrapper, JustifiedWrapper } from '../styles';

const SuccessfulRequest = () => {
  const { t, ready } = useTranslation('SuccessfulRequest');
  const { device } = useCurrentScope();
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const location = useLocation()

  const { start, end, name, cats, avatar, place } = location.state;

  useEffect(() => {
    if (!location.state || navigationType === 'POP') {
      navigate('/');
      return;
    }
    window.onpopstate = () => {
      window.history.replace('/');
    };
    // eslint-disable-next-line
  }, []);

  if (!ready) {
    return <Spinner page />;
  }

  return (
    <ContentWrapper>
      <Header centered level={2} color='primary'>
        {t('SuccessfulRequest:title')}
      </Header>
      <Whitebox>
        <Avatar src={avatar ?? getAvatar(name)} size={'lg'} centered space={2} />
        <Flexbox spaceItemsX={1} space={4}>
          <User />
          <Header level={4}>{name}</Header>
        </Flexbox>
        <SearchCriteriaWrapper space={6}>
          <Flexbox spaceItemsX={1} horizontalAlign='left' space={2}>
            <Availabilty />
            <Text>
              {moment(start).format(device.width > 375 ? 'LL' : 'll')} -{' '}
              {moment(end).format(device.width > 375 ? 'LL' : 'll')}
            </Text>
          </Flexbox>

          <JustifiedWrapper horizontalAlign='left' space={6}>
            <Flexbox spaceItemsX={2}>
              <Flexbox spaceItemsX={1}>
                <Location />
                <Text>{place}</Text>
              </Flexbox>
              <Flexbox spaceItemsX={1}>
                <Cat />
                <Text>{cats}</Text>
              </Flexbox>
            </Flexbox>
          </JustifiedWrapper>
        </SearchCriteriaWrapper>
        <Text>
          <Trans i18nKey='SuccessfulRequest:text' values={{ host: name }}>
            <strong>first</strong> second
            <InlineLink href='faq' color='info'>
              third
            </InlineLink>
            .
          </Trans>
        </Text>
      </Whitebox>
    </ContentWrapper>
  );
};

export default SuccessfulRequest;
