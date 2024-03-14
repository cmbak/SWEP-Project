import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function viewAccom() {
    return (
        <SafeAreaView>
            <View style={styles.header}>
                <Image
                    style={styles.headerImg}
                    source={{
                        uri: 'https://images7.alphacoders.com/341/341714.jpg',
                    }}
                />
                <View style={styles.titleGroup}>
                    <Text style={styles.accomTitle}>New York House</Text>
                    <View style={[styles.ratingGroup, styles.center]}>
                        <FontAwesome
                            size={28}
                            name="star"
                            style={styles.star}
                        />
                        <Text style={styles.rating}>6.7/10</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.center, styles.desc]}>
                <Text style={styles.descText}>
                    pellentesque dignissim enim sit amet venenatis urna cursus
                    eget nunc scelerisque viverra mauris in aliquam sem
                    fringilla ut morbi tincidunt augue interdum velit euismod in
                    pellentesque massa
                </Text>
                <View style={styles.roomsDesc}>
                    <View style={styles.row}>
                        <Text>Bed</Text>
                        <Text>Bathroom</Text>
                        <Text>Rooms</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>1</Text>
                        <Text>1</Text>
                        <Text>3</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    center: {
        alignContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    headerImg: {
        height: 300,
        // resizeMode: 'contain',
    },
    titleGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 13,
        paddingVertical: 12,
    },
    accomTitle: {
        fontSize: 27,
        fontWeight: 'bold',
    },
    ratingGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    rating: {
        fontSize: 16,
    },
    star: {
        color: '#e8c31e',
    },
    desc: {
        marginHorizontal: 15,
    },
    descText: {
        fontSize: 14,
    },
    roomsDesc: {
        padding: 10,
        justifyContent: 'space-evenly',
        gap: 10,
        borderColor: 'black',
        borderRadius: 0.5,
        borderWidth: 1.5,
    },
});
