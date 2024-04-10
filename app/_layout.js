import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Failed prop type:']); // react-native-table-component isn't being maintained so this is the only way to get rid of the warning

export default function AppLayout() {
    // return (
    //     <Stack>
    //         <Stack.Screen
    //             name="(tabs)"
    //             options={{ headerShown: false }}
    //             initialParams={{ isAdmin: true, isSignedIn: false }}
    //         ></Stack.Screen>
    //     </Stack>
    // );
    return (
        <Stack
            screenOptions={{
                tabBarActiveTintColor: '#1E1E1E',
                headerShown: false,
            }}
        />
    );
}
