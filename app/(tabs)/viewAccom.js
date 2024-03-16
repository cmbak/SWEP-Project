import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
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

/* Could add Scrollable Reviews */

export default function viewAccom() {
    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <Image
                        style={styles.headerImg}
                        source={{
                            uri: 'https://images7.alphacoders.com/341/341714.jpg',
                        }}
                    />
                    <View
                        style={[
                            styles.titleGroup,
                            styles.container,
                            styles.center,
                        ]}
                    >
                        <View>
                            <Text style={styles.accomTitle}>London House</Text>
                            <Text style={styles.datePosted}>
                                Date Posted: 16.3.24
                            </Text>
                        </View>
                        <Text style={styles.price}>£500pcm</Text>
                    </View>
                </View>
                <View style={[styles.horizLine, styles.container]}></View>
                {/* Description */}
                <View style={[styles.center, styles.container]}>
                    <Text style={styles.descText}>
                        pellentesque dignissim enim sit amet venenatis urna
                        cursus eget nunc scelerisque viverra mauris in aliquam
                        sem fringilla ut morbi tincidunt augue interdum velit
                        euismod in pellentesque massa
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
                    <Text style={styles.rowText}>London, United Kingdom</Text>
                    <Text style={styles.rowText}>SE11 S9E</Text>
                </View>
                <View style={[styles.horizLine, styles.container]}></View>

                {/* Rating */}
                <View style={[styles.container, styles.twoRow]}>
                    <Text style={styles.rowText}>Rating</Text>
                    <View style={[styles.ratingGroup, styles.center]}>
                        <FontAwesome
                            size={18}
                            name="star"
                            style={styles.star}
                        />
                        <Text style={[styles.rating, styles.rowText]}>
                            6.7/10
                        </Text>
                    </View>
                </View>
                <View style={[styles.horizLine, styles.container]}></View>

                {/* Accessibility */}
                <View style={[styles.container, styles.twoRow]}>
                    <Text style={styles.rowText}>Accessibility</Text>
                    <Text style={styles.rowText}>Something Something</Text>
                </View>
                <View style={[styles.horizLine, styles.container]}></View>

                {/* Facilities */}
                <View style={[styles.container, styles.twoRow]}>
                    <Text style={styles.rowText}>Facilities</Text>
                    <View style={styles.facilityList}>
                        <Text style={[styles.rowText, styles.facilityText]}>
                            Bathroom
                        </Text>
                        <Text style={[styles.rowText, styles.facilityText]}>
                            Carbon Monoxide Alarm
                        </Text>
                        <Text style={[styles.rowText, styles.facilityText]}>
                            Bathroom
                        </Text>
                    </View>
                </View>
                {/* User Profile */}
                <View
                    style={[
                        styles.container,
                        styles.profileCard,
                        styles.center,
                    ]}
                >
                    <View style={styles.profilePic}>
                        <FontAwesome size={80} name="user" color="gray" />
                    </View>
                    <View style={styles.profileContainer}>
                        <Text style={styles.profileName}>John Smith</Text>
                        <TouchableOpacity style={styles.msgBtn}>
                            <Text style={styles.msgTxt}>Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
    rowText: {
        fontSize: 14.5,
    },
    headerImg: {
        height: 300,
        // resizeMode: 'contain',
    },
    horizLine: {
        borderBottomColor: '#c7cacc',
        borderBottomWidth: 1.4,
        marginVertical: 10,
    },
    titleGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 25,
    },
    datePosted: {
        color: '#494949',
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
    // rating: {
    //     fontSize: 16,
    // },
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
    facilityList: {
        color: 'blue',
    },
    facilityText: {
        textAlign: 'right',
    },
    profileCard: {
        borderColor: 'darkgray',
        borderWidth: 1,
        backgroundColor: '#e8e9ea',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 30,
        marginVertical: 13,
    },
    profilePic: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
    },
    profileContainer: {
        gap: 2,
        flex: 1,
    },
    profileName: {
        marginBottom: 10,
        fontSize: 19,
        textAlign: 'center',
    },
    msgBtn: {
        backgroundColor: '#197bc6',
        padding: 7,
    },
    msgTxt: {
        color: 'white',
        textAlign: 'center',
    },
});
