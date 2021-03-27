import {createStore} from 'redux';
import root from './reducers/rootReducer';

const store = createStore(root);

export default store;