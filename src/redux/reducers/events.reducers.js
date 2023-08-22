import { EVENTS_LIST } from '../actionType';

const initialState = {
    events: []
}

const EventsReducers = (state = initialState, action)=>{
    switch (action.type) {
        case EVENTS_LIST:
            return { ...state, events: action.payload}
        default: return state 
    }
}

export default EventsReducers;