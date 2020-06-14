const timeFormat = (created_at) => {
  let today = new Date()
  let conversation_date = new Date(created_at)
  let time_format

  if (conversation_date.getDate() === today.getDate() && conversation_date.getMonth() === today.getMonth() && conversation_date.getYear() === today.getYear()) {
    time_format = 'k:mm'
  } else if (conversation_date.getYear() !== today.getYear()) {
    time_format = 'll'
  } else {
    time_format = 'D MMM k:mm'
  }
  return time_format
}

const relativeTimeFormat = (created_at) => {
  let today = new Date()
  let date = new Date(created_at)
  let time_format

  if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getYear() === today.getYear()) {
    time_format = 'day'
  } else if (date.getYear() !== today.getYear()) {
    time_format = 'year'
  } else {
    time_format = 'hour'
  }
  return time_format
}

export { timeFormat, relativeTimeFormat }
