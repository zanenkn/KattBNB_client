const kattbnbTakeRate = 0.17;
const swedishVAT = 0.25;

const formatPrice = (amount) => {
  let amountWithDecimalsString = amount.toFixed(2);
  if (
    amountWithDecimalsString[amountWithDecimalsString.length - 1] === '0' &&
    amountWithDecimalsString[amountWithDecimalsString.length - 2] === '0'
  ) {
    return parseFloat(amountWithDecimalsString);
  } else {
    return amountWithDecimalsString;
  }
};

const roundUp = (amount) => {
  return Math.ceil(amount)
}

const hostTotal = (rate, cats, supplement, checkIn, checkOut) => {
  let price = parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement);
  let total = parseFloat(price) * parseFloat((checkOut - checkIn) / 86400000 + 1);
  return formatPrice(total);
};

const finalTotal = (rate, cats, supplement, checkIn, checkOut, round = true) => {
  let price = parseFloat(rate) + (parseFloat(cats) - 1) * parseFloat(supplement);
  let total = parseFloat(price) * parseFloat((checkOut - checkIn) / 86400000 + 1);
  let kattbnbTakeAmount = parseFloat(total) * kattbnbTakeRate;
  let VATonKattbnbTakeAmount = parseFloat(kattbnbTakeAmount) * swedishVAT;
  let finalCharge = parseFloat(total) + parseFloat(kattbnbTakeAmount) + parseFloat(VATonKattbnbTakeAmount);
  return round ? roundUp(finalCharge) : formatPrice(finalCharge);
};

const pricePerDay = (rate, cats, supplement, checkIn, checkOut) => {
  let price = finalTotal(rate, cats, supplement, checkIn, checkOut) / parseFloat((checkOut - checkIn) / 86400000 + 1);
  return formatPrice(price);
};

const priceOfOneAmount = (amount) => {
  let kattbnbTakeAmount = parseFloat(amount) * kattbnbTakeRate;
  let VATonKattbnbTakeAmount = parseFloat(kattbnbTakeAmount) * swedishVAT;
  let finalCharge = parseFloat(amount) + parseFloat(kattbnbTakeAmount) + parseFloat(VATonKattbnbTakeAmount);
  return formatPrice(finalCharge);
};

export { pricePerDay, priceOfOneAmount, hostTotal, finalTotal, formatPrice, roundUp };
