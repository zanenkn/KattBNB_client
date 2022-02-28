import { Header, Image, Button, Divider, Accordion, Icon } from 'semantic-ui-react';
import Location from '../Icons/Location';
import { RichText } from 'prismic-reactjs';

const Charity = ({
  image,
  title,
  location,
  locationLink,
  websiteLink,
  description,
  donationLink,
  donationDescription,
  activeIndex,
  handleClick,
  indx,
  added,
  verified,
  t
}) => {
  return (
    <>
      <div className='paws-charity-wrapper'>
        <Image src={image} />
        <div className='paws-charity-text-wrapper'>
          <div className='paws-charity-header-wrapper'>
            <Header as='h3' style={{ marginBottom: 0, textAlign: 'left' }}>
              {title}
            </Header>
            <a target='_blank' href={locationLink}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  justifyContent: 'flex-start',
                }}
              >
                <Location fill={'grey'} height={'1.2em'} />
                <p style={{ margin: '0 0 0 0.5rem' }}>{location}</p>
              </div>
            </a>
            <a target='_blank' href={websiteLink} className='fake-link-underlined'>
              {t('PawsOfPeace:website')}
            </a>
          </div>
          {RichText.render(description)}

          <a target='_blank' href={donationLink}>
            <Button style={{ margin: 0 }}>{t('PawsOfPeace:donate')}</Button>
          </a>
          <Accordion style={{ margin: '2rem 0 1rem' }}>
            <Accordion.Title
              active={activeIndex === indx}
              index={indx}
              onClick={handleClick}
              style={{ color: 'grey', fontWeight: '600' }}
            >
              <Icon name='dropdown' />
              {t('PawsOfPeace:more-about-donating')}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === indx}>{RichText.render(donationDescription)}</Accordion.Content>
          </Accordion>
          <p style={{ fontStyle: 'italic', fontSize: 'small', marginBottom: '0' }}>{t('PawsOfPeace:added')}: {added}</p>
          <p style={{ fontStyle: 'italic', fontSize: 'small', marginBottom: '0' }}>{t('PawsOfPeace:verified')}: {verified}</p>
        </div>
      </div>

      <Divider style={{ margin: '2rem 0' }} />
    </>
  );
};

export default Charity;
