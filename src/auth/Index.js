import React, {useState, useContext, useEffect} from 'react';
import { View, StyleSheet, ImageBackground, Alert } from 'react-native';
import {ActivityIndicator, Button, TouchableRipple, TextInput, Text,} from 'react-native-paper'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {AppContext} from '../Context'
import * as CONFIG from '../CONFIG'
import RBSheet from 'react-native-raw-bottom-sheet';

export default function Index() {
  const context = useContext(AppContext);
  const firebase = context[0].firebase;
  // const 

  useEffect(() => {
    
    (async()=>{
      await firebase.firestore().collection('Users').get().then( snapshot => {
        console.log('Total users: ', snapshot.size);
      })
    })()

    return () => {
      
    };
  }, []);

  return (
    <View style={{flex: 1,}}>
      <Text></Text>
     </View>
  );
}
