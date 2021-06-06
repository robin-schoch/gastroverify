import {initialState} from './partner.state';
import {createReducer, on} from '@ngrx/store';
import {errorLoadingPartner, loadPartner, successLoadingPartner} from './partner.action';

const reducer = createReducer(
    initialState,
    on(loadPartner, (state) => ({...state, loading: true})),
    on(successLoadingPartner, (state, {partner}) => ({...state, partner})),
    on(errorLoadingPartner, (state, {error}) => ({...state, error}))
);

export const partnerReducer = (state, action) => reducer(state, action);
