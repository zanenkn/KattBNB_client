const kattbnbTakeRate = 0.17
const swedishVAT = 0.25

const formatPrice = (amount) => {
  let amountWithDecimalsString = amount.toFixed(2)
  if (amountWithDecimalsString[amountWithDecimalsString.length - 1] === '0' && amountWithDecimalsString[amountWithDecimalsString.length - 2] === '0') {
    return parseFloat(amountWithDecimalsString)
  } else {
    return amountWithDecimalsString
  }
}

const total = (rate, cats, supplement, checkIn, checkOut) => {
  let price = (parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement))
  let total = parseFloat(price) * parseFloat((checkOut - checkIn) / 86400000 + 1)
  return formatPrice(total)
}

const finalTotal = (rate, cats, supplement, checkIn, checkOut) => {
  let price = (parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement))
  let total = parseFloat(price) * parseFloat((checkOut - checkIn) / 86400000 + 1)
  let kattbnbTakeAmount = parseFloat(total) * kattbnbTakeRate
  let VATonKattbnbTakeAmount = parseFloat(kattbnbTakeAmount) * swedishVAT
  let finalCharge = parseFloat(total) + parseFloat(kattbnbTakeAmount) + parseFloat(VATonKattbnbTakeAmount)
  return formatPrice(finalCharge)
}

const pricePerDay = (rate, cats, supplement, checkIn, checkOut) => {
  let price = finalTotal(rate, cats, supplement, checkIn, checkOut) / parseFloat((checkOut - checkIn) / 86400000 + 1)
  return formatPrice(price)
}

const priceFor1DayFor1Cat = (rate) => {
  let price = parseFloat(rate)
  let kattbnbTakeAmount = parseFloat(price) * kattbnbTakeRate
  let VATonKattbnbTakeAmount = parseFloat(kattbnbTakeAmount) * swedishVAT
  let finalCharge = parseFloat(price) + parseFloat(kattbnbTakeAmount) + parseFloat(VATonKattbnbTakeAmount)
  return formatPrice(finalCharge)
}

const bookingDetailsPrice = (amount) => {
  let kattbnbTakeAmount = parseFloat(amount) * kattbnbTakeRate
  let VATonKattbnbTakeAmount = parseFloat(kattbnbTakeAmount) * swedishVAT
  let finalCharge = parseFloat(amount) + parseFloat(kattbnbTakeAmount) + parseFloat(VATonKattbnbTakeAmount)
  return formatPrice(finalCharge)
}

export { pricePerDay, priceFor1DayFor1Cat, total, finalTotal, bookingDetailsPrice }
