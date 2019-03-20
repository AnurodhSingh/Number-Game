import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import * as CONST from './Const';

/**
 * Function to scale a value based on the size of the screen size and the original
 * size used on the design.
 */
export default function (units = 1) {
	return width / CONST.SCREEN_WIDTH * units;
}


const verticalScale = size => height / CONST.SCREEN_HEIGHT * size;

export { verticalScale };