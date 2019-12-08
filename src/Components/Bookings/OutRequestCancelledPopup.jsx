import React from 'react'
import { Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const OutRequestCancelledPopup = (props) => {
  return (
    <>
      <div style={{ 'margin': '-2rem -2rem 2rem', 'background': '#c90c61', 'padding': '2rem' }}>
        <Header as='h2' style={{ 'color': '#ffffff', 'textAlign': 'left' }}>
          DECLINED
        </Header>
        <p style={{ 'color': '#ffffff', 'fontSize': 'small' }}>
          Your booking request for the dates of <strong>{props.startDate}</strong> until <strong>{props.endDate}</strong> got cancelled.
        </p>
      </div>
      <p style={{ 'fontSize': 'small', 'fontStyle': 'italic', 'margin': '1rem 0 0' }}>
        Your booking got automatically cancelled due to <strong style={{'fontStyle': 'normal', 'color': '#c90c61'}}>{props.nickname}</strong> not responding for 3 days.
      </p>
      <p style={{ 'fontSize': 'small', 'fontStyle': 'italic', 'margin': '1rem 0 0' }}>
        Try to <Header as={Link} to='/' className='fake-link-underlined' style={{'fontStyle': 'normal'}}>search again</Header>, we hope you find a perfect host soon!
      </p>
    </>
  )
}

export default OutRequestCancelledPopup
