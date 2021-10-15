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
import Edit from './auth/Edit'
import Chat from './auth/Chat'

export default function Index({firebase}) {
    // AsyncStorage.clear()
    const StackNav = createStackNavigator()
    const [isStartFetching, setisStartFetching] = useState(true);
    const [isSignedIn, setisSignedIn] = useState('false');
    const [isViewEdit, setisViewEdit] = useState('true');
    const [uid, setuid] = useState('');
    const [context, setContext] = useState([
        {isSignedIn,firebase, uid, isViewEdit},
        {setisSignedIn,firebase, setuid, setisViewEdit}
    ]);

    useEffect(() => {

        const fetchdata = async ()=>{
            const ASS_user_id = await AsyncStorage.getItem('user_id')
            setisSignedIn( (ASS_user_id != null) ? 'true': 'false')
            setuid( (ASS_user_id != null) ? ASS_user_id: '')

            const ASS_view_edit = await AsyncStorage.getItem('view_edit')
            setisViewEdit( (ASS_view_edit != null) ? 'false': 'true')

            setContext([
                {isSignedIn,firebase, uid, isViewEdit},
                {setisSignedIn,firebase, setuid, setisViewEdit}
            ])

            setisStartFetching(false)
        }

        fetchdata()

      return () => {
        
      };
    }, [uid, isViewEdit])

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
                            {
                                (isViewEdit == 'true') ? 
                                    <StackNav.Screen name="User_Edit" component={Edit} />
                                :
                                <>
                                    <StackNav.Screen name="User_Home" component={User_Home} />
                                    <StackNav.Screen name="User_Edit" component={Edit} />
                                    <StackNav.Screen name="User_Chat" component={Chat} />
                                </>
                                
                            }
                            
                        </>
                    }
                </StackNav.Navigator>
          }
      </NavigationContainer>
    </AppContext.Provider>
  );
}
