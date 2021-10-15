import React, {useState, useEffect, useContext, useRef} from 'react';
import { View, StyleSheet, ImageBackground, Alert } from 'react-native';
import {ActivityIndicator, Button, TouchableRipple, TextInput, Text,} from 'react-native-paper'
import RBSheet from 'react-native-raw-bottom-sheet';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import {getAuth} from "firebase/auth";
// import * as firestore from 'firebase/firebase-auth';
import {AppContext} from '../Context'
import * as CONFIG from '../CONFIG'

// const auth = F_Auth.getAuth();

export default function Index() {
    const [signinmode, setsigninmode] = useState(true)
    const context = useContext(AppContext);
    const firebase = context[0].firebase;

    const googleProvider = new firebase.auth.GoogleAuthProvider()
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        const unsubscribeAuth = firebase.auth().onAuthStateChanged(async authenticatedUser => {
          try {
            // await (authenticatedUser ? setUser(authenticatedUser) : setUser(null));
            // console.log(authenticatedUser)
            // connect to firestore and store user
            const user_col = await firebase.firestore().collection('Users').doc(authenticatedUser.uid).set({
                email: authenticatedUser.email,
                photoURL: authenticatedUser.photoURL,
                displayName: authenticatedUser.displayName,
            })
            // update async store and context 
            await AsyncStorage.setItem('user_id', authenticatedUser.uid)
            context[1].setuid(authenticatedUser.uid)
            

            // setIsLoading(false);
          } catch (error) {
            console.log(error);
          }
        });
    
        // unsubscribe auth listener on unmount
        return unsubscribeAuth;
    }, []);

    
  return (
      <ImageBackground style={{flex: 1}} source={require('../../assets/res/bg/b2.jpg')}>
          <View style={styles.container}>
            <Text style={styles.title}>SEYI INSTANT CHAT</Text>
            {
                signinmode ? <Sign_in firebase={firebase} googleProvider={googleProvider} /> : <Sign_up firebase={firebase}/>
            }

            <TouchableRipple onPress={()=> setsigninmode( (signinmode ? false:true) )}>
                <Button color="black">{signinmode ? "sign up":"sign in"}</Button>
            </TouchableRipple>
            </View>
      </ImageBackground>
  );
}

function BottomSheet({modalRef, type, firebase}){
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [spinner, setspinner] = useState(false)

    const process_auth = async()=> {
        setspinner(true)
        try{
            if(type == 'sign-in'){
                // sign in logic
                await firebase.auth().signInWithEmailAndPassword(email, password);
            }else{
                // sign up logic
                await firebase.auth().createUserWithEmailAndPassword(email, password);
    
            }      
            
        }catch(err){
          console.error('err ', err);
          setTimeout(() => {
            Alert.alert('Oops!', err.message);
          }, 100);
        }

        setspinner(false);

    }

    return (
        <RBSheet
                ref={ref => {
                    modalRef.current = ref;
                }}
                height={300}
                closeOnDragDown={true}
                closeOnPressBack={true}
                openDuration={250}
                customStyles={{
                    wrapper: {
                      backgroundColor: "transparent",
                    },
                    container: {
                        backgroundColor: "rgba(255,255,255,0.9)",
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        shadowColor: 'rgba(0,0,0,0.5)',
                        shadowOpacity: 1,
                        shadowRadius: 4,
                        shadowOffset: {width: 1, height: 1}
                    },
                    draggableIcon: {
                      backgroundColor: "#000"
                    }
                }}
                >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner textContent="Loading" visible={spinner} textStyle={{color: 'white'}} />
                    <View style={{width: '94%'}}>
                        <Text style={{fontSize: 24, fontWeight: '600', color: 'rgba(0,0,0,0.65)', marginBottom: 9}}>{(type == 'sign-in') ? 'SIGN IN':'SIGN UP'}</Text>
                        <TextInput autoCompleteType="email" value={email} onChangeText={t => setemail(t)} keyboardType="email-address" textContentType="emailAddress" label="Email" placeholder="Enter Email" />
                        <Text />
                        <TextInput autoCompleteType="password" value={password} onChangeText={t => setpassword(t)} textContentType="password" secureTextEntry={true} label="Password" placeholder="Enter Password" />
                        <Text />
                        <Button disabled={ (email == '' || password.length <= 4) ? true:false } onPress={()=> process_auth()} mode="contained" color="blue" style={{paddingVertical: 6}}>CONTINUE</Button>
                    </View>
                    
                </View>
            </RBSheet>
    )
}

function Sign_in({firebase, googleProvider}){
    const modalRef = useRef(null)
    return (
        <View style={styles.sub_container}>
            <BottomSheet modalRef={modalRef} type="sign-in" firebase={firebase}/>

            <Button onPress={()=>modalRef.current.open()} mode="contained" icon="email" color="black" style={styles.btn}>Email SIGN IN</Button>
            <Button onPress={()=>{
                firebase.auth().signInWithPopup(googleProvider)
            }} mode="contained" disabled={true} icon="google" color="red" style={styles.btn}>GOOGLE SIGN IN</Button>
            <Button mode="contained" disabled={true} icon="apple" color="black" style={styles.btn}>APPLE SIGN IN</Button>
            <Button mode="contained" disabled={true} icon="facebook" color="blue" style={styles.btn}>FACBK SIGN IN</Button>
            <Button mode="contained" disabled={true} icon="twitter" color="lightgray" style={styles.btn}>TWIT SIGN IN</Button>
        </View>
    )
}

function Sign_up({firebase, googleProvider}){
    const modalRef = useRef(null)
    return (
        <View style={styles.sub_container}>
            <BottomSheet modalRef={modalRef} type="sign-up" firebase={firebase}/>

            <Button onPress={()=>modalRef.current.open()} mode="contained" icon="email" color="black" style={styles.btn}>Email SIGN UP</Button>
            <Button disabled={true} mode="contained" icon="google" color="red" style={styles.btn}>GOOGLE SIGN UP</Button>
            <Button disabled={true} mode="contained" icon="apple" color="black" style={styles.btn}>APPLE SIGN UP</Button>
            <Button disabled={true} mode="contained" icon="facebook" color="blue" style={styles.btn}>FACBK SIGN UP</Button>
            <Button disabled={true} mode="contained" icon="twitter" color="lightgray" style={styles.btn}>TWIT SIGN UP</Button>
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
        fontWeight: '800',
        marginBottom: 7
    },
    btn: {
        marginVertical: 14,
        width: '100%'
    }
})
