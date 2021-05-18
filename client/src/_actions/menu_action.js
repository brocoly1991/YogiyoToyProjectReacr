import axios from 'axios';

import {
    SAVE_MENU_GROUP,
    GET_MENU_GROUP,
    MODIFY_MENU_INFO,
    MENU_ORDER_STORAGE,
} from './types';


import { MENU_SERVER } from '../components/Config.js';



export function saveMenuGroup(body) {
    const request = axios.post(`${MENU_SERVER}/saveMenuGroup`, body)  
        .then(response => response.data);
    return {
        type: SAVE_MENU_GROUP,
        payload: request
    }
}


export function getMenuGroupItems(_id) {
    
    const request = axios.get(`${MENU_SERVER}/getMenuGroup?id=${_id}`)  
        .then(response => response.data);
    return {
        type: GET_MENU_GROUP,
        payload: request
    }
}


export function modifyMenuInfo(body) {
    const request = axios.post(`${MENU_SERVER}/modifyMenuInfo`, body)  
        .then(response => response.data);
    return {
        type: MODIFY_MENU_INFO,
        payload: request
    }
}

export function menuOrderStorage(body) {
    return {
        type: MENU_ORDER_STORAGE,
        payload: body 
    }
}


