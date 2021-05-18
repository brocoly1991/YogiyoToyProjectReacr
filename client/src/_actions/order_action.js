import axios from 'axios';

import {
    SELECT_ORDER_NO,
    SELECT_ORDER_LIST,
    SLEECT_ORDER_STORE_LIST,
    MODIFY_ORDER_STORE_LIST,
    SAVE_ORDER,
} from './types';

import { BUSNES_SERVER } from '../components/Config.js';

export function getOrderNo(_id) {
    const request = axios.get(`${BUSNES_SERVER}/getOrderNo?no=${_id}`)  
        .then(response => response.data);
    return {
        type: SELECT_ORDER_NO,
        payload: request
    }
}

export function getOrderList(body) {
    // const request = axios.get(`${BUSNES_SERVER}/getOrderList?userId=${body.userId}?skip=${body.skip}?limit=${body.limit}`) 
    const request = axios.post(`${BUSNES_SERVER}/getOrderList` ,body) 
        .then(response => response.data);
    return {
        type: SELECT_ORDER_LIST,
        payload: request
    }
}

export function getOrderStroeList(body) {
    const request = axios.post(`${BUSNES_SERVER}/getOrderStroeList` ,body)  
        .then(response => response.data);
    return {
        type: SLEECT_ORDER_STORE_LIST,
        payload: request
    }
}

export function modifyOrderStroeList(body) {
    const request = axios.post(`${BUSNES_SERVER}/modifyOrderStroeList` ,body)  
        .then(response => response.data);
    return {
        type: MODIFY_ORDER_STORE_LIST,
        payload: request
    }
}








