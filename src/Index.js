import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {ActivityIndicator} from 'react-native-paper'
import {AppContext} from './Context'
import * as CONFIG from './CONFIG'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Guest_Home from './unauth/Index'
import User_Home from './auth/Index'

export default function Index({firebase}) {
    const StackNav = createStackNavigator()
    const [isStartFetching, setisStartFetching] = useState(true);
    const [isSignedIn, setisSignedIn] = useState('false');
    const [context, setContext] = useState([
        {isSignedIn,firebase},
        {setisSignedIn,firebase}
    ]);

    useEffect(() => {

        const fetchdata = async ()=>{
            const ASS_user_id = await AsyncStorage.getItem('user_id')
            setisSignedIn( (ASS_user_id != null) ? 'true': 'false')

            setisStartFetching(false)
        }

        fetchdata()

      return () => {
        
      };
    }, [])

  return (
    <AppContext.Provider value={context}>
      <NavigationContainer>
          {
            (isStartFetching) ? 
                <View style={{flex: 1, justifyContent: 'center',}}>
                      <ActivityIndicator size="large" color={CONFIG.Primary_Color} />
                </View>
            :
                <StackNav.Navigator headerMode={true}>
                    {
                        (isSignedIn == 'false') ?
                        <>
                            <StackNav.Screen name="Guest_Home" component={Guest_Home} />
                        </>
                        :
                        <>
                            <StackNav.Screen name="User_Home" component={User_Home} />
                        </>
                    }
                </StackNav.Navigator>
          }
      </NavigationContainer>
    </AppContext.Provider>
  );
}
