import {createAction, props} from '@ngrx/store';
import {createName} from '../action';
import {PartnerState} from './partner.state';
import {Partner} from '../../model/Partner';

export const loadPartner = createAction(
    createName('Gastro Dashboard', 'Load Partner')
);

export const successLoadingPartner = createAction(
    createName('Gastro Dashboard', 'Loaded Partner'),
    props<{ partner: Partner }>()
);

export const errorLoadingPartner = createAction(
    createName('Gastro Dashboard', 'Error loading Partner'),
    props<{ error: any }>()
);
