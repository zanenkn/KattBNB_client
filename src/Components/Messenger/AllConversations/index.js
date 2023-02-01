import React, { useState, useEffect } from 'react';
import withAuth from '../../../HOC/withAuth';
import Spinner from '../../../common/Spinner';
import { connect } from 'react-redux';

import axios from 'axios';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { useTranslation } from 'react-i18next';
import { ContentWrapper, Notice, Header, Text } from '../../../UI-Components';
import { AllConversationsWrapper, StyledSecondaryStickyHeader } from '../SingleConversation/styles';
import ConversationRow from './conversationRow';

const AllConversations = ({ currentUserId }) => {
  const { t, ready } = useTranslation('AllConversations');

  const [conversations, setConversations] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const handleAxiosStateChanges = (loadingState, errorMessage) => {
    setLoading(loadingState);
    setErrors(errorMessage);
  };

  useEffect(() => {
    if (window.navigator.onLine === false) {
      handleAxiosStateChanges(false, ['reusable:errors:window-navigator']);
    } else {
      const lang = detectLanguage();
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      const callParams = {
        locale: lang,
      };
      const path = '/api/v1/conversations';
      axios
        .get(path, { params: callParams, headers: headers })
        .then(({ data }) => {
          setConversations(data);
          handleAxiosStateChanges(false, []);
        })
        .catch(({ response }) => {
          if (response === undefined || response.status === 500) {
            setErrors(['reusable:errors.unknown']);
          }
          if (response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/login');
          }
          handleAxiosStateChanges(false, response.data.errors);
        });
    }
    // eslint-disable-next-line
  }, []);

  if (!ready || loading) return <Spinner page />;
  if (errors.length) {
    return (
      <ContentWrapper>
        <Notice nature='danger'>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      </ContentWrapper>
    );
  }

  return (
    <>
      <StyledSecondaryStickyHeader style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Header level={3} space={0} centered>
          {t('AllConversations:header')}
        </Header>
      </StyledSecondaryStickyHeader>
      <AllConversationsWrapper noBottomPadding>
        {!conversations.length && (
          <Text centered italic>
            {t('AllConversations:no-messages')}
          </Text>
        )}
        {conversations.map((conversation) => (
          <ConversationRow
            conversation={conversation}
            currentUserId={currentUserId}
            t={t}
            key={`conversation-${conversation.id}`}
          />
        ))}
      </AllConversationsWrapper>
    </>
  );
};

const mapStateToProps = (state) => ({ currentUserId: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(withAuth(AllConversations));
