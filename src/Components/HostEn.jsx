import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

const HostEn = (props) => {
  const vid = useRef(null)

  const [buttonOpacity, setButtonOpacity] = useState(0)
  const [skipLinkPosition, setSkipLinkPosition] = useState('5vh')
  const [skipLinkOpacity, setSkipLinkOpacity] = useState('1')

  useEffect(() => {
    window.localStorage.setItem('I18N_LANGUAGE', 'en')
    vid.current.load()
    vid.current.play()
  }, [])

  const videoEnded = () => {
    setButtonOpacity(1)
    setSkipLinkPosition('-5vh')
    setSkipLinkOpacity('0')
  }

  return (
    <div className='content-wrapper' style={{ 'display': 'flex', 'minHeight': '90vh', 'maxHeight': '90vh', 'overflow': 'hidden' }}>
      <Helmet>
        <title>Become a cat sitter on KattBNB!</title>
        <meta name='description' content='Getting paid for chilling with cats. Sounds like a dream? Sign up today at KattBNB.' />
        <link rel='canonical' href='https://kattbnb.se/become-host' />
        <meta property='og:title' content='Become a cat sitter on KattBNB!' />
        <meta property='og:url' content='https://kattbnb.se/become-host' />
        <meta property='og:type' content='website' />
        <meta property='og:description' content='Getting paid for looking after cats. Sounds like a dream? Sign up today at KattBNB.' />
        <meta property='og:image' content='https://kattbnb.se/bli_kattvakt_og.png' />
      </Helmet>
      <div style={{ 'position': 'relative', 'margin': '0 auto', 'paddingTop': '1rem', 'display': 'flex', 'flexDirection': 'column', 'overflow': 'hidden', 'height': 'max-content' }}>
        <video width='100%' ref={vid} muted='muted' playsinline='playsinline' webkit-playsinline autoplay onEnded={() => videoEnded()} style={{ 'maxWidth': '500px' }}>
          <source src='host_480.mp4' type='video/mp4'></source>
        </video>
        <Link to={props.currentUserIn ? '/user-page' : '/sign-up'}>
          <Button style={{ 'position': 'absolute', 'marginLeft': '-44px', 'bottom': '30%', 'marginTop': '0', 'left': '50%', 'opacity': buttonOpacity }}>{props.currentUserIn ? 'My profile' : 'Sign up'}</Button>
        </Link>
      </div>
      <Link to={props.currentUserIn ? '/user-page' : '/sign-up'} style={{ 'margin': 'auto', 'position': 'absolute', 'opacity': skipLinkOpacity, 'bottom': skipLinkPosition, 'left': '0', 'width': '100vw', 'transition': 'all .35s ease-in-out' }}><p style={{ 'textTransform': 'uppercase', 'color': 'silver', 'textAlign': 'center' }}>Skip this</p></Link>
    </div>

  )
}

const mapStateToProps = state => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(HostEn)
