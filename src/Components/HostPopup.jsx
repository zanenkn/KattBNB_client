import React, {Component} from 'react'
import axios from 'axios'

class HostPopup extends Component {
  componentDidMount() {
    axios.get(`/api/v1/host_profiles?user_id=${this.props.id}`).then(response => {
      this.setState({ hostProfile: response.data })
    })
  }
  render() {
    return(
      <>
        hej
      </>
    )
  }
}

export default HostPopup