const initialState = {};

const currentSearchReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case 'NEW_SEARCH':
      return {
        ...state,
        ...action.currentSearch,
      };
    default:
      return state;
  }
};

export default currentSearchReducer;
