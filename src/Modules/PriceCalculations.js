const total = (rate, cats, supplement, checkIn, checkOut) => {
  let price = (parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement))
  let total = parseFloat(price) * parseFloat((checkOut - checkIn) / 86400000 + 1)
  let totalWithDecimalsString = total.toFixed(2)
  if (totalWithDecimalsString[totalWithDecimalsString.length - 1] === '0' && totalWithDecimalsString[totalWithDecimalsString.length - 2] === '0') {
    return parseFloat(totalWithDecimalsString)
  } else {
    return totalWithDecimalsString
  }
}

const finalTotal = (rate, cats, supplement, checkIn, checkOut) => {
  let price = (parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement))
  let total = parseFloat(price) * parseFloat((checkOut - checkIn) / 86400000 + 1)
  let kattbnbTakeRate = 0.17
  let swedishVAT = 0.25
  let kattbnbTakeAmount = parseFloat(total) * kattbnbTakeRate
  let VATonKattbnbTakeAmount = parseFloat(kattbnbTakeAmount) * swedishVAT
  let finalCharge = parseFloat(total) + parseFloat(kattbnbTakeAmount) + parseFloat(VATonKattbnbTakeAmount)
  let finalChargeWithDecimalsString = finalCharge.toFixed(2)
  if (finalChargeWithDecimalsString[finalChargeWithDecimalsString.length - 1] === '0' && finalChargeWithDecimalsString[finalChargeWithDecimalsString.length - 2] === '0') {
    return parseFloat(finalChargeWithDecimalsString)
  } else {
    return finalChargeWithDecimalsString
  }
}

const pricePerDay = (rate, cats, supplement, checkIn, checkOut) => {
  let price = finalTotal(rate, cats, supplement, checkIn, checkOut) / parseFloat((checkOut - checkIn) / 86400000 + 1)
  let priceWithDecimalsString = price.toFixed(2)
  if (priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' && priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0') {
    return parseFloat(priceWithDecimalsString)
  } else {
    return priceWithDecimalsString
  }
}

export { pricePerDay, total, finalTotal }
