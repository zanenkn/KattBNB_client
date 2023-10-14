import React from 'react';
import withAuth from '../../../HOC/withAuth';
import Spinner from '../../../common/Spinner';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { ContentWrapper, Notice, Header, Text } from '../../../UI-Components';
import { AllConversationsWrapper, StyledSecondaryStickyHeader } from '../SingleConversation/styles';
import ConversationRow from './conversationRow';
import { useConversations } from '../hooks/useConversations';

const AllConversations = ({ currentUserId }) => {
  const { t, ready } = useTranslation('AllConversations');

  const {conversations, loading, errors} = useConversations()

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
