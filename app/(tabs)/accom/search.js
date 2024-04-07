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
    Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
// import { SearchBar } from '@rneui/themed';
import { SearchBar } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { key } from '../../../apiKey';
import { Link, useRouter } from 'expo-router';
import { router } from 'expo-router';

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
    const [value, setValue] = React.useState("");
    // const router = useRouter();

    const handleInputChange = (text) => {
        setSearchInput(text);
    };

    const handleSubmit = () => {
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
        setMaxBeds('0');
        setMinBeds('10');
        setIsFilterVisible(!isFilterVisible);
    };

    const toggleFilters = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const getListings = async () => {
        setLoading(true);
        setProgress(0)
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
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            // setLoading(true);
            if (listings) {
                try {
                    const headers = {
                        'X-RapidAPI-Key': key,
                        'X-RapidAPI-Host': 'zoopla4.p.rapidapi.com',
                    };
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
                } catch (error) {
                    console.error(error);
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
                        showCancel='true'
                        containerStyle={styles.searchContainer}
                        inputContainerStyle={styles.inputContainerStyle}
                        onChangeText={handleInputChange}
                    />

                    {/* Search Button */}
                    <TouchableOpacity style={styles.searchButton} onPress={handleSubmit}>
                        {/* <FontAwesome name="search" size={35} color="black" /> */}
                        <Text style={styles.searchButtonText}>
                            Search
                        </Text>
                    </TouchableOpacity>

                    {/* Filter Button */}
                    <TouchableOpacity style={styles.filterButton} onPress={() => setIsFilterVisible(true)}>
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
                                <Slider
                                    style={{ width: 200, marginVertical: 10 }}
                                    minimumValue={0}
                                    maximumValue={5000}
                                    step={50}
                                    value={minPrice}
                                    onValueChange={setMinPrice}
                                />
                                <Text>Min Price: {minPrice}</Text>
                                <Slider
                                    style={{ width: 200, marginVertical: 10 }}
                                    minimumValue={0}
                                    maximumValue={5000}
                                    step={50}
                                    value={maxPrice}
                                    onValueChange={setMaxPrice}
                                />
                                <Text>Max Price: {maxPrice}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={maxBeds}
                                    value={maxBeds}
                                    onChangeText={handleMaxBedsChange}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder={minBeds}
                                    value={minBeds}
                                    onChangeText={handleMinBedsChange}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: 'red' }]}
                                    onPress={handleClear}
                                >
                                    <Text style={{ color: 'white' }}>
                                        Clear Filters and Close
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={toggleFilters}
                                >
                                    <Text>Add Filters</Text>
                                </TouchableOpacity>
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
                            color = 'rgba(198,255,0,255)'
                            unfilledColor = 'white'
                            style={styles.progress}
                        />
                        <Text style={{
                            marginTop: 10, 
                            color: 'white', 
                            fontWeight: 'bold', 
                            fontSize: 16,
                            textAlign: 'center'
                        }}>
                            Loading...
                        </Text> 
                    </View>
                ) : (
                    <View style={styles.searchResults}>
                        {listings &&
                            listingDetailed.length === listings.length &&
                            listingDetailed.map((listing) => (
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
                                >
                                    <View style={[styles.propertyOverview, styles.shadow]} key={listing.id}>
                                        <Image style={styles.propertyImage}
                                            source={{ uri: listing.images[0] }}
                                            // style={{ width: 200, height: 200 }}
                                        />
                                        <Text style={[styles.propertyText, styles.propertyName]}>
                                            {listing.name}
                                            {/* {'\n'} */}
                                        </Text>
                                        <Text style={[styles.propertyText, styles.propertyAddress]}>
                                            {listing.address}
                                        </Text>
                                        <Text style={[styles.propertyText, styles.propertyPrice]}>
                                            {`£${listing.price}pcm`}
                                            {/* {'\n'} */}
                                        </Text>
                                        {/* <Text>View Accommodation Listing</Text> */}
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
    searchPageContainer: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingVertical: 20,
        // marginHorizontal: 20,
        
    },
    fdmLogo: {
        marginBottom: 30,
    },
    searchButton: {
        // backgroundColor: 'lightblue',
        borderRadius: 5,
        padding: 10,
        // marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText : {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    filterButton: {
        // backgroundColor: 'green', 
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
    searchResults: {
        marginTop: 20,
        // width: '100%',
    },
    propertyOverview: {
        // width: '100%',
        marginBottom: 30,
        backgroundColor: '#e6e6e6',
        paddingBottom: 10,
        borderRadius: 20,
    },
    propertyImage: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('screen').width - 5,
        height: 300,
        // margin: 20,
        // padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    propertyText: {
        textAlign: 'center',
        paddingHorizontal: 10,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propertyName: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    propertyAddress: {
        fontSize: 15,
    },
    propertyPrice: {
        fontSize: 20,
    },
    progressContainer: {

    },
    loadingText: {
        textAlign: 'center',
        color: 'white',
    },
    progress: {
        borderColor: 'none',
    },
    searchGroup: {
        width: Dimensions.get('screen').width - 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: 'row',
    },
    searchContainer: {
        width: '80%',
        height: 50,
        // backgroundColor: 'blue',
        borderRadius: 20,
    },
    inputContainerStyle: {
        backgroundColor: 'none',
        height: 10,
        borderRadius: 20,
    },
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
};
