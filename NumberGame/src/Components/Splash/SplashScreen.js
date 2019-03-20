import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, SafeAreaView, Dimensions, Animated, Easing} from 'react-native';
import scale from './../../utils/scale';
import {COLORS} from './../../utils/Const';
import {NavigationActions, StackActions} from 'react-navigation';
import { FlatList } from 'react-native-gesture-handler';
const { height, width } = Dimensions.get('window');
type Props = {};
let that=[];
let counter=0;
export default class SplashScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.size = (width/6);
    this.numberOfBoxes = Math.floor(height/(this.size+20))*5;
    this.number=[this.numberOfBoxes];
    counter=0;
    for(let i=1;i<=this.numberOfBoxes;i++){
      this.number[i-1]=i;
    }
    this.number = this.shuffle(this.number);
  }

  shuffle(number) {
    for(var j, x, i = number.length; i; j = parseInt(Math.random() * i), x = number[--i], number[i] = number[j], number[j] = x);
      return number;
  };

  componentDidMount(){
    let j=0;
    this.animation1 = setInterval(() => {
      if(j <= (counter+15)){
        let k = j;
        let count = 0;
        while(k >= 0 && count<5){
          if(that[k]){
            that[k].setState({motion: true});
            that[k].motion();
          }
          count++;
          k = k-4;
        }
        j = j+5;
      }
    },100);

    this.animation2 = setInterval(() => {
      if(j <= (counter+15)){
        let k = j;
        let count = 0;
        while(k >= 0 && count<5){
          if(that[k]){
            that[k].setState({motion: true});
            that[k].motion();
          }
          count++;
          k = k-4;
        }
        j = j+5;
      }
    },150);

    this.animation3 = setInterval(() => {
      if(j <= (counter+15)){
        let k = j;
        let count = 0;
        while(k >= 0 && count<5){
          if(that[k]){
            that[k].setState({motion: true});
            that[k].motion();
          }
          count++;
          k = k-4;
        }
        j = j+5;
      }
    },300);

    setTimeout(() => {
      clearInterval(this.animation1);
      clearInterval(this.animation2);
      clearInterval(this.animation3);
      this.resetToGameScreen();
    }, ((this.numberOfBoxes)*50));
  }

  resetToGameScreen(){
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
    return (
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <View style={styles.mainContainer}>
          <FlatList
            contentContainerStyle={styles.mainContainer}
            numColumns={5}
            data={this.number}
            keyExtractor={item =>item}
            renderItem={({item,index})=>{
                return(
                  <Box size={this.size} item={item}/>
                );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
  componentWillUnmount(){
    clearInterval(this.animation1);
    clearInterval(this.animation2);
    clearInterval(this.animation3);
  }
}
class Box extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      size : this.props.size,
      item : this.props.item,
      motion: false
    }
    that[counter++]=this;
    this.animate = new Animated.Value(0)
  }

  motion(){
    this.animate.setValue(0)
      Animated.timing(
        this.animate,
        {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear
        }
      ).start();
  }

  stopMotion(){
    this.animate.setValue(1);
    this.animate.stopAnimation();
  }

  render() {
    let { size, item, motion } = this.state;
    let scale = 1;
    let color = '#3493FF';
    if(motion){
      scale = this.animate.interpolate({
        inputRange: [0, 0.50, 1],
        outputRange: [1, 1.5, 1]
      });
      color = this.animate.interpolate({
        inputRange: [0, 1],
        outputRange: ['#8EF0E7','#3493FF']
      });
    }
    
    return (
      <Animated.View style={{height:size, width: size, justifyContent:'center',alignItems:'center',margin:5, backgroundColor:color, borderWidth:.5, borderBottomColor:'black', transform:[{scale}]}}>
        <Text style={styles.buttonText}>{item}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor:'#3493FF',
  },
  mainContainer:{
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonText: {
    fontSize: scale(16),
    textAlign: 'center',
    color:'black',
  },
});
