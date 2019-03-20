import * as CONST from '../utils/Const';

const initialState = {
	isFetching: false,
	internetStatus:true,
};

// This reducer stores the state of common spinner and modal.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.START_SPINNER:
		return {
			...state,
			isFetching: true
		};
	case CONST.STOP_SPINNER:
		return {
			...state,
			isFetching: false
		};
	case CONST.INTERNET_STATUS:
		return {
			...state,
			internetStatus: action.payload,
		};
	default:
		return state;
	}
}
