import axios from 'axios';

import * as actionType from './actionTypes'

export const authStart = () => {
    return {
        type: actionType.AUTH_START
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionType.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const authFail = (error) => {
    return {
        type: actionType.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId')
    return {type: actionType.AUTH_LOGOUT}  
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime * 1000);
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password, 
            returnSecureToken: true
        }; 
        
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCvKfmxQcXH6qHBUo3KyBn7K8FofqtZ7eY'

        if (!isSignup) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCvKfmxQcXH6qHBUo3KyBn7K8FofqtZ7eY'
        }
        axios.post(url, authData)
             .then(response => {
                 const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)
                 localStorage.setItem('token', response.data.idToken);
                 localStorage.setItem('expirationDate', expirationDate);
                 localStorage.setItem('userId', response.data.localId);
                 dispatch(authSuccess(response.data.idToken, 
                                      response.data.localId))
                 dispatch(checkAuthTimeout(response.data.expiresponseIn))
             })
             .catch(err => {
                 console.log(err);
                 dispatch(authFail(err.response.data.error))
             });
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionType.SET_AUTH_REDIRECT,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationTime'));
            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));                
            }
        }
    };
}