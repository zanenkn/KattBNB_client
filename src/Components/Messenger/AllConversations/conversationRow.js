import { useState, useEffect } from 'react';
import moment from 'moment';

import timeFormat from '../../../Modules/dateFormatting';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { getAvatar } from '../../../Modules/getAvatar';
import { Avatar, Flexbox } from '../../../UI-Components';
import { useHistory } from 'react-router-dom';

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
      avatar: conversation[respondingUser]?.avatar ?? getAvatar(conversation[respondingUser]?.nickname),
    });
  }, []);

  return (
    <Flexbox onClick={() => history.push(`/conversation/${conversation.id}`)}>
      <Avatar src={responder.avatar} size='md' />
      {responder.name}
      {moment(conversation.msg_created).format(timeFormat(conversation.msg_created))}
    </Flexbox>
  );
};

export default ConversationRow;
