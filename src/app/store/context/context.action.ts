import {createAction, props} from '@ngrx/store';
import {createName} from '../action';

export const setLanguage = createAction(
    createName('App Component', 'Set Language'),
    props<{ short: string}>()
);

export const rehydrateLanguages = createAction(
    createName('App Component', 'Rehydrate Languages ')
);


export const setToolbarHidden =  createAction(
    createName('App Component', 'Set Toolbar Hidden'),
    props<{ hidden: boolean}>()
);

export const setToolbarTitle =  createAction(
    createName('App Component', 'Set Toolbar Title'),
    props<{ title: string}>()
);
