import React from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import Search from './Search'
import { useTranslation, Trans } from 'react-i18next'
import { connect } from 'react-redux'
import FacebookIcon from './ReusableComponents/FacebookIcon'
import InstagramIcon from './ReusableComponents/InstagramIcon'
import LinkedinIcon from './ReusableComponents/LinkedinIcon'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

const Counter = (props) => {
  const { t } = useTranslation('Counter')

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Search {...props} />
    } else {
      return (
        <div className='content-wrapper' style={{ 'margin': '0', 'backgroundColor': '#E0E0E0', 'position': 'fixed', 'height': '90vh', 'width': '100vw', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center' }}>
          <Helmet>
            <title>KattBNB - boka kattvakt online!</title>
            <meta name='description' content='Vi bryr oss om katterna. På KattBNB kommer du kunna boka kattvakt online - snabbt och enkelt! Registrera ditt konto idag.' />
            <link rel='canonical' href='https://kattbnb.se' />
            <meta property='og:title' content='KattBNB - boka kattvakt online!' />
            <meta property='og:url' content='https://kattbnb.se' />
            <meta property='og:type' content='website' />
            <meta property='og:description' content='På KattBNB kommer du kunna boka kattvakt online - snabbt och enkelt! Registrera ditt konto idag.' />
            <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
          </Helmet>
          <div className='content-wrapper' style={{ 'marginTop': '3rem', 'paddingTop': '0' }}>
            <table style={{ 'textAlign': 'center', 'margin': 'auto', 'color': '#3f3840' }}>
              <tr style={{ 'fontSize': '2rem', 'lineHeight': '1' }}>
                <td style={{}}><strong>{zeroPad(days)}</strong></td>
                <td style={{ 'minWidth': '10px' }}><strong>:</strong></td>
                <td style={{}}><strong>{zeroPad(hours)}</strong></td>
                <td style={{ 'minWidth': '10px' }}><strong>:</strong></td>
                <td style={{}}><strong>{zeroPad(minutes)}</strong></td>
                <td style={{ 'minWidth': '10px' }}><strong>:</strong></td>
                <td style={{}}><strong>{zeroPad(seconds)}</strong></td>
              </tr>
              <tr style={{ 'textTransform': 'uppercase', 'fontSize': 'x-small', 'letterSpacing': '2px', 'lineHeight': '1' }}>
                <td>{t('Counter:days')}</td>
                <td></td>
                <td>{t('Counter:hours')}</td>
                <td></td>
                <td>{t('Counter:minutes')}</td>
                <td></td>
                <td>{t('Counter:seconds')}</td>
              </tr>
            </table>
            <div>
              <p style={{ 'marginTop': '2rem', 'color': '#3f3840', 'textAlign': 'center', 'maxWidth': '312px' }}>
                <Trans i18nKey='Counter:p'>
                  Hey there! We open for bookings the 1st of June but you can <Link to='/sign-up' style={{ 'fontWeight': 'bold' }}>sign up</Link> already now. Or maybe you want to <Link to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'} style={{ 'fontWeight': 'bold' }}>become a cat sitter</Link>?
                </Trans>
              </p>
              <div style={{ 'display': 'flex', 'justify-content': 'center' }}>
                <a href='https://www.facebook.com/kattbnb/' target='_blank' rel='noopener noreferrer' style={{ 'margin': '0 0.5rem', 'cursor': 'pointer' }}>
                  <FacebookIcon height={'3rem'} fill={'silver'} />
                </a>
                <a href='https://www.instagram.com/kattbnb' target='_blank' rel='noopener noreferrer' style={{ 'margin': '0 0.5rem', 'cursor': 'pointer' }}>
                  <InstagramIcon height={'3rem'} fill={'silver'} />
                </a>
                <a href='https://www.linkedin.com/company/28767809' target='_blank' rel='noopener noreferrer' style={{ 'margin': '0 0.5rem', 'cursor': 'pointer' }}>
                  <LinkedinIcon height={'3rem'} fill={'silver'} />
                </a>
              </div>
            </div>
          </div>
          <img src='cat.gif' alt='' style={{ 'position': 'absolute', 'zIndex': '3500', 'bottom': (window.innerHeight < 540) ? '-42%' : (window.innerWidth > 320 && window.innerWidth < 500) ? '-15%' : window.innerWidth > 500 ? '-80px' : '-18%', 'maxWidth': window.innerWidth > 500 ? '500px' : `${window.innerWidth}px` }} />
        </div>
      )
    }
  }
  return (
    <Countdown
      date={'2020-06-01T07:00:00'} start
      renderer={renderer}
    />
  )
}

const mapStateToProps = state => ({
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
})

export default connect(mapStateToProps)(Counter)
