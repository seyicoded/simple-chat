import React, {useState, useContext} from 'react';
import { View, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage'
import AlertInput from 'react-native-alert-input'
import {AppContext} from '../Context'
import * as CONFIG from '../CONFIG'

export default function Edit() {
    const [showDisplayName, setshowDisplayName] = useState(true)
    const [showLoading, setshowLoading] = useState(false)
    const context = useContext(AppContext);
    const firebase = context[0].firebase;

    console.log(context[0].uid)

  return (
    <View style={{flex: 1}}>
        {
            showLoading ? <Spinner />:<></>
        }
        <AlertInput onCancel={()=>{
                (async ()=>{
                    setshowDisplayName(false)
                    setshowLoading(true)
                    await AsyncStorage.setItem('view_edit', 'false')
                    context[1].setisViewEdit('false')
                })()
            }} onSubmit={(txt)=>{
                console.log(txt);
                // return false;
                setshowDisplayName(false)
                setshowLoading(true)
                // update firebase
                firebase.firestore().collection('Users').doc(context[0].uid).update({displayName: txt}).then(()=>{
                    (async()=>{
                        await AsyncStorage.setItem('view_edit', 'false')
                        context[1].setisViewEdit('false')
                    })();
                }).error(()=>{
                    setshowDisplayName(true)
                    setshowLoading(false)
                })
                
            }} title="Name" show={showDisplayName} placeholder="Enter Display Name" style={{backgroundColor: 'white'}} inputStyle={{borderTopWidth: 0, borderBottomWidth: 0}}/>
     </View>
  );
}
