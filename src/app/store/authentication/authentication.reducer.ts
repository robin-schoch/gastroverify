import {initialState} from './authentication.state';
import {createReducer, on} from '@ngrx/store';


import {clearAuthStatus, confirmAuthStatus} from './authentication.action';

const reducer = createReducer(
    initialState,
    on(confirmAuthStatus, ((state, {username, roles = []}) => ({
      ...state,
      userName: username,
      isAuthenticated: !!username,
      roles: roles
    }))),
    on(clearAuthStatus, (state => initialState)));

export const authenticationReducer = (state, action) => reducer(state, action)
