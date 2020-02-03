import React from 'react'

const Spinner = () => {

  return (
    <div className='content-wrapper' >
      <div style={{ 'margin': 'auto', 'display': 'table' }}>
        <div className='lds-spinner'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default Spinner
