import * as CONST from './../utils/Const';

const initialState = {
	currentLevel: 1,
	levels:[
		{ levelNo:'Level 1', locked:false, completed:false, completionTime:0, type:'tutorial' },
		{ levelNo:'Level 2', locked:false, completed:false, completionTime:0, type:'tutorial' },
		{ levelNo:'Level 3', locked:false, completed:false, completionTime:0, type:'tutorial' },
		{ levelNo:'Level 4', locked:true, completed:false, completionTime:0, type:'easy' },
		{ levelNo:'Level 5', locked:true, completed:false, completionTime:0, type:'easy' },
		{ levelNo:'Level 6', locked:true, completed:false, completionTime:0, type:'medium' },
		{ levelNo:'Level 7', locked:true, completed:false, completionTime:0, type:'medium' },
		{ levelNo:'Level 8', locked:true, completed:false, completionTime:0, type:'hard' },
		{ levelNo:'Level 9', locked:true, completed:false, completionTime:0, type:'hard' },
		{ levelNo:'Level 10', locked:true, completed:false, completionTime:0, type:'expert' },
	]
};

// This reducer stores the state of common spinner and modal.
export default function (state = initialState, action) {
	let updatedLevels = [];
	switch (action.type) {
	case CONST.CURRENT_LEVEL:
		return {
			...state,
			currentLevel: action.payload
		};
	case CONST.LEVEL_COMPELTED:
		updatedLevels = state.levels.map((item,index)=>{
			if((action.payload-1)==index){
				return {...item, completed:true};
			}
			return item;
		});
		return {
			...state,
			levels: updatedLevels
		};
	case CONST.LEVEL_UNLOCK:
		updatedLevels = state.levels.map((item,index)=>{
			if((action.payload-1)==index){
				return {...item, locked:false};
			}
			return item;
		});
		return {
			...state,
			levels: updatedLevels
		};
	case CONST.UPDATE_COMPLETION_TIME:
		updatedLevels = state.levels.map((item,index)=>{
			if(((action.payload.level)-1)==index){
				return {...item, completionTime:action.payload.time};
			}
			return item;
		});
		return {
			...state,
			levels: updatedLevels
		};
	case CONST.RESET_GAME:
		return initialState
	default:
		return state;
	}
}
