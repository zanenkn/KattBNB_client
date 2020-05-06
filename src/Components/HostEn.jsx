import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const HostEn = () => {
  const vid = useRef(null)

  const [buttonOpacity, setButtonOpacity] = useState(0)
  const [skipLinkPosition, setSkipLinkPosition] = useState('5vh')

  useEffect(() => {
    window.localStorage.setItem('I18N_LANGUAGE', 'en')
    vid.current.load()
    vid.current.play()
  }, [])

  const videoEnded = () => {
    setButtonOpacity(1)
    setSkipLinkPosition('-5vh')
  }

  return (
    <div className='content-wrapper' style={{ 'display': 'flex', 'minHeight': '90vh' }}>
      <div style={{ 'position': 'relative', 'margin': 'auto', 'display': 'flex', 'flexDirection': 'column' }}>
        <video width='100%' ref={vid} muted='muted' onEnded={() => videoEnded()} style={{ 'maxWidth': '500px', 'marginTop': '-5vh' }}>
          <source src='host.mp4' type='video/mp4'></source>
        </video>
        <Link to='/sign-up'>
          <Button style={{ 'position': 'absolute', 'marginLeft': '-44px', 'top': '55%', 'marginTop': '0', 'left': '50%', 'opacity': buttonOpacity }}>Sign up</Button>
        </Link>
      </div>
      <Link to='/sign-up' style={{ 'margin': 'auto', 'position': 'absolute', 'bottom': skipLinkPosition, 'left': '0', 'width': '-webkit-fill-available', 'transition': 'bottom .35s ease-in-out' }}><p style={{ 'textTransform': 'uppercase', 'color': 'silver', 'textAlign': 'center' }}>Skip this</p></Link>
    </div>

  )
}

export default HostEn