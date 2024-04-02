import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Pressable,
    AppState,
    Platform,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context';
import axios from 'axios';
import { key, host } from '../../apiKey';
import { getLocales } from 'expo-localization';
import translate from 'google-translate-api-x';

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

// Just to test this without calling the api
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

// For random review ratings

const to1Dp = (num) => {
    if (num == 0) {
        return 0.0;
    }
    let stringFloat = num.toFixed(1);
    return parseFloat(stringFloat);
};

// Returns a random number from 0 to 10
const getRandomScore = () => {
    const score = Math.floor(Math.random() * 110) / 10;
    return to1Dp(score);
};

const getAvgScore = (r1, r2, r3) => {
    let avg = (r1 + r2 + r3) / 3;
    return to1Dp(avg);
};

const r1 = getRandomScore();
const r2 = getRandomScore();
const r3 = getRandomScore();
const avgScore = getAvgScore(r1, r2, r3);

export default function viewAccom({ propertyId = 51836428 }) {
    const [accomData, setAccomData] = useState(exampleResult);
    const appState = useRef(AppState.currentState); // I have no idea if this works
    const [locale, setLocale] = useState(getLocales()[0].languageCode);
    const [originalDesc, setOriginalDesc] = useState(exampleResult.description);
    const [translatedDesc, setTranslatedDesc] = useState('');
    const [description, setDescription] = useState(exampleResult.description);

    const fetchData = async () => {
        const options = {
            method: 'GET',
            url: `https://zoopla4.p.rapidapi.com/properties/${propertyId}`,
            headers: {
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': host,
            },
        };

        try {
            const response = await axios.request(options);
            setAccomData(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    // UNCOMMENT WHEN NEEDED
    // useEffect(() => {
    //     fetchData();
    // }, []);

    // For locale update on android
    useEffect(() => {
        console.log(getLocales()[0].languageCode);
        // Localization only changes in Android (in iOS the app is restarted) and
        // will only happen when the app comes back into the foreground
        if (Platform.OS !== 'android' || appState !== 'active') return;
        setLocale(getLocales()[0].languageCode);
    }, [appState.current]);

    // Returns date as dd.mm.yy
    const formatDate = (date) => {
        let formattedDate = new Date(date);
        let year = formattedDate.getFullYear();
        let month = formattedDate.getMonth() + 1;
        let day = formattedDate.getDate();
        return `${day}.${month}.${year}`;
    };

    // Used to format listing description which might have html tags in it
    const formatText = (text) => {
        let formattedText = text.replaceAll('<br>', '\n');
        formattedText = formattedText.replace(/<\/?[^>]+(>|$)/g, ''); // Gets rid of html tags
        formattedText = formattedText.replaceAll('&amp;', '&');
        return formattedText;
    };

    // Sets description state to orignalDesc or translatedDesc depending on current description
    function toggleDesc() {
        if (translatedDesc.length === 0) {
            return; // Don't want to swap to empty description before user has pressed translate
        }
        console.log(
            `current desc ${description}\n and translated ${translatedDesc}`
        );
        if (description === originalDesc) {
            setDescription(translatedDesc);
        } else {
            setDescription(originalDesc);
        }
    }

    // Translates the desc and sets accomData.desc to that
    async function translateDesc() {
        console.log('pressed');
        console.log(`before translation ${translatedDesc.length}`);
        if (accomData != null) {
            if (translatedDesc.length === 0) {
                try {
                    const res = await translate(accomData.description, {
                        to: locale,
                    });
                    setTranslatedDesc(res.text);
                } catch (error) {
                    console.log(error);
                }
            }
            toggleDesc();
        }
    }

    // Want to toggle desc but only after translateDesc state has been updated and not before any translation has occurred
    useEffect(() => {
        toggleDesc();
    }, [translatedDesc]);

    return (
        <SafeAreaView>
            {accomData ? (
                <ScrollView>
                    <View>
                        <ImageBackground
                            style={styles.headerImg}
                            source={{
                                uri: `${accomData.images[0]}`,
                            }}
                        >
                            <View>
                                <TouchableOpacity style={styles.shareBtn}>
                                    <FontAwesome
                                        size={30}
                                        name="share-alt"
                                        color="gray"
                                    />
                                    <Text style={styles.shareTxt}> Share</Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
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
                    <View style={[styles.center, styles.container]}>
                        <Text style={styles.descText}>
                            {/* {formatText(accomData.description)} */}
                            {/* Only want to show translated desc if length > 0 */}
                            {description}
                        </Text>
                        <TouchableOpacity onPress={translateDesc}>
                            <Text>Translate</Text>
                        </TouchableOpacity>
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
                    <View style={[styles.horizLine, styles.container]}></View>

                    {/* Location */}
                    <View style={[styles.container, styles.twoRow]}>
                        <Text style={styles.rowText}>{accomData.address}</Text>
                        <Text style={styles.rowText}>
                            {accomData.postalCode}
                        </Text>
                    </View>
                    <View style={[styles.horizLine, styles.container]}></View>

                    {/* Beds, baths + living rooms - only render if all three aren't null?*/}
                    <View style={[styles.container, styles.center]}>
                        {accomData.baths ? (
                            <Text>{accomData.baths} Bath</Text>
                        ) : null}
                        {accomData.beds ? (
                            <Text>{accomData.beds} Beds</Text>
                        ) : null}
                        {accomData.livingRooms ? (
                            <Text>{accomData.livingRooms} Living</Text>
                        ) : null}
                    </View>
                    <View style={[styles.horizLine, styles.container]}></View>
                    {/* Features */}
                    <View style={[styles.container, styles.twoRow]}>
                        <Text style={styles.rowText}>Features</Text>

                        <View style={styles.facilityList}>
                            {accomData.features.map((feature, index) => {
                                return (
                                    <Text
                                        key={index}
                                        style={styles.facilityText}
                                    >
                                        {formatText(feature)}
                                    </Text>
                                );
                            })}
                        </View>
                    </View>
                    <View style={[styles.horizLine, styles.container]}></View>
                    {/* Accessibility */}
                    <View style={[styles.container, styles.twoRow]}>
                        <Text style={styles.rowText}>Accessibility</Text>
                        <Text style={styles.rowText}>Something Something</Text>
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
                                {`${avgScore} / 10`}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.container]}>
                        <View style={styles.twoRow}>
                            <Text>Wifi</Text>
                            <Text>{r1}</Text>
                        </View>
                        <View style={styles.twoRow}>
                            <Text>Location</Text>
                            <Text>{r2}</Text>
                        </View>
                        <View style={styles.twoRow}>
                            <Text>Cleanliness</Text>
                            <Text>{r3}</Text>
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
            ) : (
                <View
                    style={[
                        styles.loadingContainer,
                        styles.center,
                        styles.container,
                    ]}
                >
                    <Text>Loading Accommodation...</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    bedsContainer: {},
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
        // borderBottomColor: '#c7cacc',
        borderBottomColor: '#0E0D0D',
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
        fontSize: 15.5,
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
    shareBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 3,
        backgroundColor: 'white',
        width: 110,
        top: 15,
        left: 283,
        elevation: 3,
        flexDirection: 'row',
        gap: 7,
    },
    shareTxt: {
        fontSize: 16,
        letterSpacing: 0.25,
        lineHeight: 21,
    },
});
