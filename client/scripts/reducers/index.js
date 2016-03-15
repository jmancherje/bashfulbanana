import { combineReducers } from 'redux'
import { changeView } from './ui_reducer'

const rootReducer = combineReducers({
  changeView
});

export default rootReducer


/*

exapmle state:

state = {
  ui: {
    isLandlord: boolean,
    currentView: {
      render: 'house_info',
      text: 'House Info'
    },
    username: string,
    house: {
      code: string,
      name: string
    }
  },
  context: {
    chores: Array of chore objects,
    finances: {
      payment: Array of payment objects,
      bills: Array of bill objects
    },
    landlordMessages: Array of message objects,
    counters: {
      messages: Number,
      chores: Number,
      contact_landlord: Number,
      finances: Number
    }
  }
}

*/