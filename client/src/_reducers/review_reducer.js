import {
    SELECT_REVIEW_LIST,
    SAVE_REVIEW,
} from '../_actions/types';

export default function (state = {}, action) {
    
    switch (action.type) {
        case SELECT_REVIEW_LIST:
            return { ...state, review: action.payload.review }
        default:
            return state;
    }

}