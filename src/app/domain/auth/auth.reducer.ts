import {createReducer, on} from '@ngrx/store';
import {clearAuthStatus, confirmAuthStatus} from './auth.actions';


export const authFeatureKey = 'auth';

export interface AuthenticationStatus {
  userName?: string,
  isAuthenticated: boolean,
  roles: string[]
}

export const initialState: AuthenticationStatus = {
  isAuthenticated: false,
  roles: []
};


export const authReducer = createReducer(
    initialState,
    on(confirmAuthStatus, ((state, {username, roles = []}) => {
      return Object.assign({}, state, <AuthenticationStatus>{
        userName: username,
        isAuthenticated: !!username,
        roles: roles
      });
    })),
    on(clearAuthStatus, (state => initialState))
);

