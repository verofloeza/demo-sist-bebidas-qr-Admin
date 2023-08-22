import { USERS_LIST } from '../actions/users.actions';

const initialState = {
    usuarios: []
}

const UsersReducers = (state = initialState, action)=>{
    switch (action.type) {
        case USERS_LIST:
            return { ...state, usuarios: action.payload}
        default: return state 
    }
}

export default UsersReducers;