import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Failed prop type:']); // react-native-table-component isn't being maintained so this is the only way to get rid of the warning

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
            ></Stack.Screen>
        </Stack>
    );
}
