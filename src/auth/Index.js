import React, {useState, useContext, useEffect} from 'react';
import { View, StyleSheet, ImageBackground, Alert, Touchable, ScrollView } from 'react-native';
import {ActivityIndicator, Button, TouchableRipple, TextInput, Text, Avatar, Card, IconButton} from 'react-native-paper'
import {MaterialIcons} from '@expo/vector-icons'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {AppContext} from '../Context'
import {getStatusBarHeight} from 'react-native-status-bar-height'
import * as CONFIG from '../CONFIG'
import RBSheet from 'react-native-raw-bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Index({navigation, route}) {
  const context = useContext(AppContext);
  const firebase = context[0].firebase;
  const [user, setuser] = useState([]);
  const my_data = firebase.auth().currentUser;
  
  // console.log(my_data)

  useEffect(() => {

    // firebase.auth().signOut()
    // AsyncStorage.clear()
    
    // (async()=>{
    //   await firebase.firestore().collection('Users').get().then( snapshot => {
    //     var r = snapshot.docs.map(doc =>{
    //       // check if data is thesame as uid
    //       if(context[0].uid != doc.id){
    //         return {
    //           id: doc.id,
    //           data: (doc.data())
    //         }
    //       }
          
    //     })

    //     // console.log(r)
    //     setuser(r)
    //     // console.log(snapshot);
    //     // setuser(snapshot.data())
    //   })
    // })();

    // adding listener now
    // console.log(firebase.firestore().collection('Users'))
    firebase.firestore().collection('Users').onSnapshot(snapshot=>{
      var r = snapshot.docs.map(doc =>{
        // check if data is thesame as uid
        if(context[0].uid != doc.id){
          return {
            id: doc.id,
            data: (doc.data())
          }
        }
        
      });

      console.log(r)
          setuser(r)
    }, error=>{
      console.log(error)
    });

    return () => {
      
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableRipple onPress={()=> navigation.navigate('User_Edit')}>
          <Avatar.Icon icon="emoticon-kiss" size={30} style={{backgroundColor: 'lightblue', marginTop: 6}}/>
        </TouchableRipple>
        <Text style={styles.header_title}>SI Chat</Text>
        <View style={{flexDirection: 'row', marginTop: 6}}>
          <MaterialIcons name="group-work" size={24} color="rgba(0, 0, 0, 0.7)"/>
          <MaterialIcons name="logout" size={24} color="rgba(0, 0, 0, 0.7)" style={{marginLeft: 8}} onPress={()=>{
            (async()=>{
              firebase.auth().signOut()
              AsyncStorage.clear()
              context[1].setisSignedIn('false')
            })()
          }}/>
        </View>
      </View>

      <View style={{margin: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontWeight: '600', fontSize: 14}}>Users</Text>
        <Text style={{fontWeight: '600', fontSize: 12, color: 'rgba(0, 0, 0, 0.3)'}}>click any to start chat</Text>
      </View>
      
      <ScrollView>
        {
          user.map((item, index)=>{
            if(item == undefined || item == null){
              return (<></>)
            }
            return (
              <TouchableOpacity
              onPress={()=>{
                navigation.navigate('User_Chat', {chat_data: item})
              }}
              key={index}>
                <Card.Title key={index}
                  title={item.data.displayName}
                  subtitle={'****'+((item.data.email).substring(((item.data.email).length)/2, (item.data.email).length))}
                  // <Avatar.Icon {...props} icon="folder" />
                  left={(props) => ( item.data.photoURL != null ) ? <Avatar.Image size={40} source={{uri: item.data.photoURL}} />: <Avatar.Text size={40} label={(item.data.displayName).substring(0,1)+(item.data.email).substring(0,1)} />}
                  right={(props) => <IconButton {...props} icon="chevron-right" onPress={() => {}} />}
                />
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: getStatusBarHeight(false)
  },
  header: {
    marginVertical: 10,
    marginHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header_title: {
    fontWeight: '900',
    fontSize: 24.56,
    paddingVertical: 5,
    color: 'rgba(0, 0, 0, 0.7)'
  }
})
