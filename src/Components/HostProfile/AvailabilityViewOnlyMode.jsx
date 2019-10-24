import React from 'react'
import DayPicker from 'react-day-picker'
import '../../NpmPackageCSS/react-day-picker.css'

const AvailabilityViewOnlyMode = (props) => {
  let calendar

  if (props.selectedDays.length === 0) {
    calendar = (
      <p>You have not selected any availability dates!</p>
    )
  } else {
    calendar = (
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
    )
  }

  return (
    <>
      {calendar}
    </>
  )
}

export default AvailabilityViewOnlyMode
