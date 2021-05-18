import {
    SAVE_MENU_GROUP,
    GET_MENU_GROUP,
    MODIFY_MENU_INFO,
    MENU_ORDER_STORAGE,
    MENU_ORDER_ID
} from '../_actions/types';


export default function (state = {}, action) {
    switch (action.type) {
        case SAVE_MENU_GROUP:
            return { ...state, menuGroup: action.payload }          
        case GET_MENU_GROUP:
            return { ...state, menuGroupInfo: action.payload } 
        case MODIFY_MENU_INFO:
            return { ...state, menu: action.payload }       
        case MENU_ORDER_STORAGE:
            return { ...state, menuOrderStorage: action.payload}    
    default:
        return state;
    }
}