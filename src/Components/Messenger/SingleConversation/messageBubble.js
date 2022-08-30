import moment from 'moment';
import timeFormat from '../../../Modules/dateFormatting';
import { Text } from '../../../UI-Components';
import { Message } from './styles';

const MessageBubble = ({ belongsToCurrent, message, scrollDown, lang }) => {
  moment.locale(lang);

  const isImage = message.body === '';
  const urlRegex = /(\b((https?|ftp|file):\/\/|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  const onImageLoad = (e) => {
    scrollDown();
    e.target.naturalHeight > e.target.naturalWidth
      ? e.target.classList.add('portrait-img')
      : e.target.classList.add('landscape-img');
  };

  const linkify = (text) => {
    return text.replace(
      urlRegex,
      (url) =>
        `<a href='${
          url.startsWith('www.') ? 'https://' : ''
        }${url}' target='_blank' rel='noopener noreferrer'>${url}</a>`
    );
  };

  return (
    <>
      <Message isImage={isImage} belongsToCurrent={belongsToCurrent}>
        {isImage ? (
          <a href={message.image} target='_blank' rel='noopener noreferrer' style={{ lineHeight: '0' }}>
            <img
              onLoad={(e) => onImageLoad(e)}
              style={{ flexShrink: '0', minWidth: '100%', minHeight: '100%' }}
              src={message.image}
            ></img>
          </a>
        ) : (
          <span className='message' dangerouslySetInnerHTML={{ __html: linkify(message.body) }}></span>
        )}
      </Message>
      <Text right={belongsToCurrent} size={'sm'}>
        {moment(message.created_at).format(timeFormat(message.created_at))}
      </Text>
    </>
  );
};

export default MessageBubble;
