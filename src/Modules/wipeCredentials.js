const wipeCredentials = (path = 'not') => {
  if (path === 'not') {
    window.localStorage.removeItem('access-token');
    window.localStorage.removeItem('token-type');
    window.localStorage.removeItem('client');
    window.localStorage.removeItem('uid');
    window.localStorage.removeItem('expiry');
  } else {
    window.localStorage.removeItem('access-token');
    window.localStorage.removeItem('token-type');
    window.localStorage.removeItem('client');
    window.localStorage.removeItem('uid');
    window.localStorage.removeItem('expiry');
    window.location.replace(path);
  }
};

export { wipeCredentials };
