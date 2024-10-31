import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

interface CarouselItemType {
    id: string;
    title: string;
    image: any;
}

interface PodcastCardType {
    id: string;
    title: string;
    audioURL: string;
    coverURL: string;
    category: string;
    description: string;
    createdAt: string;
}

const carouselData = [
    { id: '1', title: 'Podcast 1', image: require('@/assets/images/icon.png') },
    { id: '2', title: 'Podcast 2', image: require('@/assets/images/icon.png') },
    { id: '3', title: 'Podcast 3', image: require('@/assets/images/icon.png') },
];

const CarouselItem: React.FC<{ item: CarouselItemType }> = ({ item }) => (
    <View style={styles.sliderItem}>
        <Image source={item.image} style={styles.sliderImage} />
        <ThemedText style={styles.sliderText}>{item.title}</ThemedText>
    </View>
);

const PodcastCard: React.FC<{ item: PodcastCardType }> = ({ item }) => (
    <View style={styles.card}>
        <Image source={{ uri: item.coverURL }} style={styles.cardImage} />
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
    const [newPodcasts, setNewPodcasts] = useState<PodcastCardType[]>([]);
    const [recommendedPodcasts, setRecommendedPodcasts] = useState<PodcastCardType[]>([]);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchPodcasts = async () => {
            setLoading(true); // Start loading
            try {
                const querySnapshot = await getDocs(collection(db, 'podcasts'));
                const fetchedPodcasts: PodcastCardType[] = [];

                querySnapshot.docs.forEach((doc) => {
                    const podcastData = doc.data();
                    fetchedPodcasts.push({
                        id: doc.id,
                        title: podcastData.title,
                        audioURL: podcastData.audioURL,
                        coverURL: podcastData.coverURL,
                        category: podcastData.category,
                        description: podcastData.description,
                        createdAt: podcastData.createdAt.toDate().toLocaleString(),
                    });
                });

                // Sort by createdAt date for new podcasts
                const sortedPodcasts = fetchedPodcasts.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });

                setNewPodcasts(sortedPodcasts.slice(0, 3));

                // Shuffle the recommended podcasts
                const shuffledPodcasts = fetchedPodcasts.sort(() => Math.random() - 0.5);
                setRecommendedPodcasts(shuffledPodcasts.slice(0, 3));
            } catch (error) {
                console.error('Error fetching podcasts:', error);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchPodcasts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <ThemedText style={styles.loadingText}>Yükleniyor...</ThemedText>
            </View>
        );
    }

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
                        data={newPodcasts}
                        renderItem={({ item }) => <PodcastCard item={item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardListContainer}
                    />
                </ThemedView>

                <View style={styles.divider} />

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText type="subtitle">Önerilen Podcastler</ThemedText>
                    <FlatList
                        data={recommendedPodcasts}
                        renderItem={({ item }) => <PodcastCard item={item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardListContainer}
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
        paddingVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBF9F4', // Background color during loading
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#967d28',
    },
});
