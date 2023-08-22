import { ORDERS_LIST } from '../actionType';

const INIT_STATE = {
    cart:[]
  };

const OrdersReducers = (state = INIT_STATE, action) => {
    switch(action.type) {
        case ORDERS_LIST:
            return { ...state, cart: action.payload};
        default:
            return state;
    }
        
}

export default OrdersReducers;