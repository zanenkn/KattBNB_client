import React from 'react'
import { LOCATION_OPTIONS } from '../Modules/locationData'

const Glossary = () => {
  return (
    <div className='content-wrapper' style={{ maxWidth: '1024px', margin: 'auto' }}>
      <div className='flex-grid'>
        {LOCATION_OPTIONS.map((place) => (
          <p key={place.text}>
            <a className='discreet-link' href={`/search-results?location=${place.text}`} style={{whiteSpace: 'nowrap'}}>
              {place.text}
            </a>
          </p>
        ))}
      </div>
    </div>
  )
}

export default Glossary