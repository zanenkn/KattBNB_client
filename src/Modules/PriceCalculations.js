import { getBookingLength } from './booking'

const pricePerDay = (rate, cats, supplement) => {
  let price = (
    parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement)
  )
  return parseFloat(price.toFixed(2))
}

const total = (rate, cats, supplement, checkIn, checkOut) => {
  let price = (
    parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement)
  )
  let total = parseFloat(price) * parseFloat(getBookingLength(checkIn, checkOut))
  return parseFloat(total.toFixed(2))
}

export { pricePerDay, total }