import { DRINKS_LIST } from '../actionType';

const initialState = {
    drinks: []
}

const DrinksReducers = (state = initialState, action)=>{
    switch (action.type) {
        case DRINKS_LIST:
            return { ...state, drinks: action.payload}
        default: return state 
    }
}

export default DrinksReducers;