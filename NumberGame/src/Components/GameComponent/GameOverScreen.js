import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, SafeAreaView} from 'react-native';
import scale, { verticalScale } from './../../utils/scale';
import {NavigationActions, StackActions} from 'react-navigation';
import AntDesign from  'react-native-vector-icons/AntDesign';
import * as levelAction from './../../actions/levelAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sound from 'react-native-sound';

type Props = {};
class GameOverScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      success: this.props.navigation.state.params.success,
      levelOfDifficulty: this.props.navigation.state.params.success?this.props.navigation.state.params.levelOfDifficulty+1:this.props.navigation.state.params.levelOfDifficulty
    }
  }

  componentDidMount(){
    let soundType = this.props.navigation.state.params.success ? 'clapping.mp3' : 'boo.mp3';
    Sound.setCategory('Playback');
    var whoosh = new Sound(soundType, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('## failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('## duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
    
      // Play the sound with an onEnd callback
      whoosh.play((success) => {
        if (success) {
          console.log('## successfully finished playing');
        } else {
          console.log('## playback failed due to audio decoding errors');
        }
      });
    });
  }

  resetToGameScreen(){
    let {levelOfDifficulty} = this.state;
    if(levelOfDifficulty==11){
      levelOfDifficulty = 1;
    }
    const resetAction = StackActions.reset({
      index: 0,
      actions: [ 
          NavigationActions.navigate({ 
              routeName: 'GameScreen',      
              params: {
                levelOfDifficulty
              } 
          })
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  resetToHomeScreen(){
    const resetAction = StackActions.reset({
      index: 0,
      actions: [ 
          NavigationActions.navigate({ 
              routeName: 'GameLobbyScreen',      
          })
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    let {levelOfDifficulty, success} = this.state;
    return (
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <TouchableOpacity
          style={styles.homeButtonStyle}
          onPress={()=>{this.resetToHomeScreen()}}
        >
            <Text
              style={styles.homeButtonText}
            >
              {'HOME '}
            </Text>
            <AntDesign name={'home'} color={'white'} size={30}/>
        </TouchableOpacity>
        <View style={styles.container}>
            <Text style={[styles.headerText, {color : success ? 'green' : 'red'}]}>
              {success ? (levelOfDifficulty<11 ? "Hurray, You Won !!!" : "Congrats, You Have Completed All The Levels !!!") :"AHHH, Game Over !!!"}
            </Text>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={()=>{this.resetToGameScreen()}}
            >
                <Text
                 style={styles.buttonText}
                >
                  {success ? (levelOfDifficulty<11 ? "Try Next Level" : "Start Again" ) :"Try Again"}
                </Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor:'white'
  },
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  },
  headerText: {
    fontSize: scale(30),
    textAlign: 'center',
    margin: scale(10),
  },
  buttonText: {
    fontSize: scale(16),
    textAlign: 'center',
    color:'black',
  },
  buttonStyle:{
    backgroundColor:'#8EF0E7',
    paddingHorizontal:scale(20),
    paddingVertical:scale(15),
    borderRadius: scale(10)
  },
  homeButtonStyle:{
    flexDirection:'row',
    backgroundColor:'#8EF0E7',
    marginTop:verticalScale(20),
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    padding:scale(10),
    borderRadius: scale(10),
    width:scale(120)
  },
  homeButtonText:{
    fontSize: scale(20),
    textAlign: 'center',
    color:'black',
  },
});
function mapStateToProps(state) {
	const { LevelReducer } = state;
	return {

	};
}

const mapDispatchToProps = (dispatch) => {
	return {
    levelAction: bindActionCreators(levelAction,dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GameOverScreen);