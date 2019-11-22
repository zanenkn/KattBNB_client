import { getBookingLength } from './booking'

const pricePerDay = (rate, cats, supplement) => {
  let price = (
    parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement)
  )
  let priceWithDecimalsString = price.toFixed(2)
  if (priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' && priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0') {
    return parseFloat(priceWithDecimalsString)
  } else {
    return priceWithDecimalsString
  }
}

const total = (rate, cats, supplement, checkIn, checkOut) => {
  let price = (
    parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement)
  )
  let total = parseFloat(price) * parseFloat(getBookingLength(checkIn, checkOut))
  let totalWithDecimalsString = total.toFixed(2)
  if (totalWithDecimalsString[totalWithDecimalsString.length - 1] === '0' && totalWithDecimalsString[totalWithDecimalsString.length - 2] === '0') {
    return parseFloat(totalWithDecimalsString)
  } else {
    return totalWithDecimalsString
  }
}

export { pricePerDay, total }
