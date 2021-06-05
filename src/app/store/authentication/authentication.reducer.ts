import {initialState} from './authentication.state';
import {createReducer} from '@ngrx/store';

const reducer = createReducer(
    initialState
);

export const authenticationReducer = (state, action) => {
  return reducer(state, action);
};
