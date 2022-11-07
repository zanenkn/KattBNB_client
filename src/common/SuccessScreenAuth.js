import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import Spinner from './Spinner';
import { wipeCredentials } from '../Modules/wipeCredentials';
import { Header, InlineLink, Whitebox, Text, ContentWrapper } from '../UI-Components';
// COMPLETELY MIGRATED

const SuccessScreenAuth = ({ translationFile, currentUserIn }) => {
  const { t, ready } = useTranslation(translationFile);

  if (currentUserIn) {
    wipeCredentials();
    setTimeout(function () {
      window.location.reload();
    }, 500);
  }

  if (!ready) {
    return <Spinner page />;
  }

  return (
    <ContentWrapper>
      <Header centered level={1} color='primary'>
        {t(`${translationFile}:title`)}
      </Header>
      <Whitebox>
        <Text centered>
          <Trans i18nKey={`${translationFile}:p`}>
            text
            <InlineLink as={Link} to='faq' color='info'>
              link
            </InlineLink>
            .
          </Trans>
        </Text>
      </Whitebox>
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn });

export default connect(mapStateToProps)(SuccessScreenAuth);
