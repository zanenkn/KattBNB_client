import React from 'react'

const ReviewScore = (props) => {

  let score = [1, 2, 3, 4, 5]
  
  if (props.score % 1 === 0) {
    return (
      <div style={{ 'display': 'flex', 'margin': '1rem 0', 'alignItems': 'flex-end' }}>
        {score.map((sc)=> {
          return (
            <div id={sc} onClick={props.setScore} style={{ 'marginRight': '0.5rem', 'cursor': props.clickable ? 'pointer' : 'unset' }}>
              <svg fill={props.score >= sc ? '#c90c61' : 'silver'} height='2em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390.1 390.1">
                <path d="M132.6,177.9c31.2,0,56.5-34,56.5-75.8c0-41.8-25.3-75.8-56.5-75.8c-31.2,0-56.5,34-56.5,75.8
                C76.1,143.8,101.5,177.9,132.6,177.9z"/>
                <path d="M300.2,251.6c-1.2-1.6-2.3-3.1-2.9-4.3c-12.6-27-47.3-58.9-103.4-59.7l-2.2,0c-55.2,0-89.6,30.2-103.4,58.5
                c-0.5,1-1.5,2.2-2.6,3.5c-1.3,1.6-2.6,3.1-3.7,4.9c-11.6,18.1-17.5,38.4-16.7,57.3c0.9,20,9.3,36.1,23.6,45.3
                c5.8,3.7,12,5.6,18.5,5.6c13.5,0,25.8-7.6,40.1-16.4c9.1-5.6,18.5-11.4,28.9-15.7c1.2-0.4,6-1,13.8-1c9.3,0,16,0.8,17.4,1.3
                c10.2,4.5,19.1,10.4,27.7,16.1c13.2,8.7,25.8,17,39.3,17c5.8,0,11.5-1.5,16.8-4.6c29.4-16.7,35-62.5,12.5-102.1
                C302.9,255.3,301.6,253.4,300.2,251.6z"/>
                <path d="M252.8,177.9c31.1,0,56.5-34,56.5-75.8c0-41.8-25.4-75.8-56.5-75.8c-31.2,0-56.5,34-56.5,75.8
                C196.3,143.8,221.6,177.9,252.8,177.9z"/>
                <path d="M345.6,138.9c-25,0-44.5,25.9-44.5,59c0,33.1,19.6,59,44.5,59c25,0,44.5-25.9,44.5-59
                C390.1,164.8,370.6,138.9,345.6,138.9z"/>
                <path d="M89,197.9c0-33.1-19.6-59-44.5-59c-25,0-44.5,25.9-44.5,59c0,33.1,19.6,59,44.5,59S89,230.9,89,197.9z" />
              </svg>
            </div>
          )
        })
        }
        <p style={{ 'color': 'silver', 'marginLeft': '0.5rem' }}>
          ({props.score}/5)
        </p>
      </div>
    )
  } else {
    return (
      <div style={{ 'display': 'flex', 'margin': '1rem 0', 'alignItems': 'flex-end' }}>
        {score.map((sc) => {
          if(Math.floor(props.score) >= sc) {
            return (
              <div id={sc} style={{ 'marginRight': '0.5rem', 'cursor': props.clickable ? 'pointer' : 'unset' }}>
              <svg fill={'#c90c61'} height='2em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390.1 390.1">
                <path d="M132.6,177.9c31.2,0,56.5-34,56.5-75.8c0-41.8-25.3-75.8-56.5-75.8c-31.2,0-56.5,34-56.5,75.8
                C76.1,143.8,101.5,177.9,132.6,177.9z"/>
                <path d="M300.2,251.6c-1.2-1.6-2.3-3.1-2.9-4.3c-12.6-27-47.3-58.9-103.4-59.7l-2.2,0c-55.2,0-89.6,30.2-103.4,58.5
                c-0.5,1-1.5,2.2-2.6,3.5c-1.3,1.6-2.6,3.1-3.7,4.9c-11.6,18.1-17.5,38.4-16.7,57.3c0.9,20,9.3,36.1,23.6,45.3
                c5.8,3.7,12,5.6,18.5,5.6c13.5,0,25.8-7.6,40.1-16.4c9.1-5.6,18.5-11.4,28.9-15.7c1.2-0.4,6-1,13.8-1c9.3,0,16,0.8,17.4,1.3
                c10.2,4.5,19.1,10.4,27.7,16.1c13.2,8.7,25.8,17,39.3,17c5.8,0,11.5-1.5,16.8-4.6c29.4-16.7,35-62.5,12.5-102.1
                C302.9,255.3,301.6,253.4,300.2,251.6z"/>
                <path d="M252.8,177.9c31.1,0,56.5-34,56.5-75.8c0-41.8-25.4-75.8-56.5-75.8c-31.2,0-56.5,34-56.5,75.8
                C196.3,143.8,221.6,177.9,252.8,177.9z"/>
                <path d="M345.6,138.9c-25,0-44.5,25.9-44.5,59c0,33.1,19.6,59,44.5,59c25,0,44.5-25.9,44.5-59
                C390.1,164.8,370.6,138.9,345.6,138.9z"/>
                <path d="M89,197.9c0-33.1-19.6-59-44.5-59c-25,0-44.5,25.9-44.5,59c0,33.1,19.6,59,44.5,59S89,230.9,89,197.9z" />
              </svg>
            </div>
            )
          } else if (Math.floor(props.score) + 1 === sc) {
            return (
              <div id={sc} style={{ 'marginRight': '0.5rem', 'cursor': props.clickable ? 'pointer' : 'unset' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height='2em' viewBox="0 0 25 25">
                  <path fill="#C90C61" d="M8.5,11.4c2,0,3.6-2.2,3.6-4.9s-1.6-4.9-3.6-4.9S4.9,3.9,4.9,6.5C4.9,9.2,6.5,11.4,8.5,11.4z"/>
                  <path fill="#C0C0C0" d="M16.2,11.4c2,0,3.6-2.2,3.6-4.9s-1.6-4.9-3.6-4.9c-2,0-3.6,2.2-3.6,4.9C12.6,9.2,14.2,11.4,16.2,11.4z"/>
                  <path fill="#C0C0C0" d="M22.1,8.9c-1.6,0-2.9,1.7-2.9,3.8s1.3,3.8,2.9,3.8c1.6,0,2.9-1.7,2.9-3.8S23.8,8.9,22.1,8.9z"/>
                  <path fill="#C90C61" d="M5.7,12.7c0-2.1-1.3-3.8-2.9-3.8C1.2,8.9,0,10.6,0,12.7s1.3,3.8,2.9,3.8S5.7,14.8,5.7,12.7z"/>
                  <path fill="#C0C0C0" d="M19.5,16.5c-0.1-0.1-0.1-0.2-0.2-0.4c-0.1-0.1-0.1-0.2-0.2-0.3c-0.8-1.7-3-3.8-6.6-3.8h-0.1v9.1
                    c0.6,0,0.9,0.1,1,0.1c0.7,0.3,1.2,0.7,1.8,1c0.8,0.6,1.6,1.1,2.5,1.1c0.4,0,0.7-0.1,1.1-0.3C20.6,22,20.9,19,19.5,16.5z"/>
                  <path fill="#C90C61" d="M5.7,15.8c0,0.1-0.1,0.1-0.2,0.2c-0.1,0.1-0.2,0.2-0.2,0.3c-0.7,1.2-1.1,2.5-1.1,3.7c0.1,1.3,0.6,2.3,1.5,2.9
                    c0.4,0.2,0.8,0.4,1.2,0.4c0.9,0,1.6-0.5,2.6-1c0.6-0.4,1.2-0.7,1.9-1c0.1,0,0.4-0.1,0.9-0.1h0.1V12C8.8,12,6.5,14,5.7,15.8z"/>
                </svg>
              </div>
            )
          } else if (Math.floor(props.score) + 2 <= sc) {
            return (
              <div id={sc} style={{ 'marginRight': '0.5rem', 'cursor': props.clickable ? 'pointer' : 'unset' }}>
                <svg fill={'silver'} height='2em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390.1 390.1">
                  <path d="M132.6,177.9c31.2,0,56.5-34,56.5-75.8c0-41.8-25.3-75.8-56.5-75.8c-31.2,0-56.5,34-56.5,75.8
                  C76.1,143.8,101.5,177.9,132.6,177.9z"/>
                  <path d="M300.2,251.6c-1.2-1.6-2.3-3.1-2.9-4.3c-12.6-27-47.3-58.9-103.4-59.7l-2.2,0c-55.2,0-89.6,30.2-103.4,58.5
                  c-0.5,1-1.5,2.2-2.6,3.5c-1.3,1.6-2.6,3.1-3.7,4.9c-11.6,18.1-17.5,38.4-16.7,57.3c0.9,20,9.3,36.1,23.6,45.3
                  c5.8,3.7,12,5.6,18.5,5.6c13.5,0,25.8-7.6,40.1-16.4c9.1-5.6,18.5-11.4,28.9-15.7c1.2-0.4,6-1,13.8-1c9.3,0,16,0.8,17.4,1.3
                  c10.2,4.5,19.1,10.4,27.7,16.1c13.2,8.7,25.8,17,39.3,17c5.8,0,11.5-1.5,16.8-4.6c29.4-16.7,35-62.5,12.5-102.1
                  C302.9,255.3,301.6,253.4,300.2,251.6z"/>
                  <path d="M252.8,177.9c31.1,0,56.5-34,56.5-75.8c0-41.8-25.4-75.8-56.5-75.8c-31.2,0-56.5,34-56.5,75.8
                  C196.3,143.8,221.6,177.9,252.8,177.9z"/>
                  <path d="M345.6,138.9c-25,0-44.5,25.9-44.5,59c0,33.1,19.6,59,44.5,59c25,0,44.5-25.9,44.5-59
                  C390.1,164.8,370.6,138.9,345.6,138.9z"/>
                  <path d="M89,197.9c0-33.1-19.6-59-44.5-59c-25,0-44.5,25.9-44.5,59c0,33.1,19.6,59,44.5,59S89,230.9,89,197.9z" />
                </svg>
            </div>
            )
          }
        })
        }
      </div>
    )
  }
}

export default ReviewScore
