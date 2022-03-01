const detectLanguage = () => {
  //if (process.env.NODE_ENV === 'production') {
    if (
      window.localStorage.getItem('I18N_LANGUAGE') === null ||
      window.localStorage.getItem('I18N_LANGUAGE') === '' ||
      window.localStorage.getItem('I18N_LANGUAGE') === 'sv'
    ) {
      return 'sv-SE';
    } else {
      return 'en-US';
    }
  // } else {
  //   return 'en-US';
  // }
};

export { detectLanguage };
