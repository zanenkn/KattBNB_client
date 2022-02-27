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
}) => {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Image src={image} style={{ borderRadius: '50%', height: '100px' }} />
        <div style={{ marginLeft: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
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
              Website
            </a>
          </div>
          {RichText.render(description)}

          <a target='_blank' href={donationLink}>
            <Button style={{ margin: 0 }}>Donate</Button>
          </a>
          <Accordion style={{ marginTop: '2rem' }}>
            <Accordion.Title
              active={activeIndex === indx}
              index={indx}
              onClick={handleClick}
              style={{ color: 'grey', fontWeight: '600' }}
            >
              <Icon name='dropdown' />
              More about donating this organisation
            </Accordion.Title>
            <Accordion.Content active={activeIndex === indx}>{RichText.render(donationDescription)}</Accordion.Content>
          </Accordion>
        </div>
      </div>
      <Divider style={{ margin: '2rem 0' }} />
    </>
  );
};

export default Charity;
