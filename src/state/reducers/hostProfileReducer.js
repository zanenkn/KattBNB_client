const initialState = {
  data: null
};

const hostProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'HOST_PROFILE_FETCHED':
      return {
        data: action.hostProfile,
      };
    default:
      return state;
  }
};

export default hostProfileReducer;
