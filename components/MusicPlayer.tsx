import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PanResponder } from 'react-native';
import { Audio } from 'expo-av';
import { Image } from 'expo-image';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';

interface Podcast {
    audioURL: string;
    coverURL: string;
    title: string;
}

interface MusicPlayerProps {
    isVisible: boolean;
    onClose: () => void;
    podcast: Podcast;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isVisible, onClose, podcast }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [translateY, setTranslateY] = useState(0);

    useEffect(() => {
        if (isVisible) {
            loadAudio();
        } else {
            unloadAudio();
        }
    }, [isVisible, podcast]);

    const loadAudio = async () => {
        await unloadAudio();
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: podcast.audioURL },
            { shouldPlay: true }
        );

        setSound(newSound);
        newSound.setOnPlaybackStatusUpdate(updatePlaybackStatus);

        const status = await newSound.getStatusAsync();
        if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
            setPosition(0);
        }
    };

    const updatePlaybackStatus = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            const playbackStatus = status as AVPlaybackStatusSuccess;
            setIsPlaying(playbackStatus.isPlaying);
            setPosition(playbackStatus.positionMillis);
            setDuration(playbackStatus.durationMillis || 0);
        }
    };

    const playPause = async () => {
        if (isPlaying && sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        } else if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const unloadAudio = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
            setIsPlaying(false);
            setPosition(0);
            setDuration(0);
        }
    };

    const handleClose = async () => {
        if (isMinimized) {
            unloadAudio();
            onClose();
        } else {
            setIsMinimized(true);
        }
    };

    const handleSliderValueChange = async (value: number) => {
        if (sound) {
            await sound.setPositionAsync(value);
        }
    };

    const formatTime = (millis: number) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = Math.floor((millis % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (sound) {
                updatePosition();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [sound]);

    const updatePosition = async () => {
        if (sound) {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
                const playbackStatus = status as AVPlaybackStatusSuccess;
                setPosition(playbackStatus.positionMillis || 0);
                setDuration(playbackStatus.durationMillis || 0);
            }
        }
    };

    const seekForward = async () => {
        if (sound) {
            const newPosition = Math.min(position + 10000, duration); // Seek forward 10 seconds
            await sound.setPositionAsync(newPosition);
            setPosition(newPosition);
        }
    };

    const seekBackward = async () => {
        if (sound) {
            const newPosition = Math.max(position - 10000, 0); // Seek backward 10 seconds
            await sound.setPositionAsync(newPosition);
            setPosition(newPosition);
        }
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dy) > 20,
        onPanResponderMove: (evt, gestureState) => {
            setTranslateY(gestureState.dy);
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dy > 50) {
                setIsMinimized(true);
            } else if (gestureState.dy < -50) {
                setIsMinimized(false);
            }
            setTranslateY(0);
        },
    });

    if (isMinimized) {
        return (
            <View style={styles.miniPlayerContainer}>
                <TouchableOpacity onPress={() => setIsMinimized(false)} style={styles.miniPlayerButton}>
                    <Image source={{ uri: podcast.coverURL }} style={styles.miniCoverImage} />
                    <Text style={styles.miniPlayerText}>{podcast.title}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={playPause} style={styles.miniPlayPauseButton}>
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#752F1F" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#752F1F" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.fullPlayerContainer, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButtonfull}>
                <Ionicons name="arrow-down" size={32} color="red" />
            </TouchableOpacity>
            <Text style={styles.title}>{podcast.title}</Text>
            <Image source={{ uri: podcast.coverURL }} style={styles.coverImage} />
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onValueChange={handleSliderValueChange}
                thumbTintColor="#752F1F"
                minimumTrackTintColor="#752F1F"
                maximumTrackTintColor="#C0C0C0"
            />
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(position)}</Text>
                <Text style={styles.timerText}>{formatTime(duration)}</Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity onPress={seekBackward} style={styles.seekButton}>
                    <Ionicons name="play-back" size={34} color="#752F1F" />
                </TouchableOpacity>
                <TouchableOpacity onPress={playPause} style={styles.playPauseButton}>
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={34} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={seekForward} style={styles.seekButton}>
                    <Ionicons name="play-forward" size={34} color="#752F1F" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    fullPlayerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FDECEF',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 10,
    },
    miniPlayerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
    },
    miniCoverImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    miniPlayerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniPlayerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#752F1F',
    },
    miniPlayPauseButton: {
        padding: 10,
    },
    closeButton: {
        padding: 10,
    },
    closeButtonfull: {
        padding: 10,
        position: 'absolute',
        top: 50,
        right: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#752F1F',
        marginBottom: 10,
    },
    coverImage: {
        width: 220,
        height: 220,
        borderRadius: 10,
        marginBottom: 20,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    timerText: {
        color: '#752F1F',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    playPauseButton: {
        padding: 15,
        backgroundColor: '#752F1F',
        borderRadius: 20,
    },
    seekButton: {
        padding: 10,
    },
});

export default MusicPlayer;
