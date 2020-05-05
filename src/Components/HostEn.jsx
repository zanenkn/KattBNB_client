import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'semantic-ui-react'

const HostEn = () => {
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
      <div style={{ 'position': 'relative', 'margin': 'auto', 'display': 'flex', 'flexDirection': 'column' }}>
        <video width='100%' ref={vid} muted='muted' onEnded={() => videoEnded()} style={{ 'maxWidth': '500px' }}>
          <source src='host-en.mp4' type='video/mp4'></source>
        </video>
        <Button style={{ 'position': 'absolute', 'marginLeft': '-44px', 'bottom': '10%', 'left': '50%', 'opacity': buttonOpacity }}>Sign up</Button>
      </div>
      <a href='https://kattbnb.se/sign-up' style={{ 'margin': 'auto', 'position': 'absolute', 'bottom': skipLinkPosition, 'left': '0', 'width': '-webkit-fill-available', 'transition': 'bottom .35s ease-in-out' }}><p style={{ 'textTransform': 'uppercase', 'color': 'silver', 'textAlign': 'center' }}>Skip this</p></a>
    </div>

  )
}

export default HostEn