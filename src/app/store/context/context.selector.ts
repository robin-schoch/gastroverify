import {createSelector} from '@ngrx/store';
import {selectAuthenticationState, selectContextState} from '../selector';

export const selectCurrentLanguage = createSelector(
    selectContextState,
    (ctx) => ctx.currentLanguage
);

export const selectLanguages = createSelector(
    selectContextState,
    (ctx) => ctx.languages
);

export const selectToolbar = createSelector(
    selectContextState,
    (ctx) => ctx.toolbar
);


export const selectToolbarHidden = createSelector(
    selectToolbar,
    (ctx) => ctx.hidden
);


export const selectToolbarTitle = createSelector(
    selectToolbar,
    (ctx) => ctx.title
);
