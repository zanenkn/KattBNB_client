import React, {Component} from 'react'
import axios from 'axios'
import HostProfileView from './HostProfileView'

class HostProfileViewWrapper extends Component {
  state={
    hostProfile: [],
    lat: '1',
    long: '1'
  }
  componentDidMount() {
    axios.get(`/api/v1/host_profiles?user_id=${this.props.location.state.user_id}`).then(response => {
      this.setState({ 
        hostProfile: response.data[0],
        lat: response.data[0].lat,
        long: response.data[0].long
      })
    })
  }
  render() {
    return (
      <div style={{'height': '100%'}}>
        <HostProfileView
          numberOfCats={1}
          id={this.props.location.state.user_id}
          avatar={this.props.location.state.avatar}
          nickname={this.props.location.state.nickname}
          location={this.props.location.state.location}
          rate={parseFloat(this.state.hostProfile.price_per_day_1_cat)}
          supplement={parseFloat(this.state.hostProfile.supplement_price_per_cat_per_day)}
          description={this.state.hostProfile.description}
          lat={this.state.lat}
          long={this.state.long}
        />
      </div>
    )
  }
}

export default HostProfileViewWrapper