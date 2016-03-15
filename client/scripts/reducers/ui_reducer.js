const INITIAL_STATE = { isLandlord = false, currentView = 'finance' }

// set ui properties on state
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_VIEW':
      return { ...state, action.payload.view }
    default:
      return state
  }
}