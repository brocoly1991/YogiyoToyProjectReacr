import { combineReducers } from 'redux';
import user from './user_reducer';
import menu from './menu_reducer';
import order from './order_reducer';
import review from './review_reducer';
const rootReducer = combineReducers({
    user,menu,order,review
});

export default rootReducer;