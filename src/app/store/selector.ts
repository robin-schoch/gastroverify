import {createFeatureSelector} from '@ngrx/store';
import {AuthenticationState} from './authentication/authentication.state';

export const selectSideNavState = createFeatureSelector<AuthenticationState>('authenticateState');
