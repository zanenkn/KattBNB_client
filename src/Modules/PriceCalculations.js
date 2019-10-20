import { getBookingLength } from './booking'

const pricePerDay = (rate, cats, supplement) => {
  let price = (
    parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement)
  )
  return price
}

const total = (rate, cats, supplement, checkIn, checkOut) => {
  let price = (
    parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement)
  )
  let total = parseFloat(price) * parseFloat(getBookingLength(checkIn, checkOut))
  return total
}

export { pricePerDay, total }