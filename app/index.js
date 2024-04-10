import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
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
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <View style={{ width: '80%' }}>
                <View style={{ marginBottom: 10 }}>
                    <Text>Username</Text>
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            padding: 5,
                        }}
                    />
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            padding: 5,
                        }}
                    />
                </View>
                <Button
                    title="Login"
                    onPress={() => handleLogin(username, password)}
                />
            </View>
        </View>
    );
}
