import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, getDocs } from 'firebase/firestore';

import { db, storage } from '@/config/firebase';

// Define types for podcast
type Podcast = {
  id: string;
  title: string;
  audioURL: string; // URL string for audio from Firebase Storage
  coverURL: string; // URL string for image from Firebase Storage
  category: string;
  description: string;
  createdAt: string; // You may want to format this date later for display
};

const categories = ['Tümü', 'İlişkiler', 'Kişisel', 'Sağlık'];

const PodcastItem: React.FC<{ item: Podcast; onPress: (podcast: Podcast) => void }> = ({ item, onPress }) => (
    <TouchableOpacity style={styles.podcastItem} onPress={() => onPress(item)}>
      <Image source={{ uri: item.coverURL }} style={styles.podcastImage} />
      <View style={styles.podcastDetails}>
        <ThemedText style={styles.podcastTitle}>{item.title}</ThemedText>
        <ThemedText>{item.description}</ThemedText>
      </View>
    </TouchableOpacity>
);

export default function PodcastsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'podcasts')); // Fetch podcasts collection from Firestore
        const fetchedPodcasts: Podcast[] = [];

        for (const doc of querySnapshot.docs) {
          const podcastData = doc.data();
          fetchedPodcasts.push({
            id: doc.id,
            title: podcastData.title,
            audioURL: podcastData.audioURL, // Store audio URL
            coverURL: podcastData.coverURL,   // Store cover URL
            category: podcastData.category,
            description: podcastData.description,
            createdAt: podcastData.createdAt.toDate().toLocaleString(), // Format date if needed
          });
        }

        setPodcasts(fetchedPodcasts);
      } catch (error) {
        console.error('Error fetching podcasts: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const filteredPodcasts = podcasts
      .filter(podcast =>
          (selectedCategory === 'Tümü' || podcast.category === selectedCategory) &&
          podcast.title.toLowerCase().includes(search.toLowerCase())
      );

  const handlePress = (podcast: Podcast) => {
    navigation.navigate('podcastDetails', { podcast });
  };

  const handlePlay = () => {
    console.log('Play button pressed');
  };

  const handleShuffle = () => {
    console.log('Shuffle button pressed');
  };

  if (loading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  return (
      <ThemedView style={styles.container}>
        <TextInput
            style={styles.searchInput}
            placeholder="Search podcasts..."
            value={search}
            onChangeText={setSearch}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePlay}>
            <MaterialCommunityIcons name="play" size={24} color="#967d28" />
            <ThemedText style={styles.buttonText}>Play</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShuffle}>
            <MaterialCommunityIcons name="shuffle" size={24} color="#967d28" />
            <ThemedText style={styles.buttonText}>Shuffle</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryContainer}>
          {categories.map(category => (
              <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
              >
                <ThemedText style={styles.categoryText}>{category}</ThemedText>
              </TouchableOpacity>
          ))}
        </View>

        <FlatList
            data={filteredPodcasts}
            renderItem={({ item }) => <PodcastItem item={item} onPress={handlePress} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
        />
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F4',
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#967d28',
    marginLeft: 10, // Space between icon and text
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    margin: 4,
    elevation: 1, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedCategoryButton: {
    backgroundColor: '#F8F5ED',
  },
  categoryText: {
    color: '#967d28',
  },
  listContent: {
    paddingBottom: 20,
  },
  podcastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  podcastImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  podcastDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  podcastTitle: {
    fontWeight: 'bold',
  },
});
