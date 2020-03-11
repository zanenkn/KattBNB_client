import React from 'react'
import DayPicker from 'react-day-picker'
import '../../NpmPackageCSS/react-day-picker.css'

const AvailabilityViewOnlyMode = (props) => {

  return (
    <>
      {props.selectedDays.length === 0 ?
        <p>You have not selected any availability dates!</p> :
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
}

export default AvailabilityViewOnlyMode
