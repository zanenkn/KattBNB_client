import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SEO from '../../common/SEO';
import { AbsoluteContainer, SkipLink, StyledButton, StyledContentWrapper, VideoWrapper } from './styles';

const HostEn = (props) => {
  const vid = useRef(null);

  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('I18N_LANGUAGE', 'en');
    vid.current.load();
    vid.current.play();
  }, []);

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
          onEnded={() => setVideoEnded(true)}
        >
          <source src='host_480.mp4' type='video/mp4'></source>
        </video>
        <AbsoluteContainer>
          <Link to={props.currentUserIn ? '/user-page' : '/sign-up'}>
            <StyledButton videoEnded={videoEnded}>{props.currentUserIn ? 'My profile' : 'Sign up'}</StyledButton>
          </Link>
        </AbsoluteContainer>
      </VideoWrapper>
      <SkipLink
        forwardedAs={Link}
        discreet
        center
        to={props.currentUserIn ? '/user-page' : '/sign-up'}
        videoEnded={videoEnded}
      >
        Skip this
      </SkipLink>
    </StyledContentWrapper>
  );
};

const mapStateToProps = (state) => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
});

export default connect(mapStateToProps)(HostEn);
