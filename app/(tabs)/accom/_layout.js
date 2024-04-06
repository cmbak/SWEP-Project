import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack initialRouteName="search">
            <Stack.Screen name="search" />
            <Stack.Screen
                name="view"
                initialParams={{
                    baths: null,
                    beds: null,
                    images: null,
                    features: null,
                    livingRooms: null,
                    agentName: null,
                    agentPhone: null,
                    availableFrom: null,
                }}
            />
        </Stack>
    );
}
