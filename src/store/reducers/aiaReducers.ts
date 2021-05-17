import * as ActionType from './../ActionTypes';

const initialState = {}

const aiaReducer = (state = initialState, action: any) => {
    let newState:any = {...state}
    let newBa: any

    const updateResponse = (newState:any, action:any) => {
        // eslint-disable-next-line array-callback-return
        Object.keys(action.store.aia).map((baId: any) => {
            if (baId && baId[action.href]) {
                newState[baId][action.href] = {data:{...action.data}}
            } else {
                newState[action.baId][action.href] = {data:{...action.data}}
            }
        })
        return newState;
    }

    switch (action.type) {
        case ActionType.BA_START:
            // While switching tab the baId is set blank again, to check in store it's existence
            // if (action.store[action.baId]) {
            //     newState[action.baId] = action.store[action.baId]
            // } else {
            //     newState[action.baId] = {}
            // }
            newState[action.baId] = {}
            return newState

        case ActionType.BA_END:
            newBa = delete newState[action.baId]
            newState = newBa
            return newState

        case ActionType.BA_GET_PENDING:
            return newState

        case ActionType.BA_GET_SUCCESS:
            newState = updateResponse(newState, action)
            return newState

        case ActionType.BA_GET_ERROR:
            console.log('Error in BA_GET', action)
            return newState

        case ActionType.BA_REFRESH_PENDING:
            return newState
    
        case ActionType.BA_REFRESH_SUCCESS:
            newState = updateResponse(newState, action)
            return newState
    
        case ActionType.BA_REFRESH_ERROR:
            console.log('Error in BA_REFRESH', action)
            return newState

        case ActionType.BA_POST_PENDING:
            return newState

        case ActionType.BA_POST_SUCCESS:
            return newState

        case ActionType.BA_POST_ERROR:
            console.log('Error in BA_POST', action)
            return newState

        case ActionType.BA_PATCH_PENDING:
            return newState
    
        case ActionType.BA_PATCH_SUCCESS:
            newState = updateResponse(newState, action)
            return newState
    
        case ActionType.BA_PATCH_ERROR:
            console.log('Error in BA_PATCH', action)
            return newState

        case ActionType.BA_DELETE_PENDING:
            return newState
        
        case ActionType.BA_DELETE_SUCCESS:
            let resources = newState[action.baId] ? newState[action.baId] : {};
            delete resources[action.href];
            newState[action.baId] = resources;
            return newState
        
        case ActionType.BA_DELETE_ERROR:
            console.log('Error in BA_DELETE', action)
            return newState

        default:
            return state
    }
}
export default aiaReducer
