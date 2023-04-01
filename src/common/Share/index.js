import { useTranslation } from 'react-i18next';
import { Header, LinkIcon, Flexbox, TextField, Button } from '../../UI-Components';
import { Link, LinkedinIcon, TwitterIcon, FacebookIcon } from '../../icons';

const Share = ({ link, title }) => {
  const { t } = useTranslation('reusable');
  return (
    <>
      <Flexbox spaceItemsX={1} space={5} horizontalAlign={'left'}>
        <Link height={5} />
        <Header level={5}>{title}</Header>
      </Flexbox>

      <Flexbox spaceItemsX={2} space={3} horizontalAlign={'left'}>
        <LinkIcon
          href={`https://www.facebook.com/sharer/sharer.php?u=${link}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <FacebookIcon height={7} tint={40} />
        </LinkIcon>
        <LinkIcon href={`https://twitter.com/home?status=${link}`} target='_blank' rel='noopener noreferrer'>
          <TwitterIcon height={7} tint={40} />
        </LinkIcon>
        <LinkIcon
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${link}&title=&summary=&source=`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <LinkedinIcon height={7} tint={40} />
        </LinkIcon>
      </Flexbox>
      <Flexbox spaceItemsX={1}>
        <TextField value={link} flexGrow={1} />
        <Button
          onClick={() => {
            navigator.clipboard.writeText(link);
          }}
        >
          {t('reusable:cta.copy')}
        </Button>
      </Flexbox>
    </>
  );
};

export default Share;
