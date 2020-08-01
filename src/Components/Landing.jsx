import React, {useEffect, useState} from 'react'
import KattBNBLogomark from './Icons/KattBNBLogomark'

const Landing = () => {
  const [dimentions, setDimentions] = useState('mobile')

  useEffect(() => {
    window.innerHeight > window.innerWidth ? setDimentions('mobile') : setDimentions('desktop')
    window.addEventListener('resize', () => {
      window.innerHeight > window.innerWidth ? setDimentions('mobile') : setDimentions('desktop')
    })
  }, [])

  return (
    <div className={`landing-hero-wrapper ${dimentions}`}>
      <KattBNBLogomark width={'100px'} />
    </div> 
  )
}

export default Landing