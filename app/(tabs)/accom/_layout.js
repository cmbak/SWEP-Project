import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack initialRouteName="search">
            <Stack.Screen name="search" />
            {/* <Stack.Screen name="view" /> */}
        </Stack>
    );
}
