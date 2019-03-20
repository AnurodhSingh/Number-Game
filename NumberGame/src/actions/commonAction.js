import * as CONST from '../../utils/Const';

// This action starts the common spinner.
export function startSpinner() {
	return { type: CONST.START_SPINNER };
}
// This action stops the common spinner.
export function stopSpinner() {
	return { type: CONST.STOP_SPINNER };
}
// This action tells the status of internet.
export function internetStatus(type) {
	return { 
		type: CONST.INTERNET_STATUS,
		payload: type, 
	};
}