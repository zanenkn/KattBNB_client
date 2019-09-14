import React, { Component } from 'react'
import { Header, Form, Button } from 'semantic-ui-react'

class Search extends Component {
  state = {

  }


  render() {


    return (
      <div className='content-wrapper' >
        <div id='host-profile-form'>
          <Header as='h2'>
            Create host profile
          </Header>
          <p className='small-centered-paragraph' style={{ 'marginBottom': '1rem' }}>
            Fill in this information about yourself and start hosting cats today!
          </p>
          <Form id='host-profile-form'>
            <Form.TextArea
              label='About you'
              placeholder='Please write shortly about yourself and your experience with cats..'
              required
              id='description'
              value={this.state.description}
              onChange={this.onChangeHandler}
            />

            <p className='small-left-paragraph'>
              Don’t worry, this will only be revealed to cat owners that have a confirmed booking with you!
            </p>

            <Form.Group
              widths='equal'
            >
              <Form.Input
                label='Your rate'
                type='number'
                placeholder='Your daily rate in kr/day'
                required
                id='rate'
                value={this.state.rate}
                onChange={this.onChangeHandler}
                onKeyPress={this.listenEnterKey}
              />

              <Form.Input
                label='Max cats accepted'
                type='number'
                placeholder='Max amount'
                required
                id='maxCats'
                value={this.state.maxCats}
                onChange={this.onChangeHandler}
                onKeyPress={this.listenEnterKey}
              />

              <Form.Input
                label='Supplement'
                type='number'
                placeholder='+35kr/cat/day'
                required
                id='supplement'
                value={this.state.supplement}
                onChange={this.onChangeHandler}
                onKeyPress={this.listenEnterKey}
              />
            </Form.Group>
            <p className='small-left-paragraph'>
              <strong>What does this mean?</strong> Let’s say that your rate is 120 kr/day for one cat and supplement for a second cat is 35 kr/day. That means if you host one cat for three days your payment is 120 x 3 =360 kr. Although if you agree to host two cats of the same owner for three days your payment is (120+35) x 3 = 465 kr
            </p>


            <p className='small-centered-paragraph'>
              Please mark the dates when you are available to host!
            </p>
          </Form>


          <div className='button-wrapper'>
            <div>
              <Button secondary className='cancel-button' onClick={this.props.closeForm}>Close</Button>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Search
