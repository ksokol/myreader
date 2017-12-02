import {combineReducers} from 'redux';
import {settingsReducers} from './settings/settings.reducers';
import {commonReducers} from './common/common.reducers';

export const reducers = combineReducers({
    common: commonReducers,
    settings: settingsReducers
});
