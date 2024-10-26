import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

type PodcastDetailsRouteProp = {
  params: {
    podcast: {
      title: string;
      description: string;
      coverURL: string;
      audioURL: string;
      category: string;
      createdAt: string;
    };
  };
};

export default function PodcastDetails() {
  const route = useRoute<PodcastDetailsRouteProp>();
  const navigation = useNavigation();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false); // Kalp buton durumu
  const [position, setPosition] = useState(0); // Mevcut süre
  const [duration, setDuration] = useState(0); // Toplam süre

  const { title, description, coverURL, audioURL } = route.params.podcast;

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // Bellek temizleme
        }
      : undefined;
  }, [sound]);

  // Ses çalma/duraklatma fonksiyonu
  async function playSound() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: audioURL },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }

  // Çalma durumu güncelleme
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && status.isPlaying) {
      setPosition(status.positionMillis); // Mevcut süreyi güncelle
      setDuration(status.durationMillis); // Toplam süreyi güncelle
    }
  };

  // Slider ile sesi ileri/geri sarma
  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 1000 / 60);
    const seconds = Math.floor(millis / 1000) % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Kalp butonuna basıldığında içi dolu ve boş hali arasında geçiş yap
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FeatherIcon name="arrow-left" size={24} color="#481E30" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Podcast Details</Text>
      </View>

      {/* Podcast Bilgileri */}
      <View style={styles.content}>
        <Image source={{ uri: coverURL }} style={styles.coverImage} />

        {/* Podcast İsmi ve Kalp */}
        <View style={styles.titleHeartContainer}>
          <Text style={styles.podcastTitle}>{title}</Text>

          {/* Kalp Butonu */}
          <TouchableOpacity onPress={toggleFavorite} style={styles.heartButton}>
            <FeatherIcon
              name={isFavorited ? "heart" : "heart"} // Aynı icon, ama içi dolu veya boş
              size={28}
              color={isFavorited ? "#967D28" : "#967D28"} // Favori olunca slider ile aynı renk
              style={isFavorited ? styles.filledHeart : styles.emptyHeart}
            />
          </TouchableOpacity>
        </View>

        {/* Slider */}
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="#967D28"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#967D28" // Thumb rengi
          onSlidingComplete={handleSeek}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        {/* Ses Çalma Butonu */}
        <TouchableOpacity style={styles.playButton} onPress={playSound}>
          <View style={styles.circleButton}>
            <FeatherIcon name={isPlaying ? "pause" : "play"} size={40} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F4', // Arka plan rengi
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FBF9F4',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1000,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '600',
    color: '#481E30', // Başlık rengi koyu kahverengi
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  coverImage: {
    width: 250,
    height: 250,
    borderRadius: 5,
    marginBottom: 20,
  },
  titleHeartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  podcastTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#481E30', // Başlık rengi koyu kahverengi
    textAlign: 'center', // Ortaya hizalı
    flex: 1, // Boşluk yaratmak için
  },
  heartButton: {
    marginLeft: 10, // Kalp butonu ile podcast ismi arasında boşluk
  },
  emptyHeart: {
    color: '#967D28', // İçi boş kalp rengi (slider rengiyle aynı)
  },
  filledHeart: {
    color: '#967D28', // İçi dolu kalp rengi (slider rengiyle aynı)
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20, // Zaman göstergesi ile aradaki mesafe
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  timeText: {
    color: '#6c6c6c',
    fontSize: 12,
  },
  playButton: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#967D28', // Altın rengi çalma butonu
    justifyContent: 'center',
    alignItems: 'center',
  },
});