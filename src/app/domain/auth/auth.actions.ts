import {createAction, props} from '@ngrx/store';
import {CognitoUser} from 'amazon-cognito-identity-js';


export const confirmAuthStatus = createAction(
    '[Landing Page] Confirm Auth Status',
    props<{  username?: string, roles : string[] }>()
);

export const clearAuthStatus = createAction(
    '[Auth Service] Clear Login',
)
