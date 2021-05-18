import axios from 'axios';


import {
    SELECT_REVIEW_LIST,
} from './types';

import { BUSNES_SERVER } from '../components/Config.js';


// getReviewList
export function getReviewList(body) {
    const request = axios.post(`${BUSNES_SERVER}/getReviewList` ,body) 
        .then(response => response.data);
    return {
        type: SELECT_REVIEW_LIST,
        payload: request
    }

}

