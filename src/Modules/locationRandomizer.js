const generateRandomNumber = () => {
  const minValue = parseFloat(process.env.REACT_APP_COORDS_MIN)
  const maxValue = parseFloat(process.env.REACT_APP_COORDS_MAX)
  let resultNumber = (Math.random() * (maxValue - minValue) + minValue).toFixed(6)
  return parseFloat(resultNumber)
}

export { generateRandomNumber }
