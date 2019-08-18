import React, { Component } from 'react'
import { Sidebar, Header, Image, Divider } from 'semantic-ui-react'

class AboutUs extends Component {
  render() {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          About us
        </Header>
        
        <Header as='h2' >
          The idea of KattBNB
        </Header>

        <p>
          Cancelling a weekend trip because there is no one to look after your cat. Changing your plans because a friend who reluctantly agreed to pet sit bailed the last minute. Dragging your clearly disgruntled cat on a lengthy train ride because that’s the only way to visit your parents for Christmas. If you’re a cat owner, chances are that you’ve been there.
        </p>
        <p>
          But what if booking your cat with a trusty petsitter would be as easy as booking yourself in a hotel or Airbnb? What if you wouldn’t have to worry about your furry friends wellbeing while you’re away on holiday?
        </p>
        <p>
          We believe if things can be made less difficult, they should. And we believe problems are solved when people come together. That’s why we are building KattBNB - a platform where cat owners can meet cat sitters and booking a boarding for your cat is a breeze. Because hey, it should be.
        </p>
        <Divider hidden />
        <Divider hidden />

        <Header as='h2'>
          Us behind the scenes
        </Header>

        <div>
          <Image style={{'margin': 'auto' }} src='zane.png' size='small'></Image>
        </div>
        <Header style={{'marginBottom': 0}}>
          <a href='https://www.linkedin.com/in/zane-neikena' target='_blank' rel='noopener noreferrer'>Zane Neikena</a>
        </Header>
        <Header as='h4' style={{'marginTop': 0}}>
          CEO and web developer
        </Header>
        <p style={{'textAlign': 'center'}}>
          Driving force behind the idea on the good days and crying force on the other ones
        </p>
        <Divider hidden />
        <Divider hidden />

        <div>
          <Image style={{'margin': 'auto' }} src='george.png' size='small'></Image>
        </div>
        <Header style={{'marginBottom': 0}}>
          <a href='https://www.linkedin.com/in/george-tomaras-05833730/' target='_blank' rel='noopener noreferrer'>Giorgos Tomaras</a>
        </Header>
        <Header as='h4' style={{'marginTop': 0}}>
          CTO and web developer
        </Header>
        <p style={{'textAlign': 'center'}}>
          Greek god of coding, the million dollar combo of stubbornness and patience
        </p>
        <Divider hidden />
        <Divider hidden />

        <div>
          <Image style={{'margin': 'auto' }} src='felix.png' size='small'></Image>
        </div>
        <Header style={{'marginBottom': 0}}>
          <a href='https://www.linkedin.com/in/felix-bonnier-90b4561/' target='_blank' rel='noopener noreferrer'>Felix Bonnier</a>
        </Header>
        <Header as='h4' style={{'marginTop': 0}}>
          Advisor in business development
        </Header>
        <p style={{'textAlign': 'center'}}>
          Felix tells us what to do when we don’t know what to do
        </p>
        <Divider hidden />
        <Divider hidden />

        <Header as='h2'>
          Acknowledgements
        </Header>

        <p>
          None of this would be possible without <a href='https://craftacademy.se/english/' target="_blank" rel='noopener noreferrer'>Craft Academy</a>. These people taught us to code and all things beyond that.
        </p>

      </Sidebar.Pushable>
    )
  }
}

export default AboutUs
