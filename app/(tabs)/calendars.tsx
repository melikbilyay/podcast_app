import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Linking, Modal, Button, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { db } from '@/config/firebase'; // Projenizin yapısına göre import'u ayarlayın
import { collection, getDocs } from 'firebase/firestore';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarScreen() {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch events from Firestore
    useEffect(() => {
        const fetchEvents = async () => {
            const eventCollection = collection(db, 'events');
            const eventSnapshot = await getDocs(eventCollection);
            const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Verileri kontrol et
            console.log("Fetched events:", eventList);
            setEvents(eventList);
        };

        fetchEvents();
    }, []);

    const handleEventPress = (event: any) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    const openExternalLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error("An error occurred", err));
    };

    const renderEventItem = ({ item }: { item: any }) => {
        // Açıklamadan sadece ilk 4 kelimeyi al
        const shortDescription = item.description.split(' ').slice(0, 4).join(' ') + '...';

        return (
            <TouchableOpacity
                style={styles.eventContainer}
                activeOpacity={0.7}
                onPress={() => handleEventPress(item)} // Etkinliğe tıklama
            >
                {/* Event Image */}
                {item.coverURL && (
                    <Image
                        source={{ uri: item.coverURL }}
                        style={styles.eventImage}
                    />
                )}

                {/* Event Details */}
                <View style={styles.eventDetails}>
                    <View style={styles.eventHeader}>
                        <Ionicons name="calendar-outline" size={16} color="#6C757D" />
                        <ThemedText style={styles.eventDate}>
                            {item.date || "Tarih bilgisi yok"}
                        </ThemedText>
                    </View>
                    <ThemedText style={styles.eventTitle}>
                        {item.title || "Başlık bilgisi yok"}
                    </ThemedText>
                    <ThemedText style={styles.eventText}>
                        {shortDescription} {/* Kısa açıklama */}
                    </ThemedText>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">Etkinlikler</ThemedText>
            </View>

            {events.length > 0 ? (
                <FlatList
                    data={events}
                    renderItem={renderEventItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.eventList}
                />
            ) : (
                <ThemedText style={styles.eventText}>Henüz etkinlik yok.</ThemedText>
            )}

            {/* Modal for Event Details */}
            {selectedEvent && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <ThemedText type="title" style={styles.modalTitle}>{selectedEvent.title}</ThemedText>
                            <ScrollView style={styles.scrollContainer}>
                                <ThemedText style={styles.modalDescription}>{selectedEvent.description}</ThemedText>
                            </ScrollView>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => openExternalLink(selectedEvent.url)}
                            >
                                <ThemedText style={styles.buttonText}>Hemen aramıza katıl !</ThemedText>
                            </TouchableOpacity>
                            <Button
                                title="Kapat"
                                color="#752F1F"
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedEvent(null);
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F9FA',

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    eventList: {
        paddingBottom: 16,
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginTop: 16,
        marginBottom: 12,
        borderColor: '#E3E3E3',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    eventImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 16,
        backgroundColor: '#E5E5E5',
    },
    eventDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventDate: {
        fontSize: 14,
        color: '#6C757D',
        marginLeft: 4,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#967d28',
        marginBottom: 4,
    },
    eventText: {
        fontSize: 16,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,

    },
    modalDescription: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    scrollContainer: {
        maxHeight: 200, // Max yükseklik ayarı, kaydırma için
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#752F1F',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
