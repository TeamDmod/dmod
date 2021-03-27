import userReducer from './userReducer';
import {combineReducers} from 'redux';

const root = combineReducers({
    user: userReducer  
});

export default root;