import React, {Component} from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import ForecastCard from './Component/ForecastCard';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 'lat',
      longitude: 'long',
      forecast: [],
      isLoading: true,
    }
  }
  componentDidMount(){
    this.getLocation();
  }

  getLocation(){ // function to get coordinates 
    navigator.geolocation = require('@react-native-community/geolocation');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState(
          (firstState) => ({
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
          }), () => { this.getWeather(); } // run function getWeather after have coordinates
          );
      },
      (error) => alert(error),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  getWeather(){ // function fetching weather api
    const URL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + this.state.latitude + '&lon=' + this.state.longitude + '&units=metric&appid=b832d476b934667690d5b5e02b1e1533';
    fetch(URL)
    .then(response => response.json())
    .then(json =>{
      this.setState((firstState, props) => ({
        forecast: json,
        isLoading: false,
      }));
    })
    .catch((error) =>{//handling error
      if (error) {
        console.log(error);
      }
    });
    console.log(this.state.latitude)
    console.log(this.state.longitude)
  }

  render(){
    if (this.state.isLoading) {
      return(
        <View style={styles.splash}>
          <Image
          style={{marginTop:80, width: 200, height: 200 ,}} 
          source={require('./Component/splash.png') }/>
          <Text style={{fontSize: 30, color:'#fff', fontWeight: 'bold',}}>Weather</Text>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', marginBottom:50,}}>
            <Text style={{fontSize: 20, color:'#fff'}}>Đang lấy dữ liệu</Text>
            <ActivityIndicator/>
          </View>
        </View>
      )
    }
  return (
    <View style={styles.container}>
      <FlatList data={this.state.forecast.list} style={{marginTop:20}} 
      keyExtractor={item => item.dt_txt} 
      renderItem={({item}) => <ForecastCard detail={item} location={this.state.forecast.city.name} />} />
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  splash: {
    width:'100%', 
    height:'100%', 
    backgroundColor:'#00BFFF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1,
  },
});