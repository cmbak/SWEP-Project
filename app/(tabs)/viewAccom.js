import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

/*
Accommodation

- Number of rooms
- Price
- Location
- Accessibillity
- Facilities
- Address
- Postcode


*/

export default function viewAccom() {
    return (
        <SafeAreaView>
            <View>
                <Image
                    style={styles.headerImg}
                    source={{
                        uri: 'https://images7.alphacoders.com/341/341714.jpg',
                    }}
                />
                <View
                    style={[styles.titleGroup, styles.container, styles.center]}
                >
                    <Text style={styles.accomTitle}>London House</Text>
                    <Text style={styles.price}>£500pcm</Text>
                    {/*  */}
                </View>
            </View>
            <View style={[styles.horizLine, styles.container]}></View>
            {/* Description */}
            <View style={[styles.center, styles.container]}>
                <Text style={styles.descText}>
                    pellentesque dignissim enim sit amet venenatis urna cursus
                    eget nunc scelerisque viverra mauris in aliquam sem
                    fringilla ut morbi tincidunt augue interdum velit euismod in
                    pellentesque massa
                </Text>
                {/* <View style={[styles.roomsDesc, styles.container]}>
                    <View style={[styles.row]}>
                        <Text>Bed</Text>
                        <Text>Bathroom</Text>
                        <Text>Rooms</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>1</Text>
                        <Text>1</Text>
                        <Text>3</Text>
                    </View>
                </View> */}
            </View>
            {/* Location */}
            <View style={[styles.container, styles.twoRow]}>
                <Text>London, United Kingdom</Text>
                <Text>SE11 S9E</Text>
            </View>
            <View style={[styles.horizLine, styles.container]}></View>

            {/* Rating */}
            <View style={[styles.container, styles.twoRow]}>
                <Text>Rating</Text>
                <View style={[styles.ratingGroup, styles.center]}>
                    <FontAwesome size={18} name="star" style={styles.star} />
                    <Text style={styles.rating}>6.7/10</Text>
                </View>
            </View>
            <View style={[styles.horizLine, styles.container]}></View>

            {/* Accessibility */}
            <View style={[styles.container, styles.twoRow]}>
                <Text>Accessibility</Text>
                <Text>Something Something</Text>
            </View>
            <View style={[styles.horizLine, styles.container]}></View>

            {/* Facilities */}
            <View style={[styles.container, styles.twoRow]}>
                <Text>Facilities</Text>
            </View>
            {/* User Profile */}
            <View style={[styles.container, styles.profileCard]}>
                <FontAwesome size={28} name="user" color="gray" />
                <View>
                    <Text>First-name Last-name</Text>
                    <TouchableOpacity style={styles.msgBtn}>
                        <Text>Message</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    twoRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    center: {
        alignContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 10,
    },
    headerImg: {
        height: 300,
        // resizeMode: 'contain',
    },
    horizLine: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1.4,
        marginVertical: 10,
    },
    titleGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    price: {
        fontSize: 18,
    },
    accomTitle: {
        fontSize: 27,
        // fontWeight: 'bold',
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
    descText: {
        fontSize: 14.5,
        marginBottom: 13,
    },
    roomsDesc: {
        padding: 13,
        justifyContent: 'space-evenly',
        gap: 10,
        borderColor: 'black',
        borderRadius: 35,
        borderWidth: 1.5,
        marginVertical: 15,
    },
});
