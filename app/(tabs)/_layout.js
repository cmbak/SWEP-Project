import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

// See https://icons.expo.fyi/Index for the icon names and filter for FontAwesome

export default function TabLayout() {
    const [isAdmin, setIsAdmin] = useState(false);

    async function getAdminStorage() {
        try {
            const res = await AsyncStorage.getItem('@is_admin');
            // console.log(`From admin storage: ${test}`);
            if (res === 'true') {
                setIsAdmin(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAdminStorage();
    }, []);

    // If they're not logged in only show login
    // If they're admin, only show diagnostics dash

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#1E1E1E',
                headerShown: false,
            }}
            initialRouteName="search"
        >
            {/* <Tabs.Screen
                name="index"
                options={{
                    title: 'Login',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="user" color={color} />
                    ),
                    // href: isSignedIn === false ? null : 'index',
                }}
            /> */}
            <Tabs.Screen
                name="accom"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="search" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="diagnosticsDash"
                options={{
                    title: 'Diagnostics',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="database" color={color} />
                    ),
                    href: isAdmin === true ? 'diagnosticsDash' : null,
                }}
            />
        </Tabs>
    );
}
