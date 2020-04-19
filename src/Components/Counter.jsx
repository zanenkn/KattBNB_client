import React from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import Search from './Search'
import { Button } from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'

const Counter = (props) => {
  const { t } = useTranslation('Counter')

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Search {...props} />
    } else {
      return (
        <div className='content-wrapper' style={{ 'margin': '0', 'backgroundColor': '#E0E0E0', 'position': 'fixed', 'height': '90vh', 'width': '100vw', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center' }}>
          <div className='content-wrapper' style={{ 'marginTop': '3rem' }}>
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
              <p style={{ 'marginTop': '2rem', 'color': '#3f3840', 'textAlign': 'center' }} dangerouslySetInnerHTML={{__html: t('Counter:p')}}></p>
              <Button style={{ 'marginTop': '1rem' }}>{t('reusable:title.signup')}</Button>
            </div>
          </div>
          <img src="cat.gif" style={{ 'position': 'absolute', 'zIndex': '3500', 'bottom': (window.innerWidth > 320 && window.innerWidth < 500) ? '-15%' : window.innerWidth > 500 ? '0' : '-25%', 'maxWidth': window.innerWidth > 500 ? '500px' : `${window.innerWidth + 70}px` }} />
        </div>
      )
    }
  }
  return (
    <Countdown
      date={'2020-05-15T01:00:00'}
      renderer={renderer}
    />
  )
}

export default Counter