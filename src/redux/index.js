import Cart from './reducers/cart.reducers';
import Customizer from './customizer/reducer'
import DrinksReducers from './reducers/drinks.reducers';
import Ecommerce from './reducers/products.reducers';
import EventsReducers from './reducers/events.reducers';
import Filters from './reducers/filters.reducers'
import OrdersReducers from './reducers/orders.reducers';
import UsersReducers from './reducers/users.reducers';
import Wishlist from './reducers/whishlist.reducers';
import {combineReducers} from 'redux'

const reducers = combineReducers({
    Customizer,
    data: Ecommerce,
    Wishlistdata: Wishlist,
    Cartdata: Cart,
    filters: Filters,
    usuarios: UsersReducers,
    drinks: DrinksReducers,
    orders: OrdersReducers,
    events: EventsReducers
});

export default reducers;