import * as CONST from './../utils/Const';

export function setcurrentLevel(level) {
	return { 
        type: CONST.CURRENT_LEVEL,
        payload: level 
    };
}
export function levelCompleted(level) {
	return { 
        type: CONST.LEVEL_COMPELTED,
        payload: level 
    };
}

export function levelUnlock(level) {
	return { 
        type: CONST.LEVEL_UNLOCK, 
        payload: level
    };
}

export function updateCompletionTime(level ,time) {
	return { 
		type: CONST.UPDATE_COMPLETION_TIME,
		payload: {
            level,
            time
        }
	};
}

export function resetGame() {
	return { 
        type: CONST.RESET_GAME,
	};
}