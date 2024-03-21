import { Tabs } from 'expo-router';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// See https://icons.expo.fyi/Index for the icon names and filter for FontAwesome

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'blue',
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="login"
                options={{
                    title: 'Login',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="user" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="search" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="viewAccom"
                options={{
                    title: 'View Accom',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
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
                }}
            />
        </Tabs>
    );
}
