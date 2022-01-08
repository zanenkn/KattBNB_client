const initialState = {
  visible: false,
  type: '',
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'OPEN_USER_MENU':
      return {
        visible: true,
        type: 'user',
      };
    case 'OPEN_MAIN_MENU':
      return {
        visible: true,
        type: 'main',
      };
    case 'CLOSE_MENU':
      return {
        visible: false,
        type: '',
      };
    default:
      return state;
  }
};

export default menuReducer;
