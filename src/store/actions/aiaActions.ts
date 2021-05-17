import * as Action from './../ActionTypes';

import axios from 'axios';

const AppConfig = {
    headers: {
        'content-type': 'application/json',
        'accept': 'application/vnd.hal+json',
        'accept-language': localStorage.getItem('i18nextLng'),
        'x-auth-username': 'vatsekov',
        'x-api-key': '48SmqcLpec3t1TO8EMzaDaamMz25pDZ469NFux41'
    },
    modifiedHeaderTag: 'X-GraphTalk-Modified',
    modifiedHeaderResTag: 'x-graphtalk-modified',
}
const aia = {
    // Params can be used to pass additional parameter to the request, in case we need change in headers, responseType etc
    get: (url: string, params?: { headers?: any; }) => axios.get(url, { headers: params && params.headers ? params.headers : AppConfig.headers }),
    post: (url: string, body: Object, params?: { headers?: any; }) => axios.post(url, body, { headers: params && params.headers ? params.headers : AppConfig.headers }),
    patch: (url: string, payload: Object, params?: { headers?: any; }) => axios.patch(url, payload, { headers: params && params.headers ? params.headers : AppConfig.headers }),
    delete: (url: string, params?: { headers?: any; }) => axios.delete(url, { headers: params && params.headers ? params.headers : AppConfig.headers })
}

export const fetch = (href: string, callType = 'get', baId:string, params?: Object) => (dispatch: any, getState: any) => {
    const timestamp = Date.now()
    dispatch({type: Action.BA_GET_PENDING, href, timestamp, baId})
    //Search if we have already fetch this hRef
    if (getState().aia[baId] && getState().aia[baId][href]) {
        dispatch({
            type: Action.BA_GET_SUCCESS,
            data: getState().aia[baId][href].data,
            store:getState(),
            params: params,
            href,
            baId
        })
        return Promise.resolve(getState().aia[baId][href]);
    } else {
        const promise = aia.get(href, params);
        promise.then(
            (response:any) => {
                dispatch({
                    type: Action.BA_GET_SUCCESS,
                    data: response.data,
                    store:getState(),
                    href,
                    baId
                })
            })
            .catch((error: any) => {
                dispatch({
                    type: Action.BA_GET_ERROR,
                    error,
                    href,
                    baId
                })
            })
        return promise;
    }   
}

export const refresh = (href: string, callType = 'refresh', baId:string, params?: Object) => (dispatch: any, getState: any) => {
    const timestamp = Date.now()

    dispatch({type: Action.BA_REFRESH_PENDING, href, timestamp, baId})

    const promise = aia.get(href, params);
    promise.then(
        (response:any) => {
            dispatch({
                type: Action.BA_REFRESH_SUCCESS,
                data: response.data,
                store:getState(),
                params: params,
                href,
                baId
            })
        })
        .catch((error: any) => {
            dispatch({
                type: Action.BA_REFRESH_ERROR,
                error,
                href,
                baId
            })
        })
    return promise
}

export const post = (href: string, body: Object, baId: string, params?: Object) => (dispatch: any, getState:any) => {
    dispatch({type: Action.BA_POST_PENDING, href, baId})

    const promise = aia.post(href, body, params);
    promise.then((response: any) => {
        // case1: modified headers
        if (response && response.data && response.data.messages && response.data.messages.length > 0) {
            const messages = response.data.messages;
            const existingHrefs = getState().aia[baId];
            const modifiedArray: any = messages.find((message: any) => message.context === AppConfig.modifiedHeaderTag);
            if (modifiedArray) {
                processModifiedHeaders(modifiedArray.message, existingHrefs, baId, dispatch);
            }
        }
        dispatch({
            type: Action.BA_POST_SUCCESS,
            href
        })
    })
        .catch((error: any) => {
            dispatch({
                type: Action.BA_POST_ERROR,
                error,
                href
            })
        })
    return promise;
}

export const patch = (href: string, payload: Object, baId: string, params?: Object) => (dispatch: any, getState:any) => {
    dispatch({type: Action.BA_PATCH_PENDING, href, baId})
    const promise = aia.patch(href, payload, params);
    promise.then((response: any) => {
        // case1: modified headers recieved in response headers
        if (response && response.headers && response.headers[AppConfig.modifiedHeaderResTag]) {
            const modifiedUrls = response.headers[AppConfig.modifiedHeaderResTag]
            const existingHrefs = getState().aia[baId];
            processModifiedHeaders(modifiedUrls.split(','), existingHrefs, baId, dispatch);
        } 
        // case2: When patch response is in form of messages, check modified headers & refresh url to get full response
        else if (response && response.data && response.data.messages && response.data.messages.length > 0) {
            refresh(href, 'refresh', baId);
            const messages = response.data.messages;
            const existingHrefs = getState().aia[baId];
            const modifiedArray: any = messages.find((message: any) => message.context === AppConfig.modifiedHeaderTag);
            if (modifiedArray) {
                processModifiedHeaders(modifiedArray.message, existingHrefs, baId, dispatch);
            }
        }
        dispatch({
            type: Action.BA_PATCH_SUCCESS,
            data: response.data,
            store:getState(),
            params: params,
            href,
            baId
        })
    })
        .catch((error: any) => {
            dispatch({
                type: Action.BA_PATCH_ERROR,
                error,
                href,
                baId
            })
        })
    return promise;
}

export const deleteRequest = (href: string, baId: string, params?: Object) => (dispatch: any, getState:any) => {
    dispatch({type: Action.BA_DELETE_PENDING, href, baId})

    const promise = aia.delete(href, params);
    promise.then((response: any) => {
      
        if (response && response.data && response.data.messages && response.data.messages.length > 0) {
            const messages = response.data.messages;
            const existingHrefs = getState().aia[baId];
            const modifiedArray: any = messages.find((message: any) => message.context === AppConfig.modifiedHeaderTag);
            if (modifiedArray) {
                processModifiedHeaders(modifiedArray.message, existingHrefs, baId, dispatch);
            }
        }
        dispatch({
            type: Action.BA_DELETE_SUCCESS,
            data: response.data,
            href,
            baId
        })
    })
        .catch((error: any) => {
            dispatch({
                type: Action.BA_DELETE_ERROR,
                error,
                href,
                baId
            })
        })
    return promise;
}

// checks if any modified URI exists in store & refresh it
const processModifiedHeaders = (modifiedArray: Array<Object | string>, existingMap: Array<any>, baId: string, dispatch:any) => {
    const requestArray :Array<Object> =[];
    if (modifiedArray) {
        // eslint-disable-next-line array-callback-return
        modifiedArray.map((message: any) => {
            if (Object.keys(existingMap).includes(message)) {
                requestArray.push(dispatch(refresh(message, 'refresh', baId)));
            }
        })
        Promise.all(requestArray).then();
    }
}
