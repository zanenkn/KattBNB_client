export const getRedirectBase = () => {
  if (process.env.REACT_APP_OFFICIAL === 'yes') {
    return 'https://kattbnb.se';
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://kattbnb.netlify.app';
  }
  return 'http://localhost:3000';
};
