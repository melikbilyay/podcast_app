import React from 'react';
import { StyleSheet, View, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const { width } = Dimensions.get('window');

interface CarouselItemType {
    id: string;
    title: string;
    image: any; // Consider replacing `any` with a more specific type like `ImageSourcePropType` if needed
}

interface PodcastCardType {
    id: string;
    title: string;
    image: any; // Same as above
}


const carouselData = [
    { id: '1', title: 'Podcast 1', image: require('@/assets/images/icon.png') },
    { id: '2', title: 'Podcast 2', image: require('@/assets/images/icon.png') },
    { id: '3', title: 'Podcast 3', image: require('@/assets/images/icon.png') },
];

const podcastData = [
    { id: '4', title: 'New Podcast 1', image: require('@/assets/images/icon.png') },
    { id: '5', title: 'New Podcast 2', image: require('@/assets/images/icon.png') },
    { id: '6', title: 'New Podcast 3', image: require('@/assets/images/icon.png') },
];

const recommendedData = [
    { id: '7', title: 'Recommended Podcast 1', image: require('@/assets/images/icon.png') },
    { id: '8', title: 'Recommended Podcast 2', image: require('@/assets/images/icon.png') },
    { id: '9', title: 'Recommended Podcast 3', image: require('@/assets/images/icon.png') },
];

const CarouselItem: React.FC<{ item: CarouselItemType }> = ({ item }) => (
    <View style={styles.sliderItem}>
        <Image source={item.image} style={styles.sliderImage} />
        <ThemedText style={styles.sliderText}>{item.title}</ThemedText>
    </View>
);

const PodcastCard: React.FC<{ item: PodcastCardType }> = ({ item }) => (
    <View style={styles.card}>
        <Image source={item.image} style={styles.cardImage} />
        <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
    </View>
);
export type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
    '(menu)/settings': undefined;
};
export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.content}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('(menu)/settings')}
                >
                    <MaterialCommunityIcons name="dots-horizontal" size={30} color="black" />
                </TouchableOpacity>

                <Carousel
                    loop
                    width={width}
                    height={200}
                    autoPlay
                    data={carouselData}
                    renderItem={({ item }) => <CarouselItem item={item} />}
                    scrollAnimationDuration={1000}
                />

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText type="subtitle">Yeni Çıkan Podcastler</ThemedText>
                    <FlatList
                        data={podcastData}
                        renderItem={({ item }) => <PodcastCard item={item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardListContainer} // Add padding here
                    />
                </ThemedView>

                <View style={styles.divider} />

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText type="subtitle">Önerilen Podcastler</ThemedText>
                    <FlatList
                        data={recommendedData}
                        renderItem={({ item }) => <PodcastCard item={item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardListContainer} // Add padding here
                    />
                </ThemedView>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF9F4',
    },
    content: {
        flex: 1,
        padding: 16,
        marginTop: 30,
    },
    sliderItem: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden',
    },
    sliderImage: {
        width: '100%',
        height: '80%',
        borderRadius: 8,
        marginRight: 55,
    },
    sliderText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        marginRight: 15,
        padding: 10,
        width: 150,
    },
    cardImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
    },
    cardTitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    menuButton: {
        position: 'absolute',
        top: -30,
        right: 20,
        zIndex: 1000,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 20,
    },
    cardListContainer: {
        paddingVertical: 10, // Adjust this value to add space between the title and cards
    },
});
