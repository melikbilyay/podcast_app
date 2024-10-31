import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, getDocs } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MusicPlayer from '@/components/MusicPlayer';
import { db } from '@/config/firebase';
import { Image } from 'expo-image';

type Podcast = {
  id: string;
  title: string;
  audioURL: string;
  coverURL: string;
  category: string;
  description: string;
  createdAt: string;
};

const categories = ['Tümü', 'İlişkiler', 'Kişisel', 'Sağlık'];

const PodcastItem: React.FC<{ item: Podcast; onPress: (podcast: Podcast) => void }> = ({
                                                                                         item,
                                                                                         onPress,
                                                                                       }) => (
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
  const [error, setError] = useState<string | null>(null);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  const handlePress = (podcast: Podcast) => {
    if (selectedPodcast) {
      handleClosePlayer(); // Close the currently playing podcast
    }
    setSelectedPodcast(podcast);
    setPlayerVisible(true);
  };

  const handleClosePlayer = () => {
    setPlayerVisible(false);
    setSelectedPodcast(null);
  };

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'podcasts'));
        const fetchedPodcasts: Podcast[] = [];

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

        setPodcasts(fetchedPodcasts);
      } catch (error) {
        console.error('Error fetching podcasts: ', error);
        setError('Podcast verileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const filteredPodcasts = podcasts.filter(
      (podcast) =>
          (selectedCategory === 'Tümü' || podcast.category === selectedCategory) &&
          podcast.title.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlay = () => {
    if (filteredPodcasts.length > 0) {
      setSelectedPodcast(filteredPodcasts[0]); // Set the first podcast as the selected podcast
      setPlayerVisible(true); // Show the music player
    }
  };

  const handleShuffle = () => {
    if (filteredPodcasts.length > 0) {
      // Get a random index
      const randomIndex = Math.floor(Math.random() * filteredPodcasts.length);
      setSelectedPodcast(filteredPodcasts[randomIndex]); // Set a random podcast as the selected podcast
      setPlayerVisible(true); // Show the music player
    }
  };

  if (loading) {
    return (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#967d28" />
          <ThemedText>Yükleniyor...</ThemedText>
        </ThemedView>
    );
  }

  if (error) {
    return <ThemedText>{error}</ThemedText>;
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
          {categories.map((category) => (
              <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton,
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
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
        />

        {/* MusicPlayer component */}
        {playerVisible && selectedPodcast && (
            <MusicPlayer podcast={selectedPodcast} onClose={handleClosePlayer} isVisible={playerVisible} />
        )}
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F4',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBF9F4',
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
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#967d28',
    marginLeft: 10,
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
    elevation: 1,
    shadowColor: '#000',
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
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  podcastImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  podcastDetails: {
    flex: 1,
  },
  podcastTitle: {
    fontWeight: 'bold',
  },
});
