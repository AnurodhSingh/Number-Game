import React, { Component } from 'react';
import {
  Easing,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  Text,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import scale, { verticalScale } from './../../utils/scale';
import {NavigationActions, StackActions} from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as levelAction from './../../actions/levelAction';

let that=[];
let counter=0;
let currentNumber=0;
let number = [];
let prevHintType=-1;

class Number extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: false,
      motion: false
    };
    that[counter++]=this;
    this.hintMotion = new Animated.Value(0);
  }

  motion(){
    this.hintMotion.setValue(0)
    Animated.timing(
      this.hintMotion,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear
      }
    ).start();
  }

  stop(){
    this.hintMotion.setValue(1)
    this.hintMotion.stopAnimation();
  }

  onPressNumber(item){
    if(currentNumber == item){
      this.setState({selected:true});
      this.props.selected(item);
    }
    else{
      this.props.selected(item);
    }
  }

  render(){
    let { selected, motion} = this.state;
    let { item ,fontSize, windowSize } = this.props;
    let size = 1;
    if(motion){
      size = this.hintMotion.interpolate({
        inputRange: [0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1],
        outputRange: [1, 0.6, 1, 0.6, 1, 0.6, 1, 0.6, 1, 0.6, 1]
      })
    }
    else{
      size = 1;
    }
    return(
      <Animated.View style={{ transform:[{scale:size}]}}>
        <TouchableOpacity
          disabled={selected}
          onPress={()=>{this.onPressNumber(item)}}
          style={[ styles.numberColor, { height:windowSize, width:windowSize, backgroundColor:selected ? 'grey':'#8EF0E7', borderColor:'black', borderWidth:0.2}]}
        >    
          <Text style={{ fontSize: fontSize || 16, color:selected ? 'white': 'black' }}>
            {item.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

class Counter extends Component
{
  constructor(props){
    super(props);
    this.state = {
      startFrom: this.props.seconds,
      timeDifference: 0,
      currentNumber: 0
    };
  }
  componentDidMount(){
    this.startTimer();
    this.setState({currentNumber:currentNumber});
    let that = this;
    this.props.getRef(that);
  }

  getCurrentTime(){
    let {startFrom} = this.state;
    return startFrom;
  }

  startTimer(){
    this.a = setInterval(() => { 
      if(this.state.startFrom<=0){
        this.props.timeOver();
        clearInterval(this.a);
      }
      else{
        let {timeDifference} = this.state
        timeDifference=timeDifference+1;
        if(this.state.currentNumber!=currentNumber){
          timeDifference=0;
        }
        if(timeDifference >= 10){
          this.props.tenSecondCallBack();
          timeDifference=0;
        }
        this.setState({startFrom: (this.state.startFrom-1), timeDifference, currentNumber: currentNumber});
      }
    }, 1000);
  }
  showTime(){
    let { startFrom } = this.state;
    let min = "" + Math.floor (startFrom/60)
    let sec = "" + startFrom%60;

    min = (min.length<2) ? ((min.length<1) ? "00" : ("0" + min) ) : min;
    sec = (sec.length<2) ? ((sec.length<1) ? "00" : ("0" + sec) ) : sec;

    return (min)+":"+(sec).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  }
  render(){
    return(
      <Text style={styles.textStyle}>
        {this.showTime()}
      </Text>
    )
  }

  componentWillUnmount(){
    clearInterval(this.a); 
  }

}

class GameScreen extends Component {
  constructor(props){
      super(props);
      this.state = {
        timeOver: false,
        currentNumber: 0,
        row: 0,
        column: 0,
        lives: [true,true,true],
        showHint: false,
        hintType: -1,
      };
      that=[];
      counter=0;
      number=[];
      currentNumber=0;
      prevHintType=-1;
      this.levelOfDifficulty = this.props.navigation.state.params.levelOfDifficulty || 10
      for(let i=1;i<=this.levelOfDifficulty*this.levelOfDifficulty;i++){
        number[i-1]=i;
      }
      number = this.shuffle(number);
      this.number = JSON.parse(JSON.stringify(number));
      this.hintMotion = new Animated.Value(0)
      this.counter = null; 
  }

  componentDidMount(){
    this.generateRandom();
    this.motion();
  }

  motion(){
    this.hintMotion.setValue(0)
      Animated.timing(
        this.hintMotion,
        {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear
        }
      ).start(()=>{this.motion()});
  }

  generateRandom(){
    if(currentNumber!=0){
      let index = number.indexOf(currentNumber);
      that[index].setState({motion:false})
      that[index].stop();
    }
    randomNumber = Math.floor(Math.random() * Math.floor(this.number.length));
    currentNumber = this.number[randomNumber];
    let row = (Math.floor(number.indexOf(currentNumber)/this.levelOfDifficulty)+1);
    let column = (Math.floor(number.indexOf(currentNumber)%this.levelOfDifficulty)+1);
    this.setState({ row, column, currentNumber , hintType: -1}); 
  }

  shuffle(number) {
    for(var j, x, i = number.length; i; j = parseInt(Math.random() * i), x = number[--i], number[i] = number[j], number[j] = x);
      return number;
  };

  gameOver(success){
    let levelOfDifficulty = this.levelOfDifficulty;
    this.resetToGameOverScreen(success, levelOfDifficulty);
  }

  resetToGameOverScreen(success, levelOfDifficulty){
    const resetAction = StackActions.reset({
      index: 0,
      actions: [ 
          NavigationActions.navigate({ 
              routeName: 'GameOverScreen',      
              params: {
                success,
                levelOfDifficulty
              } 
          })
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  resetToGameLobbyScreen(){
    Alert.alert(
      'WARNING',
      'Are you sure you want to exit game ?',
      [
        {
          text: 'Cancel', onPress: () => {			

          }
        },
        {
          text: 'Ok', onPress: () => {			
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

  selected(selectedNumber){
    if(selectedNumber==currentNumber){
      this.number.splice(this.number.indexOf(selectedNumber),1)
      if(this.number.length==0){
        let {currentLevel, levels} = this.props;
        let currentTime = this.counter.getCurrentTime(); 
        if(levels[currentLevel-1].completionTime < currentTime){
          this.props.levelAction.updateCompletionTime(currentLevel, currentTime);
        }
        this.props.levelAction.levelCompleted(currentLevel);
        this.props.levelAction.setcurrentLevel(currentLevel+1);
        this.props.levelAction.levelUnlock(currentLevel+1)
        this.gameOver(true);
      }
      else{
        this.generateRandom(false);
      }
    }
    else{
      let {lives} = this.state;
      lives[lives.indexOf(true)]=false;
      this.setState({lives});

      if(!lives[2]){
        this.gameOver(false);
      }
    }
  }

  timeOver(){
    this.setState({timeOver:true});
    this.gameOver(false);
  }

  tenSecondCallBack(){
    let {showHint, hintType} = this.state;
    if(showHint){
      this.setState({hintType: prevHintType})
      if(prevHintType==-1){
        this.setState({ hintType: 0 });
      }
      else if(prevHintType==2){
        let index = number.indexOf(currentNumber);
        that[index].setState({motion:true})
        that[index].motion();
      }
    }
  }

  headerContainer(){
    return(
      <View style={{justifyContent:'center', alignSelf:'stretch', flexDirection:'row'}}>
        <TouchableOpacity style={{position: 'absolute',left:0, height: scale(30), width: scale(50), alignItems:'center'}}
          onPress={()=>{this.resetToGameLobbyScreen()}}
        >
          <Ionicons name={'ios-arrow-back'} color={'black'} size={30}/>
        </TouchableOpacity>
        <Text style={styles.headerTextStyle}>
          {'Level '}{this.levelOfDifficulty}
        </Text>
      </View>  
    )
  }

  timeContainer(timeOver){
    return(
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.textStyle}>
          {'Time Left = '}
        </Text>
        {!timeOver ? 
          <Counter 
            seconds={(this.levelOfDifficulty/2)*60} 
            timeOver={()=>this.timeOver()} 
            getRef={(that)=>(this.counter=that)}
            tenSecondCallBack={()=>this.tenSecondCallBack()}
          /> 
          :
          <Text  style={styles.textStyle}>00:00</Text>}
      </View>  
    )
  }

  livesContainer(lives){
    return(
      <View style={{flexDirection: 'row', alignItems:'center'}}>
        <Text style={styles.textStyle}>
          {'Lives Left = '}
        </Text>
        {lives.map((item,index)=>{
          return(
            lives[2-index] ?
              <MaterialCommunityIcons key={index} name={'heart'} size={scale(16)} color={'red'}/>
              :
              <MaterialCommunityIcons key={index}  name={'heart-broken'} size={scale(16)} color={'grey'}/>
          );
        })}
      </View>
    )
  }

  numberContainer(currentNumber){
    currentNumber = ((currentNumber+'').length<2) ? ('0'+currentNumber) : currentNumber;
    return(
      <View style={{flexDirection: 'row',alignSelf:'center'}}>
        <Text style={styles.textStyle}>
          {'Number : '} 
        </Text>
        <Text style={styles.textStyle}>
          {currentNumber}
        </Text>
      </View>  
    )
  }


  topContainer(){
    let { timeOver, currentNumber, lives } = this.state;
    return(
      <View style={{flexDirection: 'row', alignSelf:'stretch', padding:30, justifyContent:'space-between'}}>
        <View>
          {this.timeContainer(timeOver)}
          {this.livesContainer(lives)}
        </View>
        {this.numberContainer(currentNumber)}
      </View>
    );
  }

  showRightArrows(){
    let {row} = this.state;
    row=row-1;
    const left = this.hintMotion.interpolate({
      inputRange: [0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1],
      outputRange: [10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10]
    })
    return(
      <View key={0} style={{position:'absolute', top: verticalScale((30*row)+row), height:verticalScale(30), width:scale(30), justifyContent:'center'}}>
        <Animated.View style={{left}}> 
          <AntDesign name={'arrowright'} size={16}/>
        </Animated.View>
      </View>
      
    );
  }
  
  showUpArrows(){
    let { column} = this.state;
    const top = this.hintMotion.interpolate({
      inputRange: [0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1],
      outputRange: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0]
    })
    return(
      <View key={1} style={{top: 30*this.levelOfDifficulty, left: scale((30*column)+(column)), position:'absolute', height:verticalScale(30), width:scale(30)}}>
        <Animated.View style={{top}}> 
          <AntDesign style={{alignSelf:'center'}} name={'arrowup'} size={16}/>
        </Animated.View>
      </View>
    );
  }

  showBounce(){
    let { row,column } = this.state;
    row=row-1;
    const size = this.hintMotion.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [ 0.8, 1, 0.8 ]
    })
    return(
      <View key={2} style={{top:verticalScale((30.2*row)+(row+1)), left: scale((30.2*column)+(column)), position:'absolute'}}>
        <Animated.View style={{ opacity: 1, width: scale(30), height: verticalScale(30), borderWidth:scale(1), borderColor:'black', transform:[{scale: size}]}}> 
          
        </Animated.View>
      </View>
    );
  }

  showPosition(){
    let { row, column } = this.state;
    let prefix = ['st','nd','rd','th']
    return(
      <View style={{ flexDirection: 'row',padding:20 }}>
        <Text style={styles.textStyle}>
          {'Position : '}
        </Text>
        <Text style={styles.textStyle}>
          {row}<Text style={styles.superScriptText}>{prefix[(row<=3) ? (row-1) : 3]}</Text> ROW   {column}<Text style={styles.superScriptText}>{prefix[(column<=3) ? (column-1) : 3]}</Text> COLUMN
        </Text>
      </View>
    );
  }

  hintBox(){
    let { showHint } = this.state;
    return(
      <View style={{flexDirection: 'row', width:scale(100), paddingHorizontal:20, justifyContent:'space-between'}}>
        <Text style={styles.textStyle}>
          {'Hints   '} 
        </Text>
        { showHint ? 
          <FontAwesome style={{alignSelf:'center'}} name={'toggle-on'} size ={scale(20)} color={'green'} onPress={()=>this.setState({showHint:false})}/>
          :
          <FontAwesome style={{alignSelf:'center', transform:[{rotateY:'180deg'}]}} name={'toggle-on'} size ={scale(20)} color={'red'} onPress={()=>{prevHintType=-1; this.setState({showHint:true,hintType:0})}}/>
        }
      </View>
    );
  }

  changeHintType(value){
    value = value.find(e => e.selected == true).value;
    if(prevHintType==2){
      let index = number.indexOf(currentNumber);
      that[index].setState({motion:false})
      that[index].stop();
    }
    this.setState({hintType: value});
    prevHintType = value;

    if(value==2){
      let index = number.indexOf(currentNumber);
      that[index].setState({motion:true})
      that[index].motion();
    }
  }

  hintType(){
    let radio_props =[ 
      { label: 'Position',
        value: '0',
        color: 'black',
        disabled: false,
        layout: 'row',
        selected: false,
        size: 24 
      },
      { 
        label: 'Arrows',
        value: '1',
        color: 'black',
        disabled: false,
        layout: 'row',
        selected: false,
        size: 24 
      },
      { label: 'Bounces',
        value: '2',
        color: 'black',
        disabled: false,
        layout: 'row',
        selected: false,
        size: 24 
      } 
    ];
    return(
      <View>
        <RadioGroup 
          radioButtons={radio_props} 
          onPress={(data)=>{this.changeHintType(data)}} 
          flexDirection='row'
          color={'blue'}
        />
      </View>
    )
  }

  render() {
    let { showHint, hintType} = this.state;
    return (
      <View style={styles.container}>
        {this.headerContainer()}
        {this.topContainer()}
        <View style={{ height:320, alignSelf:'stretch', alignItems:'center'}}>
          <View style={{ paddingHorizontal: scale(30)}}>
            <FlatList
              numColumns={this.levelOfDifficulty}
              data={number}
              keyExtractor={item =>item.toString()}
              renderItem={({item})=>{
                  return(
                    <Number 
                      item={item} 
                      fontSize={14}
                      windowSize={30} 
                      selected={(index)=>this.selected(index)} 
                    />
                  );
              }}
            />
            {showHint && (hintType==1) && [
                this.showRightArrows(),
                this.showUpArrows(),
                //(hintType==2) && this.showBounce(),
              ]
            }
          </View>
          { this.hintBox() }
          { showHint && this.hintType() }
          { showHint && (hintType==0) && this.showPosition() }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ecf0f1'
  },
  numberColor: {
    height:verticalScale(30), 
    width:scale(30), 
    backgroundColor:'#8EF0E7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTextStyle:{
    color:'black',
    fontSize:scale(24),
  },
  textStyle:{
    color:'black',
    fontSize:scale(18),
    lineHeight:scale(30),
    textAlignVertical: 'bottom',
  },
  superScriptText:{
    color:'black',
    fontSize:scale(12), 
    textAlignVertical: 'top',
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen);