import React, {Component} from 'react';
import {
  StyleSheet,
  Text, 
  View, 
  SafeAreaView,
  BackHandler
} from 'react-native';
import Approot from './src/Approot';
import showToast from './src/utils/Toast/index';
import { Provider } from 'react-redux'
import configureStore from './src/configureStore';
import { createAppContainer} from 'react-navigation';
let exitApp = false;
type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      store: configureStore(() => {
      }).store
    }
    exitApp = false;
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if(!exitApp){
      showToast('Press again to exit app');
      exitApp = true;
      setTimeout(()=>{
        exitApp = false;
      },2000);
      return true;
    }
    else{
      BackHandler.exitApp();
    }
  }

  render() {
    const AppContainer = createAppContainer(Approot);
    return (
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <Provider store={this.state.store}>
          <View style={styles.container}>
            <AppContainer/>
          </View>
        </Provider>
      </SafeAreaView>
    );
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
}

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor:'white'
  },
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
