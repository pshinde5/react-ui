import {
    deleteRequest as deleteAction,
    fetch as fetchAction,
    patch as patchAction,
    post as postAction
} from './../store/actions/aiaActions';
import {useCallback, useContext} from "react";

import baContext from "./../context/baContext";
import {useDispatch} from "react-redux";

/**
 * get
 * @returns {*} Information for aia
 * We need to include parameter to pass headers 
 */
export default function useAia() {
  
    const dispatch: any = useDispatch();
    const context = useContext(baContext)
    const baId: string = context.baId ? context.baId: '';

    const fetch = useCallback(
        (...params) => {
            const href = params[0];
            return dispatch(fetchAction(href, 'get', baId))
        }, [baId, dispatch])
    const post = useCallback(
        (...params) => {
            const href = params[0]
            const body = params[1] ? params[1]: {};
            return dispatch(postAction(href, body, baId))
        }, [baId, dispatch])
        
    const patch = useCallback(
        (...params) => {
            const href = params[0]
            const payload = params[1] ? params[1]: {};
            return dispatch(patchAction(href, payload, baId))
        }, [baId, dispatch])
    const deleteRequest = useCallback(
        (...params) => {
            const href = params[0]                    
            return dispatch(deleteAction(href, baId))
        }, [baId, dispatch])

    return {fetch, post, patch, deleteRequest}
}
