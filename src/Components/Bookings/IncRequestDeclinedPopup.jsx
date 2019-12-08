import React from 'react'
import { Header } from 'semantic-ui-react'

const IncRequestDeclinedPopup = (props) => {
  return (
    <>
      <div style={{ 'margin': '-2rem -2rem 2rem', 'background': '#c90c61', 'padding': '2rem' }}>
        <Header as='h2' style={{ 'color': '#ffffff', 'textAlign': 'left' }}>
          DECLINED
        </Header>
        <p style={{ 'color': '#ffffff', 'fontSize': 'small' }}>
          Your declined a booking request from <strong>{props.nickname}</strong> for the dates of <strong>{props.startDate}</strong> until <strong>{props.endDate}</strong>.
        </p>
      </div>
        <p style={{ 'fontSize': 'small', 'fontStyle': 'italic', 'margin': '1rem 0 0' }}>
          {props.message}
        </p>
    </>
  )
}

export default IncRequestDeclinedPopup
