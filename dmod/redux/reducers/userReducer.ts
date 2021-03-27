import  {LOGIN, LOGOUT} from '../actions/login';

const userReducer = (state = {}, action) => {
    switch(action.type){
        case LOGIN:
            return state = action.payload;
        case LOGOUT:
            return state = {};
        default:
            return state
    }
}

export default userReducer;