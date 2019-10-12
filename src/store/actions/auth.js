import * as actionTypes from "./actionTypes";
import axios from 'axios';

export const authStart = ()  => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (idToken, userId)  => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: idToken,
        userId: userId
    };
};

export const authFail = (error)  => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};


export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
};


const checkAuthTimeout = (expiresTimeout) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expiresTimeout * 1000);
    }
};

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDd7lTldwjJkFHmR73rTqWUf6nDJL05X1c";
        if (!isSignUp) {
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDd7lTldwjJkFHmR73rTqWUf6nDJL05X1c"
        }
        axios.post(url, authData).then(response => {
            console.log(response.data);
            localStorage.setItem("token", response.data.idToken);
            localStorage.setItem("userId", response.data.localId);
            localStorage.setItem("expirationDate", new Date(new Date().getTime() + response.data.expiresIn * 1000));
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn))
        }).catch(err => {
            console.log(err);
            dispatch(authFail(err.response.data.error));
        })
    };
};

export const checkAuthState = () => {
    return dispatch => {
        const token = localStorage.getItem("token");
         if (!token) {
             dispatch(logout());
         } else {
             const expirationDate = new Date(localStorage.getItem('expirationDate'));
             const userId = localStorage.getItem("userId");
             if (expirationDate <= new Date()) {
                 dispatch(logout());
             } else {
                 dispatch(authSuccess(token, userId));
                 dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
             }
         }
    };
};
