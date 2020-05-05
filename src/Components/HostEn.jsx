import React, { useEffect, useRef } from 'react'

const HostEn = () => {
  const vid = useRef(null)

  useEffect(() => {
    vid.current.load()
    vid.current.play()
  }, [])

  return (
    <div className='content-wrapper' >
      <video width="100%" ref={vid} muted="muted">
        <source src="host-en.mp4" type="video/mp4"></source>
      </video>
    </div>

  )
}

export default HostEn