import {AuthenticationState} from './authentication/authentication.state';
import {ActionReducerMap} from '@ngrx/store';
import {authenticationReducer} from './authentication/authentication.reducer';
import * as fromRouter from '@ngrx/router-store';
import {RouterState} from './router/router.state';
import {routerReducer} from '@ngrx/router-store';
import {ContextState} from './context/context.state';
import {contextReducer} from './context/context.reducer';
import {PartnerState} from './partner/partner.state';
import {partnerReducer} from './partner/partner.reducer';


export interface RootState {
  authenticateState: AuthenticationState,
  contextState: ContextState,
  routerState: fromRouter.RouterReducerState<RouterState>;
  partnerState: PartnerState
}
export const reducers: ActionReducerMap<RootState> = {
  authenticateState: authenticationReducer,
  contextState: contextReducer,
  routerState: routerReducer,
  partnerState: partnerReducer
};
