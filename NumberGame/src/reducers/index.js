import { combineReducers } from 'redux';
import CommonReducer from './CommonReducer';
import LevelReducer from './LevelReducer';

export default combineReducers({
	CommonReducer,
	LevelReducer,
});