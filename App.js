import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height'
import Index from './src/Index'
import firebase_app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDacV6FQwLxve7HThVYbUcIWkK4EAbZH_g",
  authDomain: "flex1-5ea54.firebaseapp.com",
  databaseURL: "https://flex1-5ea54.firebaseio.com",
  projectId: "flex1-5ea54",
  storageBucket: "flex1-5ea54.appspot.com",
  messagingSenderId: "421002849732",
  appId: "1:421002849732:web:56219ed5b2b606b4838891",
  measurementId: "G-BR4DMDJ1RB"
};

if(firebase_app.apps.length === 0){
  firebase_app.initializeApp(firebaseConfig);
}
// firebase_app.auth.is

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Index firebase={firebase_app}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: getStatusBarHeight(true)
  },
});
