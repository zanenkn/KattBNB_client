import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

const HostSe = (props) => {
  const vid = useRef(null);

  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [skipLinkPosition, setSkipLinkPosition] = useState('3rem');
  const [skipLinkOpacity, setSkipLinkOpacity] = useState('1');

  useEffect(() => {
    vid.current.load();
    vid.current.play();
  }, []);

  const videoEnded = () => {
    setButtonOpacity(1);
    setSkipLinkPosition('0');
    setSkipLinkOpacity('0');
  };

  return (
    <div
      className='device-height'
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <Helmet>
        <title>Bli kattvakt på KattBNB!</title>
        <meta
          name='description'
          content='Få betalt för att gosa med katter. Låter det som en dröm? Registrera dig idag på KattBNB.'
        />
        <link rel='canonical' href='https://kattbnb.se/bli-kattvakt' />
        <meta property='og:title' content='Bli kattvakt på KattBNB!' />
        <meta property='og:url' content='https://kattbnb.se/bli-kattvakt' />
        <meta property='og:type' content='website' />
        <meta
          property='og:description'
          content='Få betalt för att gosa med katter. Låter det som en dröm? Registrera dig idag på KattBNB.'
        />
        <meta property='og:image' content='https://kattbnb.se/bli_kattvakt_og.png' />
      </Helmet>
      <div className='onboarding-video-wrapper'>
        <video
          width='100%'
          ref={vid}
          muted='muted'
          playsinline='playsinline'
          webkit-playsinline
          autoplay
          onEnded={() => videoEnded()}
        >
          <source src='kattvakt_480.mp4' type='video/mp4'></source>
        </video>
        <Link to={props.currentUserIn ? '/user-page' : '/sign-up'}>
          <Button
            style={{
              position: 'absolute',
              marginLeft: '-73px',
              bottom: '30%',
              marginTop: '0',
              left: '50%',
              opacity: buttonOpacity,
            }}
          >
            {props.currentUserIn ? 'Min profil' : 'Registrera konto'}
          </Button>
        </Link>
      </div>
      <Link
        to={props.currentUserIn ? '/user-page' : '/sign-up'}
        style={{
          margin: 'auto',
          position: 'absolute',
          opacity: skipLinkOpacity,
          bottom: skipLinkPosition,
          left: '0',
          width: '100vw',
          transition: 'all .35s ease-in-out',
        }}
      >
        <p style={{ textTransform: 'uppercase', color: 'silver', textAlign: 'center' }}>Hoppa över</p>
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
});

export default connect(mapStateToProps)(HostSe);
