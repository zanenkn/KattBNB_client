import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';
import Spinner from '../ReusableComponents/Spinner';
import moment from 'moment';
import { Trans, useTranslation } from 'react-i18next';

const SuccessfulRequest = ({ history }) => {
  const { t, ready } = useTranslation('SuccessfulRequest');

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfCats, setNumberOfCats] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (history.location.state === undefined || history.action === 'POP') {
      history.push({ pathname: '/' });
    } else {
      const { checkInDate, checkOutDate, nickname, numberOfCats } = history.location.state;
      setCheckIn(moment(checkInDate).format('l'));
      setCheckOut(moment(checkOutDate).format('l'));
      setNumberOfCats(numberOfCats);
      setNickname(nickname);
    }
    // eslint-disable-next-line
  }, []);

  if (ready) {
    return (
      <div className='content-wrapper'>
        <Header as='h1'>{t('SuccessfulRequest:title')}</Header>
        <Segment className='whitebox' style={{ textAlign: 'center' }}>
          <p>
            <Trans i18nKey='SuccessfulRequest:p1' count={parseInt(numberOfCats)}>
              You have successfully requested a booking for
              <strong style={{ color: '#c90c61' }}>{{ count: numberOfCats }} cat</strong> with
              <strong style={{ color: '#c90c61' }}>{{ host: nickname }}</strong> during the dates of
              <strong style={{ color: '#c90c61' }}>{{ checkin: checkIn }}</strong> until
              <strong style={{ color: '#c90c61' }}>{{ checkout: checkOut }}</strong>.
            </Trans>
          </p>
          <p>
            <Trans i18nKey='SuccessfulRequest:p2'>
              <strong style={{ color: '#c90c61' }}>{{ host: nickname }}</strong> now has 3 days to accept or decline
              your request. We will let you know by email. Questions? Check out our
              <Header as={Link} to='faq' className='fake-link'>
                FAQ
              </Header>
              .
            </Trans>
          </p>
        </Segment>
      </div>
    );
  } else {
    return <Spinner />;
  }
};

export default SuccessfulRequest;
