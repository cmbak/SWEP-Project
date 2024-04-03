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
import { I18n } from 'i18n-js';
import { translations } from '../../localizations';
import { RandomRatings } from '../../randomRatings';
import { exampleResult } from '../../exampleListing';

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

export default function viewAccom({ propertyId = 51836428 }) {
    const i18n = new I18n(translations);
    const [locale, setLocale] = useState(getLocales()[0].languageCode);
    const [accomData, setAccomData] = useState(exampleResult);
    const appState = useRef(AppState.currentState); // I have no idea if this works
    const [originalDesc, setOriginalDesc] = useState(exampleResult.description);
    const [translatedDesc, setTranslatedDesc] = useState('');
    const [description, setDescription] = useState(originalDesc);

    const randomRatings = new RandomRatings(3);
    i18n.locale = locale;

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
        formattedText = formattedText.replaceAll('&amp;', '&'); // RE ?
        formattedText = formattedText.replaceAll('& amp;', '&');
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
                                    <Text style={styles.shareTxt}>
                                        {i18n.t('share')}
                                    </Text>
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
                                    {`${i18n.t('available')} ${formatDate(
                                        accomData.availableFrom
                                    )}`}
                                </Text>
                            </View>
                            <Text style={styles.price}>{`£${
                                accomData.price
                            }/${i18n.t('month')}`}</Text>
                        </View>
                    </View>
                    <View style={[styles.horizLine, styles.container]}></View>
                    {/* Description - API returns a html formatted string */}
                    <View style={[styles.center, styles.container]}>
                        <Text style={styles.descText}>
                            {formatText(description)}
                        </Text>
                        {/* TODO detect language of description */}
                        {locale !== 'en' ? (
                            <TouchableOpacity
                                onPress={translateDesc}
                                style={styles.translateBtn}
                            >
                                <Text style={styles.msgTxt}>
                                    {i18n.t('translate')}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
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
                            <Text>
                                {/* TODO PLURAL TRANSLATION? */}
                                {accomData.baths} {i18n.t('bath')}
                            </Text>
                        ) : null}
                        {accomData.beds ? (
                            <Text>
                                {accomData.beds} {i18n.t('bed')}
                            </Text>
                        ) : null}
                        {accomData.livingRooms ? (
                            <Text>
                                {accomData.livingRooms} {i18n.t('livRoom')}
                            </Text>
                        ) : null}
                    </View>
                    <View style={[styles.horizLine, styles.container]}></View>
                    {/* TODO - Translate Features */}
                    <View style={[styles.container, styles.twoRow]}>
                        <Text style={styles.rowText}>{i18n.t('features')}</Text>

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
                        <Text style={styles.rowText}>
                            {i18n.t('accessibility')}
                        </Text>
                        <Text style={styles.rowText}>Something Something</Text>
                    </View>
                    <View style={[styles.horizLine, styles.container]}></View>
                    {/* Rating */}
                    <View style={[styles.container, styles.twoRow]}>
                        <Text style={styles.rowText}>{i18n.t('rating')}</Text>
                        <View style={[styles.ratingGroup, styles.center]}>
                            <FontAwesome
                                size={18}
                                name="star"
                                style={styles.star}
                            />
                            <Text style={[styles.rating, styles.rowText]}>
                                {`${randomRatings.avgRating} / 10`}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.container]}>
                        <View style={styles.twoRow}>
                            <Text>{i18n.t('wifi')}</Text>
                            <Text>{randomRatings.ratingsArr[0]}</Text>
                        </View>
                        <View style={styles.twoRow}>
                            <Text>{i18n.t('location')}</Text>
                            <Text>{randomRatings.ratingsArr[1]}</Text>
                        </View>
                        <View style={styles.twoRow}>
                            <Text>{i18n.t('cleanliness')}</Text>
                            <Text>{randomRatings.ratingsArr[2]}</Text>
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
                            <Text style={styles.postBy}>
                                {i18n.t('posted')}
                            </Text>
                            <Text style={styles.profileName}>
                                {accomData.agentName}
                            </Text>
                            <Text style={styles.phoneNumber}>
                                {accomData.agentPhone}
                            </Text>
                            <TouchableOpacity style={styles.msgBtn}>
                                <Text style={styles.msgTxt}>
                                    {i18n.t('message')}
                                </Text>
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
                    <Text>{i18n.t('loadingAccom')}</Text>
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
    // Probably should be a 'class'
    translateBtn: {
        backgroundColor: '#197bc6',
        padding: 7,
        margin: 5,
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
