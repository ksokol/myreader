import {combineReducers} from 'redux';
import {settingsReducers} from './settings/settings.reducers';

export const reducers = combineReducers({
    settings: settingsReducers
});
