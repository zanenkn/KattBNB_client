import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HostProfileView from './HostProfileView'
import Spinner from '../ReusableComponents/Spinner'

const HostProfileViewWrapper = (props) => {

  const [hostProfile, setHostProfile] = useState([])
  const [lat, setLat] = useState(null)
  const [long, setLong] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`/api/v1/host_profiles?user_id=${props.location.state.userId}`)
      .then((response) => {
        if (response.data.length > 0) {
          setHostProfile(response.data[0])
          setLat(response.data[0].lat)
          setLong(response.data[0].long)
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
  }, [])

  if (loading) {
    return <Spinner />
  } else if (lat !== null && long !== null) {
    return (
      <div style={{ 'height': '100%' }}>
        <HostProfileView
          numberOfCats={0}
          hostId={props.location.state.userId}
          avatar={props.location.state.avatar}
          nickname={props.location.state.nickname}
          location={props.location.state.location}
          rate={parseFloat(hostProfile.price_per_day_1_cat)}
          supplement={parseFloat(hostProfile.supplement_price_per_cat_per_day)}
          description={hostProfile.description}
          lat={lat}
          long={long}
          noMessage={props.location.state.noMessage}
        />
      </div>
    )
  } else {
    return (
      <div className='content-wrapper' >
        <p style={{ 'textAlign': 'center', 'fontStyle': 'italic' }}>
          This user has no host profile.
          </p>
      </div>
    )
  }
}

export default HostProfileViewWrapper
