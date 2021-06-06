import {createSelector} from '@ngrx/store';

import {selectAuthenticationState} from '../selector';

export const selectIsSignedIn = createSelector(
    selectAuthenticationState,
    (auth) => auth.isAuthenticated
);

export const selectAuthRoles = createSelector(
    selectAuthenticationState,
    (auth) => auth.roles
);

export const selectIsAdmin = createSelector(
    selectAuthRoles,
    (roles) => roles.includes('admin')
)
