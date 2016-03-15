import { combineReducers } from 'redux'

const rootReducer = combineReducers({});

export default rootReducer


/*

exapmle state:

state = {
  ui: {
    isLandlord: boolean,
    currentView: string,
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
      landlordMessages: Number,
      finances: Number
    }
  }
}

*/