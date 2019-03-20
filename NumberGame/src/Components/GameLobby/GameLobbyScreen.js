import React, {Component} from 'react';
import {
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  View, 
  SafeAreaView, 
  Animated, 
  Easing, 
  Image, 
  FlatList, 
  Alert
} from 'react-native';
import scale from './../../utils/scale';
import * as CONST from './../../utils/Const';
import Foundation from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NavigationActions, StackActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as levelAction from './../../actions/levelAction';

type Props = {};
class GameLobbyScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      levelOfDifficulty: this.props.currentLevel,
    }
    this.animate = new Animated.Value(0);
  }

  componentDidMount(){
    setInterval(()=>{
      this.motion();
    },2000);

    setTimeout(()=>{
      this.flatListRef && this.flatListRef.scrollToIndex({animated: true, index: (this.props.currentLevel-1)})
    },1000);
  }

  motion(){
    this.animate.setValue(0)
      Animated.timing(
        this.animate,
        {
          toValue: 1,
          duration: 250,
          easing: Easing.linear
        }
      ).start();
  }

  resetToGameScreen(){
    let { levelOfDifficulty } = this.state;
    this.props.levelAction.setcurrentLevel(levelOfDifficulty);
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

  resetGame(){
    Alert.alert(
      'WARNING',
      'Are you sure you want to reset the game ?',
      [
        {
          text: 'Cancel', onPress: () => {			

          }
        },
        {
          text: 'Ok', onPress: () => {			
            this.props.levelAction.resetGame();
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
        }
      ]
    );
  }

  renderResetButton() {
    return (
      <TouchableOpacity
          style={styles.buttonStyle}
          onPress={()=>{this.resetGame()}}
      >
          <Text
            style={styles.buttonText}
          >
            {'Reset Game'}
          </Text>
      </TouchableOpacity>
    );
  }

  renderStartButton() {
    let rotate = '0deg';
    rotate = this.animate.interpolate({
      inputRange: [0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1],
      outputRange: ['0deg', '15deg', '0deg', '-15deg', '0deg', '15deg','0deg', '-15deg', '0deg', '15deg', '0deg']
    });
    return (
      <Animated.View style={{marginBottom:scale(20), transform:[{rotate}]}}>
        <TouchableOpacity
            style={styles.buttonStyle}
            onPress={()=>{this.resetToGameScreen()}}
        >
            <Text
              style={styles.buttonText}
            >
              {'Start Game'}
            </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  renderLevel(item,index){
    let { levelOfDifficulty } = this.state;
    let { levelNo, locked, type, completed, completionTime} = item;
    let star=[false,false,false];
    if(completionTime>=((index+1)*20)){
      star=[true,true,true];
    }
    else if(completionTime>=((index+1)*10)){
      star=[true,true,false];
    }
    else{
      star=[true,false,false];
    }
    return (
      <TouchableOpacity
        style={{paddingVertical:scale(5), paddingHorizontal:scale(15), backgroundColor:(levelOfDifficulty==(index+1))?'#8EF0E7':'#3493DF',borderWidth:1,borderRadius:scale(10),margin:scale(10)}}
        onPress={()=>{this.setState({levelOfDifficulty: (index+1)})}}
        activeOpacity={1}
        disabled={locked}
      >
        <Text style={styles.buttonText}>{levelNo}</Text>
        <Image
          style={{height:scale(120),width:scale(120),borderRadius:scale(10)}}
          source={CONST['LEVEL'+(index+1)]}
        />
        {!locked && completed &&
          <View style={{flexDirection: 'row', justifyContent:'space-between', paddingHorizontal:scale(10)}}>
            {
              star.map((object,index)=>{
                return(
                  object ? 
                  <AntDesign key={index} name={'star'} size={25} color={'#f4e241'}/>
                  :
                  <AntDesign key={index} name={'staro'} size={25} color={'grey'}/>
                )
              })
            }
          </View>
        }
        {
          locked && 
          <View style={{position:'absolute', height:scale(178),width:scale(150),borderRadius:scale(10), backgroundColor:'rgba(156,156,156,.7)',justifyContent:'center', alignItems:'center'}}>
            <Foundation name={'lock'} size={100} color={'grey'}/>  
          </View>
        }
      </TouchableOpacity>
    );
  }

  renderLevels(){
    return (
      <View style={{height: scale(200), margin: scale(20)}}>
        <FlatList
          data={this.props.levels}
          extraData={this.state.levelOfDifficulty}
          ref={(ref) => {this.flatListRef = ref;}}
          keyExtractor={item =>item.levelNo}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item,index})=>
            this.renderLevel(item,index)
          }
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <View style={styles.container}>
          {this.renderLevels()}
          {this.renderStartButton()}
          {this.renderResetButton()}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
    safeAreaViewContainer: {
      flex: 1,
      backgroundColor:'#3493FF',
      justifyContent:'center',
      alignItems:'center',
    },
    container: {
      flex: 1,
      justifyContent:'center',
      alignItems:'center',
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
});

function mapStateToProps(state) {
	const { LevelReducer } = state;
	return {
    currentLevel: LevelReducer.currentLevel,
    levels: LevelReducer.levels
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
    levelAction: bindActionCreators(levelAction,dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GameLobbyScreen);