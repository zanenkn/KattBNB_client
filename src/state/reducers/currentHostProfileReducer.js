const initialState = {};

const currentHostProfile = (state = initialState, action) => {
  switch (action.type) {
    case 'HOST_PROFILE_FETCHED':
      return {
        ...state,
        ...action.hostProfile,
      };
    case 'HOST_PROFILE_RESET':
      return initialState;
    default:
      return state;
  }
};

export default currentHostProfile;
