const passwordCheck = (password) => {
  const checkRegExp = /^(?=.\d)(?=.[a-z])(?=.*[A-Z]).{6,20}$/;
  if (password.match(checkRegExp)) {
    return true;
  } else {
    return false;
  }
};

export { passwordCheck };
