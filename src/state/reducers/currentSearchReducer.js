const initialState = {};

const currentSearchReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case 'SEARCHED':
      return {
        ...state,
        ...action.currentSearch,
      };
    default:
      return state;
  }
};

export default currentSearchReducer;
