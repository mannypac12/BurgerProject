import axios from 'axios';

import * as actionType from './actionTypes'

export const authStart = () => {
    return {
        type: actionType.AUTH_START
    }
}

export const authSuccess = (authData) => {
    return {
        type: actionType.AUTH_SUCCESS,
        authData: authData
    }
}

export const authFail = (error) => {
    return {
        type: actionType.AUTH_FAIL,
        error: error
    }
}

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password, 
            returnSecureToken: true
        }
        axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCvKfmxQcXH6qHBUo3KyBn7K8FofqtZ7eY', authData)
             .then(res => {
                 console.log(res);
                 dispatch(authSuccess(res.data))
             })
             .catch(err => {
                 console.log(err);
                 dispatch(authFail(err))
             });
    }
}