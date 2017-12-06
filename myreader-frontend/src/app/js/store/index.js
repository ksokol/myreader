import {combineReducers} from 'redux';
import {settingsReducers} from './settings/index';
import {commonReducers} from './common/index';
import {securityReducers} from "./security/index";

export const reducers = combineReducers({
    security: securityReducers,
    common: commonReducers,
    settings: settingsReducers
});
