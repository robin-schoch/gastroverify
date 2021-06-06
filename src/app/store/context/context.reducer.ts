import {createReducer, on} from '@ngrx/store';
import {initialState} from './context.state';
import {setLanguage, setToolbarHidden, setToolbarTitle} from './context.action';


const reducer = createReducer(
    initialState,
    on(setLanguage, (state, {short}) => (
        {...state, currentLanguage: state.languages.find(l => l.short === short)}
    )),
    on(setToolbarTitle, (state, {title}) => (
        {...state, toolbar: {...state.toolbar, title}}
    )),
    on(setToolbarHidden, (state, {hidden}) => (
        {...state, toolbar: {...state.toolbar, hidden}}
    ))
);


export const contextReducer = (state, action) => reducer(state, action);
