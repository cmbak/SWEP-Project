import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const IP_ADDRESS = '192.168.0.13';
    const SERVER_URL =
        process.env.REACT_APP_SERVER_URL || `http://${IP_ADDRESS}:5000`;

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', data.message);
                // If user is admin, then show admin tab navigator
                // If user is not admin, show normal tab navigator

                // console.log(`User is admin? ${data.isAdmin}`);
                if (data.isAdmin === true) {
                    // Currently they can still go back to login page
                    try {
                        await AsyncStorage.setItem('@is_admin', 'true');
                    } catch (error) {
                        console.log(error);
                    }
                    router.push('/accom');
                } else {
                    await AsyncStorage.setItem('@is_admin', 'false');
                    router.push('/accom');
                }
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred, please try again later.');
        }
    };

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E1E', gap: 60}}
        >
            <View>
                <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="292"
                    height="93"
                    viewBox="0 0 292 93"
                    fill="none"
                >
                    <Path
                        d="M141.691 29.1292H70.6869V92.5729H141.691C151.537 92.5729 159.528 84.5745 159.528 74.7185V46.9836C159.528 37.1276 151.546 29.1292 141.691 29.1292ZM133.183 78.015C133.183 82.5664 129.496 86.2562 124.949 86.2562H97.024V35.446H124.949C129.496 35.446 133.183 39.1357 133.183 43.6871V78.015ZM8.23301 29.1292H59.7206V35.446H27.708C26.9474 35.446 26.3372 36.0568 26.3372 36.818V56.5882H59.7206V62.9049H26.3456V92.5646H0V37.3704C0 32.8189 3.68604 29.1292 8.23301 29.1292ZM264.693 12.4295C273.377 9.19169 282.563 5.2176 292 0.415176V92.5729H265.663V23.8834L245.118 61.7922V92.5646H218.772V35.9648L198.227 73.8736V92.5729H171.882V37.3618C171.882 32.9025 175.426 29.2631 179.881 29.1292C186.049 28.9452 192.168 28.4348 198.227 27.8324V60.6211L217.41 25.2304C226.42 23.6826 235.74 21.5658 245.118 18.8802V48.548L264.702 12.4295H264.693Z"
                        fill="#C5FF00"
                    />
                </Svg>
            </View>
            <View style={styles.loginDetailsContainer}>
                <View style={{ marginBottom: 10 }}>
                    <TextInput
                        value={username}
                        placeholder='Username/Email'
                        placeholderTextColor={'gray'}
                        onChangeText={setUsername}
                        color= 'white'
                        backgroundColor='#42434C'
                        style={{
                            fontSize: 18,
                            fontWeight: '500',
                            borderWidth: 1,
                            borderColor: '#818181',
                            borderRadius: 30,
                            padding: 12,
                        }}
                    />
                </View>
                <View style={{ marginBottom: 10 }}>
                    <TextInput
                        value={password}
                        placeholder='Password'
                        placeholderTextColor={'#818181'}
                        onChangeText={setPassword}
                        color= 'white'
                        backgroundColor='#42434C'
                        secureTextEntry
                        style={{
                            fontSize: 18,
                            fontWeight: '500',
                            borderWidth: 1,
                            borderColor: 'gray',
                            borderRadius: 30,
                            padding: 12,
                        }}
                    />
                </View>
                <View>
                    <Pressable style={styles.loginButton} onPress={() => handleLogin(username, password)}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    loginDetailsContainer: {
        width: '80%',
        gap: 15
    },
    loginButton: {
        width: '70%',
        color: 'black',
        backgroundColor: '#C6FF00',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 10,
        padding: 10,
        borderRadius: 30
    },
    loginButtonText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        fontWeight: '700'
    }
})