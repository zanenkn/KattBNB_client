import React from 'react'
import { Header, Button, Image } from 'semantic-ui-react'

const IncRequestPopup = (props) => {
  return (
    <>
      <div style={{ 'margin': '-2rem -2rem 2rem', 'background': '#c90c61', 'padding': '2rem' }}>
        <Header as='h2' style={{ 'color': '#ffffff', 'textAlign': 'left' }}>
          Request to book
        </Header>
        <p style={{ 'color': '#ffffff', 'fontSize': 'small' }}>
          A stay for <strong>{props.number_of_cats} {props.number_of_cats > 1 ? 'cats' : 'cat'}</strong> for the dates of <strong>{props.startDate}</strong> until <strong>{props.endDate}</strong>
        </p>
      </div>
      <div style={{ 'display': 'flex', 'alignItems': 'center' }}>
        <Image src={props.avatar === null ? `https://ui-avatars.com/api/?name=${props.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : props.avatar} size='small' style={{ 'borderRadius': '50%', 'width': '3rem', 'height': '3rem' }}></Image>
        <Header style={{ 'margin': '0 1rem' }}>
          {props.nickname}
        </Header>
      </div>
      <p style={{ 'fontSize': 'small', 'fontStyle': 'italic', 'margin': '1rem 0 0' }}>
        {props.message}
      </p>
    </>
  )
}

export default IncRequestPopup
