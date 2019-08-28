const initialState = {
  menuVisible: false
}

const animationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_VISIBILITY':
      return {
        menuVisible: !state.menuVisible
      }
    default:
      return state
  }
}

export default animationReducer
