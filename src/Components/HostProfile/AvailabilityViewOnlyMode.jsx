import React from 'react'
import { useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import DayPicker from 'react-day-picker'
import '../../NpmPackageCSS/react-day-picker.css'

const AvailabilityViewOnlyMode = (props) => {

  const { t, ready } = useTranslation('AvailabilityViewOnlyMode')

  if (ready) {
    return (
      <>
        {props.selectedDays.length === 0 ?
          <p>{t('AvailabilityViewOnlyMode:no-dates-selected')}</p> :
          <div style={{ 'marginRight': '-2rem', 'marginLeft': '-2rem', 'marginBottom': '-1rem' }}>
            <DayPicker
              showWeekNumbers
              firstDayOfWeek={1}
              selectedDays={props.selectedDays}
              month={props.selectedDays[0]}
              fromMonth={props.selectedDays[0]}
              toMonth={props.selectedDays[props.selectedDays.length - 1]}
            />
          </div>
        }
      </>
    )
  } else { return <Spinner /> }
}

export default AvailabilityViewOnlyMode
