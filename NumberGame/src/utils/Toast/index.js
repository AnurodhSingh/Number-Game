import Toast from 'react-native-root-toast';
import {verticalScale} from './../scale';

export default function showToast(msg) {
	Toast.show(`${msg}`, { 
		position: -1, 
		duration: Toast.durations.SHORT, 
		animation: true, 
		hideOnPress: true, 
		opacity: 0.7,
		containerStyle:{marginBottom: verticalScale(30)}
	});
}
