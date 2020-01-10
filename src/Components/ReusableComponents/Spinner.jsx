import React from 'react'

const Spinner = () => {

  return (
    <div className='content-wrapper' >
      <div style={{ 'margin': 'auto', 'display': 'table' }}>
        <div class='lds-spinner'>
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
