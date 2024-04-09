import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Layout() {
    return (
        <Stack initialRouteName="search">
            <Stack.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerStyle: {
                        backgroundColor: '#1E1E1E',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <Stack.Screen
                name="view"
                initialParams={{ features: null }}
                options={{
                    title: 'View',
                    headerStyle: {
                        backgroundColor: '#1E1E1E',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </Stack>
    );
}
