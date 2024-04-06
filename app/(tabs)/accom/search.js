import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { key } from '../../../apiKey';
import { Link, useNavigation } from 'expo-router';
import { router } from 'expo-router';

export default function search() {
    const [SearchInput, setSearchInput] = useState('');
    const [listings, setListings] = useState(null);
    const [listingDetailed, setListingDetailed] = useState([]);
    const [minPrice, setMinPrice] = useState('0');
    const [maxPrice, setMaxPrice] = useState('5000');
    const [maxBeds, setMaxBeds] = useState('');
    const [minBeds, setMinBeds] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const navigation = useNavigation();

    // Set stack options
    useEffect(() => {
        navigation.setOptions({ title: 'Search', headerShown: false });
    }, [navigation]);

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
        }

        // setListings(exampleSearch.data);
        // console.log('set listings hopefully');
    };
    useEffect(() => {
        const fetchData = async () => {
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
                        console.log(response1.data, 'in the loop:', i);
                        // console.log(`listings length ${listings.length}`);
                        // console.log(listingDetailed);
                    }
                    console.log(listingDetailed, 'outside loop');
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchData();
    }, [listings]);

    // if (!listings){
    //     return(<Text>loading listings data</Text>)
    // }

    useEffect(() => {
        if (listingDetailed.length > 0) {
            const t = listingDetailed[listingDetailed.length - 1];
            console.log(t);
            console.log(typeof t);
            // console.log(JSON.stringify(t));
            // console.log(JSON.parse(t));
            // console.log(JSON.parse(JSON.stringify(t)));
            console.log(
                `length of listings details: ${JSON.stringify(
                    listingDetailed.length
                )}`
            );
            console.log(JSON.stringify(listingDetailed));
        }
    }, [listingDetailed]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Link href={{ pathname: '/accom/view' }}>test</Link>
            <TextInput
                style={styles.input}
                placeholder="Search properties"
                value={SearchInput}
                onChangeText={handleInputChange}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Image
                    source={require('../../../assets/glass.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
                <Image
                    source={require('../../../assets/filter_icon.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
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
            <Text>hello worlds</Text>
            <View style={styles.searchResults}>
                {listings &&
                    listingDetailed.length === listings.length &&
                    listingDetailed.map((listing, index) => (
                        <View style={styles.propertyOverview} key={listing.id}>
                            <Image
                                source={{ uri: listing.images[0] }}
                                style={{ width: 200, height: 200 }}
                            />
                            <Text>
                                {listing.name}
                                {'\n'}
                            </Text>
                            <Text>
                                {listing.type}
                                {'\n'}
                            </Text>
                            <Text>
                                {listing.address}
                                {'\n'}
                            </Text>
                            <Text></Text>
                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname: '/accom/view',
                                        params: {
                                            listing: JSON.stringify(listing),
                                            description: listing.description,
                                            id: listing.id,
                                            name: listing.name,
                                            postalCode: listing.postalCode,
                                            address: listing.address,
                                            baths: listing.baths,
                                            beds: listing.beds,
                                            images: listing.images,
                                            features: listing.features,
                                            livingRooms: listing.livingRooms,
                                            price: listing.price,
                                            agentName: listing.agentName,
                                            agentPhone: listing.agentPhone,
                                            availableFrom:
                                                listing.availableFrom,
                                        },
                                    })
                                }
                            >
                                <Text>View Accommodation Listing</Text>
                                {/* <Text>{JSON.stringify(listingDetailed)}</Text> */}
                            </Pressable>
                        </View>
                    ))}
            </View>
        </ScrollView>
    );
}

const styles = {
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        width: '100%',
    },
    button: {
        backgroundColor: 'lightblue',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
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
        width: '100%',
    },
    propertyOverview: {
        marginBottom: 20,
    },
    propertyImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        borderRadius: 10,
    },
    propertyText: {
        marginBottom: 5,
    },
};
