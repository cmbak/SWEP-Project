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
    FlatList,
    Dimensions,
    Animated,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context';
import axios from 'axios';
import { key, host } from '../../../apiKey';
import { getLocales } from 'expo-localization';
import translate from 'google-translate-api-x';
import { I18n } from 'i18n-js';
import { translations } from '../../../localizations';
import { RandomRatings } from '../../../randomRatings';
import { useLocalSearchParams, router } from 'expo-router';

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
// 51836428

export default function viewAccom() {
    const i18n = new I18n(translations);
    const localParams = useLocalSearchParams();
    console.log('in view');
    console.log(localParams); // sometimes listing and id are undefined?
    // console.log(localParams.listing);
    // // console.log(JSON.stringify(localParams.listing))
    // console.log(localParams.id); // Sometimes this gets undefined?
    // console.log(localParams.images);
    // // console.log(localParams.parseImg);
    // console.log(localParams.stringImg);

    const randomRatings = new RandomRatings(3);
    const [accomData, setAccomData] = useState(null);
    const [locale, setLocale] = useState(getLocales()[0].languageCode);
    const appState = useRef(AppState.currentState); // See android thing
    const [originalDesc, setOriginalDesc] = useState(null);
    const [translatedDesc, setTranslatedDesc] = useState('');
    const [description, setDescription] = useState(null);

    if (locale === 'en' || locale === 'de' || locale === 'fr') {
        i18n.locale = locale;
    } else {
        i18n.locale = 'en';
    }

    const fetchData = async () => {
        const options = {
            method: 'GET',
            url: `https://zoopla4.p.rapidapi.com/properties/${localParams.id}`,
            headers: {
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': host,
            },
        };

        try {
            const response = await axios.request(options);
            setAccomData(response.data.data);
            setOriginalDesc(response.data.data.description);
            setDescription(response.data.data.description);
            console.log(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (localParams.id !== undefined) {
            fetchData();
        }
    }, []);

    const { width, height } = Dimensions.get('screen');

    const Pagination = ({ data, scrollX }) => {
        return (
            <View style={styles.dotContainer}>
                {data && data.length > 0
                    ? data.map((_, idx) => {
                          const inputRange = [
                              (idx - 1) * width,
                              idx * width,
                              (idx + 1) * width,
                          ];

                          const dotWidth = scrollX.interpolate({
                              inputRange,
                              outputRange: [12, 20, 12],
                              extrapolate: 'clamp',
                          });

                          return (
                              <Animated.View
                                  key={idx.toString()}
                                  style={[styles.dot, { width: dotWidth }]}
                              />
                          );
                      })
                    : null}
            </View>
        );
    };

    const SlideItem = ({ item }) => {
        return (
            <View style={styles.slidesContainer}>
                <Image source={{ uri: item }} style={styles.slides}></Image>
            </View>
        );
    };

    const Slider = () => {
        const scrollX = useRef(new Animated.Value(0)).current;

        const handleOnScroll = (event) => {
            Animated.event(
                [
                    {
                        nativeEvent: {
                            contentOffset: {
                                x: scrollX,
                            },
                        },
                    },
                ],
                {
                    useNativeDriver: false,
                }
            )(event);
        };

        return (
            <View>
                <FlatList
                    data={accomData.images}
                    renderItem={({ item }) => <SlideItem item={item} />}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleOnScroll}
                />
                <View>
                    <TouchableOpacity style={[styles.shareBtn, styles.shadow]}>
                        <FontAwesome size={30} name="share-alt" color="gray" />
                        <Text style={styles.shareTxt}>{i18n.t('share')}</Text>
                    </TouchableOpacity>
                </View>
                <Pagination data={accomData.images} scrollX={scrollX} />
            </View>
        );
    };

    // For localization update on android
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
        if (description != null) {
            if (translatedDesc.length === 0) {
                try {
                    const res = await translate(description, {
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
            {localParams.id === undefined ? (
                <View>
                    <Text>Listing is undefined ¯\_(ツ)_/¯</Text>
                </View>
            ) : accomData ? (
                <ScrollView>
                    <View>
                        <Slider />
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
                            <View
                                style={[styles.priceContainer, styles.shadow]}
                            >
                                <Text style={styles.price}>
                                    {`£${accomData.price}/${i18n.t('month')}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.horizLine, styles.container]}></View>

                    {/* Beds, baths + living rooms - only render if all three aren't null?*/}
                    <View style={[styles.container, styles.center, styles.row]}>
                        {accomData.baths ? (
                            <Text>
                                <FontAwesome
                                    name="bathtub"
                                    size={24}
                                    color="black"
                                />
                                {/* TODO PLURAL TRANSLATION? */}
                                <Text>
                                    {' '}
                                    {accomData.baths} {i18n.t('bath')}
                                </Text>
                            </Text>
                        ) : null}
                        {accomData.beds ? (
                            <Text>
                                {/* <FontAwesome5 name="bed" size={24} color="black" /> */}
                                <FontAwesome
                                    name="bed"
                                    size={24}
                                    color="black"
                                />
                                <Text>
                                    {' '}
                                    {accomData.beds} {i18n.t('bed')}
                                </Text>
                            </Text>
                        ) : null}
                        {accomData.livingRooms ? (
                            <Text>
                                <FontAwesome6
                                    name="couch"
                                    size={22}
                                    color="black"
                                />
                                <Text>
                                    {' '}
                                    {accomData.livingRooms} {i18n.t('livRoom')}
                                </Text>
                            </Text>
                        ) : null}
                    </View>

                    {/* Description - API returns a html formatted string */}
                    <View style={[styles.horizLine, styles.container]}>
                        <Text style={styles.containerTitles}>
                            {i18n.t('desc')}
                        </Text>
                    </View>
                    {description ? (
                        <View style={[styles.center, styles.container]}>
                            <View
                                style={[
                                    styles.informationContainer,
                                    styles.shadow,
                                ]}
                            >
                                <Text style={styles.descText}>
                                    {formatText(description)}
                                </Text>
                                {/* TODO detect language of description */}
                                {i18n.locale !== 'en' ? (
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
                        </View>
                    ) : null}

                    {/* Location */}
                    <View style={[styles.horizLine, styles.container]}>
                        <Text style={styles.containerTitles}>
                            {i18n.t('location')}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.container,
                            styles.twoRow,
                            styles.informationContainer,
                            styles.shadow,
                        ]}
                    >
                        <Text style={styles.rowText}>{accomData.address}</Text>
                        <Text style={styles.rowText}>
                            {accomData.postalCode}
                        </Text>
                    </View>

                    {/* Features  - only display if there are features and they're not undefined!*/}
                    {accomData.features !== undefined &&
                    accomData.features &&
                    accomData.features.length > 0 ? (
                        <View style={[styles.horizLine, styles.container]}>
                            <Text style={styles.containerTitles}>
                                {i18n.t('features')}
                            </Text>
                        </View>
                    ) : null}

                    {/* TODO - Translate Features */}
                    {accomData.features !== undefined &&
                    accomData.features &&
                    accomData.features.length > 0 ? (
                        <View
                            style={[
                                styles.container,
                                styles.informationContainer,
                                styles.shadow,
                            ]}
                        >
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
                    ) : null}

                    {/* Accessibility */}
                    <View style={[styles.horizLine, styles.container]}>
                        <Text style={styles.containerTitles}>
                            {i18n.t('accessibility')}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.container,
                            styles.informationContainer,
                            styles.shadow,
                        ]}
                    >
                        <Text>N/A</Text>
                        {/* Add random accessibility text? */}
                    </View>

                    {/* Rating */}
                    <View style={[styles.horizLine, styles.container]}>
                        <Text style={styles.containerTitles}>
                            {i18n.t('rating')}
                        </Text>
                    </View>

                    <View style={styles.ratingGroup}>
                        <View
                            style={[
                                styles.container,
                                styles.twoRow,
                                styles.informationContainer,
                                styles.shadow,
                                styles.rating,
                            ]}
                        >
                            <Text style={[styles.ratingText, styles.twoRow]}>
                                {`${randomRatings.avgRating}`}
                            </Text>
                            <Text style={styles.ratingText}>
                                <FontAwesome
                                    size={50}
                                    name="star"
                                    style={styles.star}
                                />
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.container,
                                styles.informationContainer,
                                styles.shadow,
                                styles.rating,
                            ]}
                        >
                            <View style={styles.twoRow}>
                                <Text style={{ fontWeight: '600' }}>
                                    {i18n.t('wifi')}
                                </Text>
                                <Text>{randomRatings.ratingsArr[0]}</Text>
                            </View>
                            <View style={styles.twoRow}>
                                <Text style={{ fontWeight: '600' }}>
                                    {i18n.t('location')}
                                </Text>
                                <Text>{randomRatings.ratingsArr[1]}</Text>
                            </View>
                            <View style={styles.twoRow}>
                                <Text style={{ fontWeight: '600' }}>
                                    {i18n.t('cleanliness')}
                                </Text>
                                <Text>{randomRatings.ratingsArr[2]}</Text>
                            </View>
                        </View>
                    </View>

                    {/* User Profile */}
                    <View style={[styles.horizLine, styles.container]}></View>
                    <View
                        style={[
                            styles.container,
                            styles.profileCard,
                            styles.center,
                            styles.shadow,
                        ]}
                    >
                        <View>
                            <Image
                                style={styles.profilePic}
                                source={require('.././images/profilePic.png')}
                            ></Image>
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
    informationContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 13,
    },
    priceContainer: {
        backgroundColor: '#1e1e1e',
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 13,
    },
    containerTitles: {
        fontSize: 20,
        fontWeight: '500',
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
        // borderBottomColor: '#0E0D0D',
        // borderBottomWidth: 1,
        marginBottom: 10,
        marginTop: 20,
        // backgroundColor: 'green',
        // fontSize: 30,
        paddingLeft: 20,
    },
    titleGroup: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // paddingTop: 25,
        alignContent: 'center',
    },
    datePosted: {
        color: '#494949',
        alignSelf: 'center',
    },
    price: {
        color: 'white',
        padding: 7,
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: '500',
    },
    accomTitle: {
        fontSize: 27,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    ratingGroup: {
        flexDirection: 'row',
        // gap: 10,
        marginBottom: 7,
    },
    rating: {
        flex: 1,
    },
    ratingText: {
        // backgroundColor:'blue',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 35,
        fontWeight: '600',
    },
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
        textAlign: 'left',
    },
    profileCard: {
        // borderColor: 'darkgray',
        // borderWidth: 1,
        borderRadius: 13,
        backgroundColor: '#C6FF00',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 30,
        marginVertical: 13,
    },
    profilePic: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
        width: 100,
        height: 100,
        margin: 10,
    },
    profileContainer: {
        // backgroundColor:'black',
        marginLeft: 20,
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
        fontWeight: '600',
        textAlign: 'center',
    },
    msgBtn: {
        backgroundColor: '#1e1e1e',
        borderRadius: 13,
        padding: 10,
    },
    msgTxt: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '700',
    },
    phoneNumber: {
        textAlign: 'center',
        fontWeight: '500',
    },
    shareBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 3,
        paddingHorizontal: 5,
        backgroundColor: 'white',
        // width: 90,
        alignSelf: 'flex-start', // Makes width fit text content? hopefully
        bottom: 280,
        left: 290,
        flexDirection: 'row',
        gap: 7,
    },
    shareTxt: {
        fontSize: 16,
        letterSpacing: 0.25,
        lineHeight: 21,
    },
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#171717',
                shadowOffset: { width: 4, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 7,
                shadowColor: 'black',
            },
        }),
    },
    slidesContainer: {
        width: Dimensions.get('screen').width,
        height: 300,
    },
    slides: {
        flex: 1,
        flexDirection: 'column',
        // width: '100%',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#CCC',
        marginHorizontal: 3,
        opacity: 0.5,
    },
    dotContainer: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        marginHorizontal: 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Probably should be a 'class'
    translateBtn: {
        backgroundColor: '#1e1e1e',
        borderRadius: 13,
        padding: 10,
        margin: 5,
    },
});
