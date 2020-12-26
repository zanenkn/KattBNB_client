const search = (nameKey, myArray) => {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].long_name === nameKey) {
      return myArray[i];
    }
  }
};

export { search };
