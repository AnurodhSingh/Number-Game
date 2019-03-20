import React from 'react';
import { Image, Easing, Animated } from 'react-native';
import SplashScreen from './Components/Splash/SplashScreen';
import GameScreen from './Components/GameComponent/GameScreen';
import GameOverScreen from './Components/GameComponent/GameOverScreen';
import GameLobbyScreen from './Components/GameLobby/GameLobbyScreen';
import { createStackNavigator ,createDrawerNavigator} from 'react-navigation';

const screenTransition = {
	transitionSpec: {
		duration: 1000,
		easing: Easing.out(Easing.poly(4)),
		timing: Animated.timing,
	},
	screenInterpolator: sceneProps => {
		const { layout, position, scene } = sceneProps;
		const { index } = scene;

		const height = layout.initHeight;
		const translateY = position.interpolate({
			inputRange: [index - 1, index, index + 1],
			outputRange: [height, 0, 0],
		});

		const opacity = position.interpolate({
			inputRange: [index - 1, index - 0.99, index],
			outputRange: [0, 1, 1],
		});
		
		const modalTransition =  { opacity, transform: [{ translateY }] };
		const normalTransition =  { opacity, transform: [{ translateX: translateY }] };

		if ((typeof scene.route.params !== 'undefined') && (typeof scene.route.params.isModal !== 'undefined') && scene.route.params.isModal) {
			return modalTransition;
		}
		return normalTransition;
	},
};

export default createStackNavigator({
	SplashScreen: { screen: SplashScreen, navigationOptions: { header: null } },
	GameLobbyScreen: { screen: GameLobbyScreen, navigationOptions: { header: null } },
	GameScreen: { screen: GameScreen, navigationOptions: { header: null } },
	GameOverScreen: { screen: GameOverScreen, navigationOptions: { header: null } },
}, {
	transitionConfig: () => (screenTransition)
},);	
