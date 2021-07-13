import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import Spinner from './Spinner';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { Header, InlineLink, Whitebox, Text } from '../../UI-Components';
// MIGRATED

const Success = (props) => {
  const { t } = useTranslation(props.translationName);

  return (
    <>
      <Header centered level={1} color='primary'>
        {t(props.translationHeader)}
      </Header>
      <Whitebox>
        <Text centered>
          <Trans i18nKey={props.translationKey}>
            text
            <InlineLink as={Link} to='faq' color='info'>
              FAQ
            </InlineLink>
            section.
          </Trans>
        </Text>
      </Whitebox>
    </>
  );
};

export default Success;
