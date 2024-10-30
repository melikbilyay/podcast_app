import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PanResponder } from 'react-native';
import { Audio } from 'expo-av';
import { Image } from 'expo-image';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

const MusicPlayer = ({ isVisible, onClose, podcast }) => {
    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [translateY, setTranslateY] = useState(0);

    useEffect(() => {
        if (isVisible) {
            setupPlayer();
        } else {
            unloadAudio();
        }
    }, [isVisible]);

    const setupPlayer = async () => {
        const { sound } = await Audio.Sound.createAsync(
            { uri: podcast.audioURL },
            { shouldPlay: true }
        );
        setSound(sound);
        sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
        setDuration((await sound.getStatusAsync()).durationMillis);
    };

    const updatePlaybackStatus = (status) => {
        setIsPlaying(status.isPlaying);
        setPosition(status.positionMillis);
    };

    const playPause = async () => {
        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
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

    const unloadAudio = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
    };

    const handleSliderValueChange = async (value) => {
        if (sound) {
            await sound.setPositionAsync(value);
        }
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
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
        }
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dy) > 20,
        onPanResponderMove: (evt, gestureState) => {
            setTranslateY(gestureState.dy);
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dy > 100) {
                setIsMinimized(true);
            } else if (gestureState.dy < -100) {
                setIsMinimized(false);
            }
            setTranslateY(0);
        },
    });

    // Mini Player Layout
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

    // Full-Screen Player Layout
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
                thumbTintColor="#752F1F" // Change thumb color
                minimumTrackTintColor="#752F1F" // Change minimum track color
                maximumTrackTintColor="#C0C0C0" // Change maximum track color
            />
            <View style={styles.controls}>
                <TouchableOpacity onPress={playPause} style={styles.playPauseButton}>
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#FFF" />
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
        backgroundColor: '#FDECEF', // Background color
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
        textAlign: 'center',
    },
    coverImage: {
        width: 240,
        height: 240,
        borderRadius: 10,
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 20,
        color: '#752F1F',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    playPauseButton: {
        padding: 10,
        backgroundColor: '#752F1F', // Button background color
        borderRadius: 5,
        elevation: 5,
    },
});

export default MusicPlayer;
