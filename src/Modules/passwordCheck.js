const passwordCheck = (inputtxt) => {
  let passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if (inputtxt.match(passw)) {
    return true;
  } else {
    return false;
  }
};

export { passwordCheck };
