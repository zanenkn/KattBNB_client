  
import React, { Component } from 'react'
import { Sidebar, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Faq extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          FAQ
        </Header>
        
        <Header as='h3' style={{'textAlign': 'left'}} >
          What is KattBNB?
        </Header>

        <p>
          Our idea of KattBNB is a platform that lets cat sitters offer their services and cat owners book a sitter that is most convenient to them. Think that you could check your cat in with someone you can trust as easy you check yourself in a hotel! That’s what we are building. A full range service that allows you to not only find the right person to look after your cat but also handles the booking, payment, staying in touch and all the other stuff. So you don’t have to worry while you are away.
        </p>

        <Header as='h3' style={{'textAlign': 'left'}} >
          When is KattBNB going live?
        </Header>

        <p>
          We are planning and working hard towards a release on spring 2020. 
        </p>

        <Header as='h3' style={{'textAlign': 'left'}} >
          Who we are?
        </Header>

        <p>
          We are couple of friends passionate about cats and coding. We believe in solving problems that matter and having fun while at it. More <Header  as={Link} to='about-us' className='fake-link-underlined'>here</Header>. 
        </p>

        <Header as='h3' style={{'textAlign': 'left'}} >
          I want to contribute!
        </Header>

        <p>
          Good! If you have an idea how to improve our code, you are welcome to open a pull request <a href='https://github.com/zanenkn/KattBNB_client' target='_blank' rel='noopener noreferrer' style={{'textDecoration': 'underline'}}>on GitHub</a>. 
        </p>

        <p>
          For any other suggestions and feedback, please use <Header  as={Link} to='contact-us' className='fake-link-underlined'>this form</Header> to get in touch with us. 
        </p>

      </Sidebar.Pushable>
    )
  }
}

export default Faq
