import {createFeatureSelector} from '@ngrx/store';
import {AuthenticationState} from './authentication/authentication.state';
import {ContextState} from './context/context.state';
import {RouterState} from './router/router.state';
import {PartnerState} from './partner/partner.state';

export const selectAuthenticationState = createFeatureSelector<AuthenticationState>('authenticateState');
export const selectContextState = createFeatureSelector<ContextState>('contextState');
export const selectPartnerState = createFeatureSelector<PartnerState>('partnerState');
export const selectRouterState = createFeatureSelector<RouterState>('routerState');
