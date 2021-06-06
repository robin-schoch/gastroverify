import {createSelector} from '@ngrx/store';
import {selectContextState, selectPartnerState} from '../selector';

export const selectPartner = createSelector(
    selectPartnerState,
    (partnerState) => partnerState.partner
);

export const selectPartnerLocation = createSelector(
    selectPartner,
    (partner) => partner.locations
)
