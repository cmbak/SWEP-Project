import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context';
import axios from 'axios';
import { WebView } from 'react-native-webview';

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

const exampleResult = {
    additionalLinks: [],
    address: 'New Windsor Street, Uxbridge UB8',
    agentAddress:
        '6 Odeon Parade, Sudbury Heights Avenue, Greenford, Middlesex, London',
    agentName: 'Chase Residential',
    agentPhone: '020 8115 8614',
    availableFrom: '2022-01-13T00:00:00',
    baths: 1,
    beds: null,
    bedsMax: null,
    bedsMin: null,
    category: 'residential',
    description:
        'Chase Residential is presenting this, first floor Studio flat to rent within moments from Uxbridge Town Centre.<br><br>Rent includes water rates.<br><br>Council tax and electric bills to be paid by the tenants.<br><br>This Studio comprises of: Fitted kitchen, cubical shower room and good size living/bedroom area.<br><br>It further benefits from, electric heating, double glazed windows, laminate flooring and offered furnished.<br><br>There is the use of a communal Washing Machine &amp; No Parking for this property.<br><br>Council Tax: Band A<br><br>available 13th January 2022.',
    features: [
        'Water',
        'Double glazing',
        'Wood floors',
        'Council Tax - Band A',
        'Energy Rating : D',
        'Tenants Pays Council Tax &amp; Electricity',
    ],
    floorPlan: [],
    id: '51836428',
    images: [
        'https://lid.zoocdn.com/u/2400/1800/4bd77677c54ac6b618647d7a95a0121e9139edef.jpg',
        'https://lid.zoocdn.com/u/2400/1800/e53e95928d49a6b7698812f588a3d8c379139f4b.jpg',
        'https://lid.zoocdn.com/u/2400/1800/5e5e3006fda7b2186d4f0b75df2601a637ced2aa.jpg',
        'https://lid.zoocdn.com/u/2400/1800/5563a79b677d1d69e463290d4ef3e7ee94452c7b.jpg',
        'https://lid.zoocdn.com/u/2400/1800/66a5c9c24e8136b01de25d0966b1fc28c2ac3238.jpg',
    ],
    isRetirementHome: false,
    isSharedOwnership: false,
    latitude: 51.54458,
    listingCondition: 'pre-owned',
    listingStatus: 'to_rent',
    livingRooms: 0,
    longitude: -0.483798,
    name: 'Studio to rent',
    postalCode: 'UB8 2TX',
    price: 825,
    priceActual: 825,
    priceMax: 900,
    priceMin: 800,
    propertyType: 'studio',
    publishedOn: '2024-03-19T12:17:29',
    sqft: '',
    studentFriendly: false,
    url: 'https://www.zoopla.co.uk/to-rent/details/51836428/',
    uuid: 'B8A5A667-DF64-430D-B384-701781C50E9A',
};

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window');

export default function viewAccom({ propertyId = 51836428 }) {
    const [accomData, setAccomData] = useState(exampleResult);

    const fetchData = async () => {
        const options = {
            method: 'GET',
            url: `https://zoopla4.p.rapidapi.com/properties/${propertyId}`,
            headers: {
                'X-RapidAPI-Key':
                    'aebd7323cdmsh1a7c056bf60f7a5p1383d2jsn8752fc7ce027',
                'X-RapidAPI-Host': 'zoopla4.p.rapidapi.com',
            },
        };

        try {
            const response = await axios.request(options);
            console.log(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    // Returns date as dd.mm.yy
    const formatDate = (date) => {
        let formattedDate = new Date(date);
        let year = formattedDate.getFullYear();
        let month = formattedDate.getMonth() + 1;
        let day = formattedDate.getDate();
        return `${day}.${month}.${year}`;
    };

    // Used to format listing description which might have html tags in it
    const formatDescription = (text) => {
        console.log(text);
        // let formattedText = text.replace('<br>', '\n');
        let formattedText = text.replace(/<\/?[^>]+(>|$)/g, '');
        // formattedText.replace('<br><br>', '\n\n');
        console.log(formattedText);
        return formattedText;
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <Image
                        style={styles.headerImg}
                        source={{
                            uri: `${accomData.images[0]}`,
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
                            <Text style={styles.accomTitle}>
                                {accomData.name}
                            </Text>
                            <Text style={styles.datePosted}>
                                {`Available from ${formatDate(
                                    accomData.availableFrom
                                )}`}
                            </Text>
                        </View>
                        <Text
                            style={styles.price}
                        >{`£${accomData.price}pcm`}</Text>
                    </View>
                </View>
                <View style={[styles.horizLine, styles.container]}></View>
                {/* Description - API returns a html formatted string */}
                <WebView
                    style={[
                        {
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height,
                        },
                        styles.webview,
                    ]}
                    originWhitelist={['*']}
                    source={{ html: accomData.description }}
                />
                <View style={[styles.center, styles.container]}>
                    {/* // TODO FORMAT HTML in string */}
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
                    <Text style={styles.rowText}>{accomData.address}</Text>
                    <Text style={styles.rowText}>{accomData.postalCode}</Text>
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
                    {/* TODO - change to flat list? 
                    TODO - Is key needed?
                    */}
                    {/* <View style={styles.facilityList}>
                        {accomData.features.map((feature) => {
                            <Text style={[styles.rowText, styles.facilityText]}>
                                {feature}
                            </Text>;
                        })}
                    </View> */}
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
                            7.6/10
                        </Text>
                    </View>
                </View>
                <View style={[styles.container]}>
                    <View style={styles.twoRow}>
                        <Text>Wifi</Text>
                        <Text>8.2</Text>
                    </View>
                    <View style={styles.twoRow}>
                        <Text>Location</Text>
                        <Text>7.3</Text>
                    </View>
                    <View style={styles.twoRow}>
                        <Text>Cleanliness</Text>
                        <Text>7.3</Text>
                    </View>
                </View>
                <View style={[styles.horizLine, styles.container]}></View>
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
                        <Text style={styles.postBy}>Posted By</Text>
                        <Text style={styles.profileName}>
                            {accomData.agentName}
                        </Text>
                        <Text style={styles.phoneNumber}>
                            {accomData.agentPhone}
                        </Text>
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
    // Webview doesn't render if it's nested in a view, so you have to specify the width
    webview: {
        fontSize: 2,
        backgroundColor: 'red',
    },
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
        marginBottom: 7,
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
    postBy: {
        color: '#494949',
        textAlign: 'center',
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
    phoneNumber: {
        textAlign: 'center',
    },
});
