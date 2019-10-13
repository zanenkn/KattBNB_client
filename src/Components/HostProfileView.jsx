import React from 'react'

const HostProfileView = (props) => {
  return (
    <p>
      {props.location.state.nickname}
    </p>   
  )
}

export default HostProfileView