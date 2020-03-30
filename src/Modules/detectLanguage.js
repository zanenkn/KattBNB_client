const detectLanguage = () => {
  if (window.localStorage.getItem('I18N_LANGUAGE') === null || window.localStorage.getItem('I18N_LANGUAGE') === 'sv') {
    return 'sv-SE'
  } else {
    return 'en-US'
  }
}

export { detectLanguage }
