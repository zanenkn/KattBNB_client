import React, { Component } from 'react'
import { Header, Form, Grid, Icon, Button } from 'semantic-ui-react'

class HostProfileForm extends Component {
  state = {
    description: '',
    user_input_address: '',
    address_search: true
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  render() {
    let addressSearch

    if (this.state.address_search === true) {
      addressSearch = (
        <>
          <Form.Group unstackable>
            <Form.Input
              width={12}
              label='Your full address'
              placeholder='Search..'
              required
              id='user_input_address'
              value={this.state.user_input_address}
              onChange={this.onChangeHandler}
            />

            <Form.Button width={4} content='src' style={{ 'margin-top': '1.7rem', 'padding-left': '1rem', 'padding-right': '1rem' }}>
              <Icon

                name='search'
              //onClick={this.geolocationDataAddress.bind(this)}
              />
            </Form.Button>
          </Form.Group>
        </>
      )
    } else {
      addressSearch = (
        <div className="change-address-link">
          <p className='address-change' onClick={() => { this.setState({ address_search: true }) }}>
            Change location
          </p>
        </div>
      )
    }

    return (
      <div id='host-profile-form'>
        <Header as='h2'>
          Create host profile
        </Header>
        <p className='small-centered-paragraph'>
          Fill in this information about yourself and start hosting cats today!
        </p>
        <Form id='login-form'>
          <Form.TextArea
            label='About you'
            placeholder='Please write shortly about yourself and your experience with cats..'
            required
            id='description'
            value={this.state.description}
            onChange={this.onChangeHandler}
          />
          {addressSearch}
        </Form>
      </div>
    )
  }
}

export default HostProfileForm