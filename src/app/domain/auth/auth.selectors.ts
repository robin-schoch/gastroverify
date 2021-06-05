import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthenticationStatus} from './auth.reducer';

const authSelector = createFeatureSelector('auth');

export const isSignedIn = createSelector(
    authSelector,
    (auth: AuthenticationStatus) => auth.isAuthenticated
);

export const getAuthRoles = createSelector(
    authSelector,
    (auth: AuthenticationStatus) => auth.roles
);
