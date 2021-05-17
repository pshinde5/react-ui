import aiaReducer from "./reducers/aiaReducers";
import {combineReducers} from "redux";

const reducers = combineReducers(
    {
        aia: aiaReducer
    }
)

export default reducers
