import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

const HostSe = (props) => {
  const vid = useRef(null)

  const [buttonOpacity, setButtonOpacity] = useState(0)
  const [skipLinkPosition, setSkipLinkPosition] = useState('5vh')

  useEffect(() => {
    vid.current.load()
    vid.current.play()
  }, [])

  const videoEnded = () => {
    setButtonOpacity(1)
    setSkipLinkPosition('-5vh')
  }

  return (
    <div className='content-wrapper' style={{ 'display': 'flex', 'minHeight': '90vh' }}>
      <Helmet>
        <title>Bli kattvakt på KattBNB!</title>
        <meta name='description' content='Få betalt för att gosa med katter. Låter det som en dröm? Registrera dig idag på KattBNB.' />
        <link rel='canonical' href='https://kattbnb.se/bli-kattvakt' />
        <meta property='og:title' content='Bli kattvakt på KattBNB!' />
        <meta property='og:url' content='https://kattbnb.se/bli-kattvakt' />
        <meta property='og:type' content='website' />
        <meta property='og:description' content='Få betalt för att gosa med katter. Låter det som en dröm? Registrera dig idag på KattBNB.' />
        <meta property='og:image' content='https://kattbnb.se/bli_kattvakt_og.png' />
      </Helmet>
      <div style={{ 'position': 'relative', 'margin': 'auto', 'display': 'flex', 'flexDirection': 'column' }}>
        <video width='100%' ref={vid} muted='muted' playsinline='playsinline' webkit-playsinline autoplay onEnded={() => videoEnded()} style={{ 'maxWidth': '500px', 'marginTop': '-5vh' }}>
          <source src='kattvakt.mp4' type='video/mp4'></source>
        </video>
        <Link to={props.currentUserIn ? '/user-page' : '/sign-up'}>
          <Button style={{ 'position': 'absolute', 'marginLeft': '-73px', 'top': '55%', 'marginTop': '0', 'left': '50%', 'opacity': buttonOpacity }}>{props.currentUserIn ? 'Min profil' : 'Registrera konto'}</Button>
        </Link>
      </div>
      <Link to={props.currentUserIn ? '/user-page' : '/sign-up'} style={{ 'margin': 'auto', 'position': 'absolute', 'bottom': skipLinkPosition, 'left': '0', 'width': '-webkit-fill-available', 'transition': 'bottom .35s ease-in-out' }}><p style={{ 'textTransform': 'uppercase', 'color': 'silver', 'textAlign': 'center' }}>Hoppa över</p></Link>
    </div>
  )
}

const mapStateToProps = state => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(HostSe)
