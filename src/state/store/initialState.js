const initialState = {
  menuVisible: false,
  reduxTokenAuth: {
    currentUser: {
      isLoading: false,
      isSignedIn: false,
      attributes: {
        uid: ''
      }
    }
  }
}

export default initialState