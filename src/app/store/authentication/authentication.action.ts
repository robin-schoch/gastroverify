import {createAction, props} from '@ngrx/store';
import {createName} from '../action';

export const confirmAuthStatus = createAction(
    createName('Landing Page', 'Confirm Auth Status'),
    props<{ username?: string, roles: string[] }>()
);

export const clearAuthStatus = createAction(
    createName('Auth Service', 'Clear Login'),
);

export const signOut = createAction(createName('App Component', 'Sign Out'))

export const rehydrateCurrentUser = createAction(createName('App Component', 'Rehydrate Current User'))
export const successLogin = createAction(createName('Login Dialg Component', 'Success Login'))

export const noInitialUser = createAction(createName('Authentication Effect', 'No initial User'))
