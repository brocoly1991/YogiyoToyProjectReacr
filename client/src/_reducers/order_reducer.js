import {
    SELECT_ORDER_NO,
    SELECT_ORDER_LIST,
    SLEECT_ORDER_STORE_LIST,
    MODIFY_ORDER_STORE_LIST
} from '../_actions/types';


export default function (state = {}, action) {
    
    switch (action.type) {
        case SELECT_ORDER_NO:
            return { ...state, order: action.payload.order }
        case SELECT_ORDER_LIST:
            return { ...state, selectOrderList: action.payload.order }
        case SLEECT_ORDER_STORE_LIST:
            return { ...state, selectOrderStroeList: action.payload.orderList }
        case MODIFY_ORDER_STORE_LIST:
            return { ...state, modifyOrderStroeList: action.payload.orderList }
        default:
            return state;
    }

}