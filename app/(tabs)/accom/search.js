import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
    Platform,
    Dimensions,
    Alert,
    ImageBackground,
} from 'react-native';
import * as React from 'react';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
import { Svg, Path } from 'react-native-svg';
import { useEffect, useState } from 'react';
import { key } from '../../../apiKey';
import { Link, useRouter } from 'expo-router';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import axios from 'axios';

export default function search() {
    const [SearchInput, setSearchInput] = useState('');
    const [Loading, setLoading] = useState(false);
    const [listings, setListings] = useState(null);
    const [listingDetailed, setListingDetailed] = useState([]);
    const [minPrice, setMinPrice] = useState('0');
    const [maxPrice, setMaxPrice] = useState('5000');
    const [maxBeds, setMaxBeds] = useState('');
    const [minBeds, setMinBeds] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [value, setValue] = React.useState('');
    // const router = useRouter();

    const handleInputChange = (text) => {
        setSearchInput(text);
    };

    const handleSubmit = () => {
        // if (listings === null || listings.length === 0) {
        if (SearchInput.length === 0) {
            Alert.alert(
                'No location entered',
                'Please enter a location and try again.',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('No location alert shown'),
                    },
                ]
            );
            return;
        }
        getListings();
    };

    const handleMaxBedsChange = (text) => {
        setMaxBeds(text);
    };

    const handleMinBedsChange = (text) => {
        setMinBeds(text);
    };

    const handleClear = () => {
        setSearchInput('');
        setMinPrice('0');
        setMaxPrice('5000');
        setMaxBeds('');
        setMinBeds('');
        // setIsFilterVisible(!isFilterVisible);
    };

    const toggleFilters = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const getListings = async () => {
        setLoading(true);
        setProgress(0);
        console.log(`In getListings(), SearchInput is ${SearchInput}`);

        const params = {
            locationKey: SearchInput,
            minPrice: minPrice,
            maxBeds: maxBeds,
            minBeds: minBeds,
            sort: 'recent',
            maxPrice: maxPrice,
        };

        const headers = {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': 'zoopla4.p.rapidapi.com',
        };

        try {
            const response = await axios.get(
                'https://zoopla4.p.rapidapi.com/properties/rent',
                { params, headers }
            );
            console.log(response.data);
            setListings(response.data.data);
            console.log(listings);

            // for (let i = 0; i < listings.length; i++) {
            //     const propertyID = listings[i].id;
            //     const response1 = await axios.get(`https://zoopla4.p.rapidapi.com/properties/${propertyID}`);
            //     setListingDetailed(prevListings => [...prevListings, response1.data]);
            // }

            if (response.data.data.length === 0) {
                // Show alert if no listings found
                Alert.alert(
                    'No Listings Found',
                    'Please try another location or adjust your search criteria.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                );
            }
        } catch (error) {
            console.error(error); // when presenting, comment out
            setLoading(false);
            Alert.alert('Empty input', 'Please enter a location', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (listings) {
                try {
                    const headers = {
                        'X-RapidAPI-Key': key,
                        'X-RapidAPI-Host': 'zoopla4.p.rapidapi.com',
                    };
                    if (listingDetailed.length > 0) {
                        setListingDetailed([]); // Have to clear previous search results
                    }
                    for (let i = 0; i < listings.length; i++) {
                        const propertyID = listings[i].id;
                        console.log(propertyID);
                        const response1 = await axios.get(
                            `https://zoopla4.p.rapidapi.com/properties/${propertyID}`,
                            { headers }
                        );
                        setListingDetailed((prevListings) => [
                            ...prevListings,
                            response1.data.data,
                        ]);
                        setProgress((i + 1) / listings.length);
                        console.log(response1.data, 'in the loop:', i);
                        // console.log(`listings length ${listings.length}`);
                        // console.log(listingDetailed);
                    }
                    console.log(listingDetailed, 'outside loop');
                    console.log(listingDetailed.length);
                    console.log(listings.length);
                } catch (error) {
                    console.error(error); // when presenting, comment out
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [listings]);

    // if (!listings){
    //     return(<Text>loading listings data</Text>)
    // }

    return (
        <View style={styles.searchPageContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.searchGroup}>
                    {/* FDM logo */}
                    <View style={styles.fdmLogo}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="292"
                            height="93"
                            viewBox="0 0 292 93"
                            fill="none"
                        >
                            <Path
                                d="M141.691 29.1292H70.6869V92.5729H141.691C151.537 92.5729 159.528 84.5745 159.528 74.7185V46.9836C159.528 37.1276 151.546 29.1292 141.691 29.1292ZM133.183 78.015C133.183 82.5664 129.496 86.2562 124.949 86.2562H97.024V35.446H124.949C129.496 35.446 133.183 39.1357 133.183 43.6871V78.015ZM8.23301 29.1292H59.7206V35.446H27.708C26.9474 35.446 26.3372 36.0568 26.3372 36.818V56.5882H59.7206V62.9049H26.3456V92.5646H0V37.3704C0 32.8189 3.68604 29.1292 8.23301 29.1292ZM264.693 12.4295C273.377 9.19169 282.563 5.2176 292 0.415176V92.5729H265.663V23.8834L245.118 61.7922V92.5646H218.772V35.9648L198.227 73.8736V92.5729H171.882V37.3618C171.882 32.9025 175.426 29.2631 179.881 29.1292C186.049 28.9452 192.168 28.4348 198.227 27.8324V60.6211L217.41 25.2304C226.42 23.6826 235.74 21.5658 245.118 18.8802V48.548L264.702 12.4295H264.693Z"
                                fill="#C5FF00"
                            />
                        </Svg>
                    </View>

                    {/* Search Bar */}
                    <SearchBar
                        placeholder="Search properties"
                        value={SearchInput}
                        cancelButtonTitle
                        showCancel="true"
                        containerStyle={styles.searchBarContainer}
                        inputContainerStyle={styles.inputContainerStyle}
                        onChangeText={handleInputChange}
                    />

                    {/* Search Button */}
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>

                    {/* Filter Button */}
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setIsFilterVisible(true)}
                    >
                        <Ionicons name="filter-sharp" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Filter Options */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isFilterVisible}
                        onRequestClose={() => setIsFilterVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    style={styles.filterCloseButton}
                                    onPress={() => setIsFilterVisible(false)}
                                >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color="black"
                                    />
                                </TouchableOpacity>

                                {/* Minimum Price Slider */}
                                <Text>Min Price: {minPrice}</Text>
                                <Slider
                                    style={{ width: '100%', marginVertical: 5 }}
                                    minimumValue={0}
                                    maximumValue={5000}
                                    step={50}
                                    value={minPrice}
                                    onValueChange={setMinPrice}
                                />

                                {/* Maximum Price Slider */}
                                <Text>Max Price: {maxPrice}</Text>
                                <Slider
                                    style={{ width: '100%', marginVertical: 5 }}
                                    minimumValue={0}
                                    maximumValue={5000}
                                    step={50}
                                    value={maxPrice}
                                    onValueChange={setMaxPrice}
                                />

                                {/* Minimum Beds */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Minimum beds"
                                    placeholderTextColor="gray"
                                    value={minBeds}
                                    onChangeText={handleMinBedsChange}
                                    keyboardType="numeric"
                                />

                                {/* Maximum Beds */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Maximum beds"
                                    placeholderTextColor="gray"
                                    value={maxBeds}
                                    onChangeText={handleMaxBedsChange}
                                    keyboardType="numeric"
                                />

                                <View style={styles.filterButtons}>
                                    {/* Clear Filters */}
                                    <TouchableOpacity
                                        style={styles.clearFilterButton}
                                        onPress={handleClear}
                                    >
                                        <Text style={styles.clearFilterText}>
                                            Clear Filters
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Apply */}
                                    <TouchableOpacity
                                        style={styles.applyFilterButton}
                                        onPress={toggleFilters}
                                    >
                                        <Text style={styles.applyFilterText}>
                                            Apply Filters
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>

                {Loading ? (
                    <View style={styles.progressContainer}>
                        <Progress.Bar
                            progress={progress}
                            width={Dimensions.get('screen').width - 50}
                            height={30}
                            borderRadius={20}
                            color="rgba(198,255,0,255)"
                            unfilledColor="white"
                            style={styles.progress}
                        />
                        <Text
                            style={{
                                marginTop: 10,
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 16,
                                textAlign: 'center',
                            }}
                        >
                            Loading...
                        </Text>
                    </View>
                ) : (
                    <View style={styles.searchResults}>
                        {listings &&
                            listingDetailed &&
                            // listingDetailed.length === 1 &&
                            listingDetailed.map((listing, index) => (
                                <Pressable
                                    onPress={() =>
                                        router.push({
                                            pathname: '/accom/view',
                                            params: {
                                                listing: listing,
                                                id: listing.id,
                                            },
                                        })
                                    }
                                    key={index}
                                >
                                    <View
                                        style={[
                                            styles.propertyOverview,
                                            styles.shadow,
                                        ]}
                                        key={listing.id}
                                    >
                                        {/* Property Image */}
                                        <ImageBackground
                                            style={styles.propertyImage}
                                            source={{ uri: listing.images[0] }}
                                        >
                                            <View>
                                                {listing.images.length === 0 ? (
                                                    <Text
                                                        style={styles.noImgTxt}
                                                    >
                                                        No images available for
                                                        this property
                                                    </Text>
                                                ) : null}
                                            </View>
                                        </ImageBackground>

                                        {/* Property Details */}
                                        <View style={styles.propertyText}>
                                            {/* Property Name */}
                                            <Text style={styles.propertyName}>
                                                {listing.name}
                                            </Text>
                                            {/* Property Address */}
                                            <View
                                                style={
                                                    styles.propertyAddressContainer
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.propertyAddress
                                                    }
                                                >
                                                    {listing.address}
                                                </Text>
                                            </View>
                                            {/* Property Price */}
                                            <View
                                                style={
                                                    styles.propertyPriceContainer
                                                }
                                            >
                                                <Text
                                                    style={styles.propertyPrice}
                                                >
                                                    {`£${listing.price}pcm`}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = {
    // Main containers
    searchPageContainer: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // FDM logo
    fdmLogo: {
        marginBottom: 30,
    },

    // Search Bar
    searchGroup: {
        width: Dimensions.get('screen').width - 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBarContainer: {
        width: '80%',
        height: 50,
        borderRadius: 20,
    },
    inputContainerStyle: {
        backgroundColor: 'none',
        height: 10,
        borderRadius: 20,
    },

    // Search Button
    searchButton: {
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },

    // Filter
    filterButton: {},
    input: {
        backgroundColor: '#cfcfcf',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    filterButtons: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
    },
    clearFilterButton: {
        fontWeight: '600',
        margin: 5,
        padding: 15,
        backgroundColor: 'black',
        borderRadius: 15,
    },
    applyFilterButton: {
        margin: 5,
        padding: 15,
        backgroundColor: 'black',
        borderRadius: 15,
    },
    applyFilterText: {
        color: 'white',
        fontWeight: '600',
    },
    filterCloseButton: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    clearFilterText: {
        color: 'white',
        fontWeight: '600',
    },

    // Search results
    searchResults: {
        // marginTop: 10,
    },

    // Listing
    propertyOverview: {
        marginBottom: 30,
        backgroundColor: '#e6e6e6',
        paddingBottom: 10,
        borderRadius: 20,
        marginHorizontal: 40,
    },
    propertyImage: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('screen').width - 40,
        height: 250,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    propertyText: {
        textAlign: 'center',
        paddingHorizontal: 10,
        marginTop: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propertyName: {
        marginTop: 5,
        fontSize: 25,
        fontWeight: 'bold',
    },
    propertyAddress: {
        fontSize: 15,
        marginBottom: 5,
        marginTop: 5,
    },
    propertyPrice: {
        fontSize: 20,
        fontWeight: '600',
    },
    propertyPriceContainer: {
        marginTop: 10,
        backgroundColor: '#D9D9D9',
        padding: 10,
        borderRadius: 20,
        marginBottom: 5,
    },

    // Loading bar
    loadingText: {
        textAlign: 'center',
        color: 'white',
    },
    progress: {
        borderColor: 'none',
    },

    // Shadow
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: 'black',
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
    noImgTxt: {
        textAlign: 'center',
        fontSize: 15,
    },
};
