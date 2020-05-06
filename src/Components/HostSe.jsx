import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const HostSe = () => {
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
        <video width='100%' ref={vid} muted='muted' onEnded={() => videoEnded()} style={{ 'maxWidth': '500px', 'marginTop': '-5vh' }}>
          <source src='kattvakt.mp4' type='video/mp4'></source>
        </video>
        <Link to='/sign-up'>
          <Button style={{ 'position': 'absolute', 'marginLeft': '-73px', 'top': '55%', 'marginTop': '0', 'left': '50%', 'opacity': buttonOpacity }}>Registrera konto</Button>
        </Link>
      </div>
      <Link to='/sign-up' style={{ 'margin': 'auto', 'position': 'absolute', 'bottom': skipLinkPosition, 'left': '0', 'width': '-webkit-fill-available', 'transition': 'bottom .35s ease-in-out' }}><p style={{ 'textTransform': 'uppercase', 'color': 'silver', 'textAlign': 'center' }}>Hoppa över</p></Link>
    </div>

  )
}

export default HostSe