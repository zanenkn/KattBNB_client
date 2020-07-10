const getBookingLength = (checkIn, checkOut) => {
  let dateArray = []
  let startDate = checkIn
  let stopDate = checkOut
  let currentDate = startDate
  while (currentDate <= stopDate) {
    dateArray.push(currentDate)
    currentDate = currentDate + 86400000
  }
  return dateArray.length
}

export { getBookingLength }
