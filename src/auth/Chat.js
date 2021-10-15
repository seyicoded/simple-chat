import React, {useState, useContext, useEffect} from 'react';
import { View, StyleSheet, ImageBackground, Alert, Touchable, ScrollView, KeyboardAvoidingView, } from 'react-native';
import {ActivityIndicator, Button, TouchableRipple, TextInput, Text, Avatar, Card, IconButton, Appbar} from 'react-native-paper'
import {MaterialIcons} from '@expo/vector-icons'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {AppContext} from '../Context'
import {getStatusBarHeight} from 'react-native-status-bar-height'
import * as CONFIG from '../CONFIG'
import RBSheet from 'react-native-raw-bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Chat({navigation, route}) {
    const chat_data = route.params.chat_data;
    const context = useContext(AppContext);
    const firebase = context[0].firebase;
    const [chat_record, setchat_record] = useState([]);
    const [txt, settxt] = useState('');
    const my_data = firebase.auth().currentUser;

    const get_doc_code = (t1, t2)=>{
        if(t1.substring(0, 9) < t2.substring(0, 9)){
            return `${t2}-${t1}`;
        }else{
            return `${t1}-${t2}`;
        }
    }
    const doc_code = get_doc_code(my_data.uid, chat_data.id);
    // console.log(doc_code)

    useEffect(()=>{
        firebase.firestore().collection('Messages').doc(doc_code).collection('messages').onSnapshot(snapshot=>{
            var r = snapshot.docs.map(doc =>{
              // check if data is thesame as uid
              if(my_data.uid != doc.id){
                return {
                  id: doc.id,
                  data: (doc.data())
                }
              }
              
            });
      
            console.log(r)
            setchat_record(r)
          }, error=>{
            console.log(error)
          });
    }, [])

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={()=>{navigation.goBack()}} />
        <Appbar.Content title={chat_data.data.displayName} subtitle="Live Chat" />
        </Appbar.Header>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
            {
                chat_record.map((item, index)=>{
                    // console.log(item.data)
                    return (
                        <View key={index} style={[styles.chat_container, {justifyContent: (item.data.from == my_data.uid) ? 'flex-end':'flex-start'}]}>
                            <View style={styles.chat_inner_container}>
                                <Text style={styles.chat_txt}>{item.data.message}</Text>
                                <Text style={styles.date}>{new Date(item.data.timeStamp).toLocaleString()}</Text>
                            </View>
                        </View>
                    )
                })
            }
        </ScrollView>
        <View style={styles.bottom_container}>
            <TextInput value={txt} onChangeText={tx=> settxt(tx)} placeholder="Enter Message" style={{flex: 1}} returnKeyType="send" onSubmitEditing={()=>{
                // using firebase function to send text
                firebase.firestore().collection('Messages').doc(doc_code).collection('messages').add({
                    from: my_data.uid,
                    message: txt,
                    timeStamp: Date.now()
                }).then(()=>{
                    settxt('')
                })
            }}/>
        </View>
        </KeyboardAvoidingView>
     </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: getStatusBarHeight(false),
        backgroundColor: 'white'
    },
    bottom_container:{
        backgroundColor: 'rgba(98, 0, 238, 1)',
        flexDirection: 'row'
    },
    chat_container: {
        margin: 14.96,
        flexDirection: 'row'
    },
    chat_inner_container: {
        backgroundColor: 'rgba(93, 0, 238, 0.9)',
        padding: 10,
        borderRadius: 12
    },
    chat_txt: {
        color: 'white',
        fontSize: 16,
    },
    date: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 8,
        marginTop: 4,
        fontStyle: 'italic'
    }
})