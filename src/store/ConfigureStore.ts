import { applyMiddleware, createStore } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './RootReducers'
import thunk from 'redux-thunk'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk))
const store = createStore(rootReducer, composedEnhancer)

export default store