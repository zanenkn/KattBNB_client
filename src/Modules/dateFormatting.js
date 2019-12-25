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

export default timeFormat