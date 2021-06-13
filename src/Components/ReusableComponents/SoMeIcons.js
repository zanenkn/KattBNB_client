import FacebookIcon from '../Icons/FacebookIcon';
import InstagramIcon from '../Icons/InstagramIcon';
import LinkedinIcon from '../Icons/LinkedinIcon';

const SoMeIcons = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <a
      href='https://www.facebook.com/kattbnb/'
      target='_blank'
      rel='noopener noreferrer'
      style={{ margin: '0 0.5rem', cursor: 'pointer' }}
    >
      <FacebookIcon height={'2rem'} fill={'silver'} class={'some-icon'} />
    </a>
    <a
      href='https://www.instagram.com/kattbnb'
      target='_blank'
      rel='noopener noreferrer'
      style={{ margin: '0 0.5rem', cursor: 'pointer' }}
    >
      <InstagramIcon height={'2rem'} fill={'silver'} class={'some-icon'} />
    </a>
    <a
      href='https://www.linkedin.com/company/28767809'
      target='_blank'
      rel='noopener noreferrer'
      style={{ margin: '0 0.5rem', cursor: 'pointer' }}
    >
      <LinkedinIcon height={'2rem'} fill={'silver'} class={'some-icon'} />
    </a>
  </div>
);

export default SoMeIcons;
