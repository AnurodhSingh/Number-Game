import { NavigationActions, StackActions } from 'react-navigation';

export default function (toRoute, navigation) {
	const resetAction = StackActions.reset({
		index: 0,
		actions: [
			NavigationActions.navigate({ routeName: toRoute })
		]
	});
	navigation.dispatch(resetAction);
}

