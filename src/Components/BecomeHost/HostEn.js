import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import SEO from '../../common/SEO';
import { StyledContentWrapper, VideoWrapper } from './styles';
import { Button } from '../../UI-Components';

const HostEn = (props) => {
  const vid = useRef(null);

  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [skipLinkPosition, setSkipLinkPosition] = useState('3rem');
  const [skipLinkOpacity, setSkipLinkOpacity] = useState('1');

  useEffect(() => {
    window.localStorage.setItem('I18N_LANGUAGE', 'en');
    vid.current.load();
    vid.current.play();
  }, []);

  const videoEnded = () => {
    setButtonOpacity(1);
    setSkipLinkPosition('0');
    setSkipLinkOpacity('0');
  };
  return (
    <StyledContentWrapper>
      <SEO page='host-en' />
      <VideoWrapper>
        <video
          width='100%'
          ref={vid}
          muted='muted'
          playsinline='playsinline'
          webkit-playsinline
          autoplay
          onEnded={() => videoEnded()}
          style={{ maxWidth: '500px' }}
        >
          <source src='host_480.mp4' type='video/mp4'></source>
        </video>
        <Link to={props.currentUserIn ? '/user-page' : '/sign-up'}>
          <Button
            style={{
              opacity: buttonOpacity,
            }}
          >
            {props.currentUserIn ? 'My profile' : 'Sign up'}
          </Button>
        </Link>
      </VideoWrapper>
      <Link
        to={props.currentUserIn ? '/user-page' : '/sign-up'}
        style={{
          opacity: skipLinkOpacity,
          bottom: skipLinkPosition,
          transition: 'all .35s ease-in-out',
        }}
      >
        <p style={{ textTransform: 'uppercase', color: 'silver', textAlign: 'center' }}>Skip this</p>
      </Link>
    </StyledContentWrapper>
  );
  // return (
  //   <div
  //     className='device-height'
  //     style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
  //   >

  // 
  
  //   </div>
  // );
};

const mapStateToProps = (state) => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
});

export default connect(mapStateToProps)(HostEn);
