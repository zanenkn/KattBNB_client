import React, { useEffect } from 'react';
import withAuth from '../../../HOC/withAuth';
import Spinner from '../../../common/Spinner';
import { KattBNBLogo } from '../../../icons';
import { formatPrice, priceOfOneAmount } from '../../../Modules/PriceCalculations';
import { useTranslation, Trans } from 'react-i18next';
import { ContentWrapper, Divider, Header, Whitebox, Flexbox, Text } from '../../../UI-Components';
import styled from 'styled-components';

const StyledFlexbox = styled(Flexbox)`
  justify-content: space-between;
  > *:first-child {
    width: 75%;
  }
`;

const Receipt = ({ history }) => {
  const { t, ready } = useTranslation('Receipt');
  const { createdAt, numberOfCats, bookingId, nickname, startDate, endDate, priceTotal } = history.location.state;
  const swedishVAT = priceOfOneAmount(priceTotal) - formatPrice(priceTotal) - formatPrice(priceTotal * 0.17);

  useEffect(() => {
    if (history.location.state === undefined || history.action === 'POP') {
      history.push({ pathname: '/all-bookings' });
    }
    // eslint-disable-next-line
  }, []);

  if (!ready) {
    return <Spinner />;
  }

  return (
    <ContentWrapper>
      <Whitebox>
        <Flexbox space={5}>
          <KattBNBLogo width={'90px'} />
        </Flexbox>
        <Text space={8}>
          KattBNB AB
          <br />
          Reg. nr. 559252-4481
          <br />
          {t('Receipt:issued', { date: createdAt })}
        </Text>
        <Header level='4' centered space={6}>
          {t('Receipt:header', { nr: bookingId })}
        </Header>
        <StyledFlexbox verticalAlign={'bottom'}>
          <Text>
            <Trans i18nKey='Receipt:info' count={parseInt(numberOfCats)}>
              A stay for <strong>{{ count: numberOfCats }} cat</strong> with <strong>{{ host: nickname }}</strong>
              between <strong style={{ whiteSpace: 'nowrap' }}>{{ checkin: startDate }}</strong> until
              <strong style={{ whiteSpace: 'nowrap' }}>{{ checkout: endDate }}</strong>:
            </Trans>
          </Text>
          <Text>{formatPrice(priceTotal)} kr</Text>
        </StyledFlexbox>
        <StyledFlexbox verticalAlign={'bottom'}>
          <Text>{t('Receipt:service-fee')}</Text>
          <Text>{formatPrice(priceTotal * 0.17)} kr</Text>
        </StyledFlexbox>
        <StyledFlexbox verticalAlign={'bottom'}>
          <Text>{t('Receipt:vat')}</Text>
          <Text>{formatPrice(swedishVAT)} kr</Text>
        </StyledFlexbox>
        <Divider bottom={5} />
        <StyledFlexbox verticalAlign={'bottom'}>
          <Text bold color='primary'>
            {t('Receipt:total')}
          </Text>
          <Text bold color='primary'>
            {priceOfOneAmount(priceTotal)} kr
          </Text>
        </StyledFlexbox>
      </Whitebox>
    </ContentWrapper>
  );
};

export default withAuth(Receipt);
