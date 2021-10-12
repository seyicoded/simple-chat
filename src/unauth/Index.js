import React, {useState, useEffect, useContext} from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import {ActivityIndicator, Button, TouchableRipple} from 'react-native-paper'
// import {getAuth} from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {AppContext} from '../Context'
import * as CONFIG from '../CONFIG'

// const auth = F_Auth.getAuth();

export default function Index() {
    const [signinmode, setsigninmode] = useState(true)
    const context = useContext(AppContext);
    const firebase = context[1];

    console.log(getFirestore(firebase))

    
  return (
      <ImageBackground style={{flex: 1}} source={require('../../assets/res/bg/b2.jpg')}>
          <View style={styles.container}>
            <Text style={styles.title}>SEYI INSTANT CHAT</Text>
            {
                signinmode ? <Sign_in /> : <Sign_up/>
            }

            <TouchableRipple onPress={()=> setsigninmode( (signinmode ? false:true) )}>
                <Button color="black">{signinmode ? "sign up":"sign in"}</Button>
            </TouchableRipple>
            </View>
      </ImageBackground>
  );
}

function Sign_in(){
    return (
        <View style={styles.sub_container}>
            <Button onPress={()=>{
                
            }} mode="contained" icon="google" color="red" style={styles.btn}>GOOGLE SIGN IN</Button>
            <Button mode="contained" icon="apple" color="black" style={styles.btn}>APPLE SIGN IN</Button>
            <Button mode="contained" icon="facebook" color="blue" style={styles.btn}>FACBK SIGN IN</Button>
            <Button mode="contained" icon="twitter" color="lightgray" style={styles.btn}>TWIT SIGN IN</Button>
        </View>
    )
}

function Sign_up(){
    return (
        <View style={styles.sub_container}>
            <Button mode="contained" icon="google" color="red" style={styles.btn}>GOOGLE SIGN UP</Button>
            <Button mode="contained" icon="apple" color="black" style={styles.btn}>APPLE SIGN UP</Button>
            <Button mode="contained" icon="facebook" color="blue" style={styles.btn}>FACBK SIGN UP</Button>
            <Button mode="contained" icon="twitter" color="lightgray" style={styles.btn}>TWIT SIGN UP</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sub_container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: CONFIG.Primary_Color,
        fontSize: 21.92,
        fontWeight: '800'
    },
    btn: {
        marginVertical: 14,
        width: '100%'
    }
})
