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
             .then(res => {
                 console.log(res);
                 dispatch(authSuccess(res.data.idToken, 
                                      res.data.localId))
             })
             .catch(err => {
                 console.log(err);
                 dispatch(authFail(err.response.data.error))
             });
    }
}