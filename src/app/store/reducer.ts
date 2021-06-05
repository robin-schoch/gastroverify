import {AuthenticationState} from './authentication/authentication.state';
import {ActionReducerMap} from '@ngrx/store';
import {authenticationReducer} from './authentication/authentication.reducer';

export interface RootState {
  authenticateState: AuthenticationState
}
export const reducers: ActionReducerMap<RootState> = {
  authenticateState: authenticationReducer
};
