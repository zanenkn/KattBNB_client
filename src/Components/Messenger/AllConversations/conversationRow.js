import { useState, useEffect } from 'react';
import moment from 'moment';

import timeFormat from '../../../Modules/dateFormatting';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { getAvatar } from '../../../Modules/getAvatar';
import { Avatar, Divider, Header, Text } from '../../../UI-Components';
import { useHistory } from 'react-router-dom';
import { RowWrapper, Textflex } from './styles';

const ConversationRow = ({ conversation, currentUserId, t }) => {
  const [responder, setResponder] = useState({ name: '', avatar: null });
  const history = useHistory();
  const lang = detectLanguage();

  moment.locale(lang);

  useEffect(() => {
    const respondingUser = Object.keys(conversation)
      .filter((key) => key === 'user1' || key === 'user2')
      .find((key) => conversation[key]?.['id'] !== currentUserId);

    setResponder({
      name: conversation[respondingUser]?.nickname || t('AllConversations:deleted-user'),
      avatar: conversation[respondingUser]?.profile_avatar ?? getAvatar(conversation[respondingUser]?.nickname),
    });
  }, []);

  return (
    <>
      <RowWrapper onClick={() => history.push(`/conversation/${conversation.id}`)}>
        <Avatar src={responder.avatar} size='lg' responsive />

        <Textflex spaceItemsX={3} verticalAlign='baseline'>
          <div>
            <Header level={5}>{responder.name}</Header>
            <Text space={0}>{conversation.msg_body}</Text>
          </div>
          <Text space={0}>{moment(conversation.msg_created).format(timeFormat(conversation.msg_created))}</Text>
        </Textflex>
      </RowWrapper>
      <Divider top={0} bottom={0} tint={40} />
    </>
  );
};

export default ConversationRow;
