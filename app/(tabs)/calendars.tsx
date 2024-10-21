import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { db } from '@/config/firebase'; // Adjust import based on your project structure
import { collection, getDocs } from 'firebase/firestore';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [events, setEvents] = useState<any[]>([]);
    const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

    // Fetch events from Firestore
    useEffect(() => {
        const fetchEvents = async () => {
            const eventCollection = collection(db, 'events'); // Adjust collection name if needed
            const eventSnapshot = await getDocs(eventCollection);
            const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventList);

            // Mark dates with events
            const dateMarks: { [key: string]: any } = {};
            eventList.forEach(event => {
                const eventDate = event.date; // Make sure 'date' is in 'YYYY-MM-DD' format
                if (!dateMarks[eventDate]) {
                    dateMarks[eventDate] = { marked: true, dotColor: 'red',}; // Customize dot color if needed
                }
            });
            setMarkedDates(dateMarks);
        };

        fetchEvents();
    }, []);

    const onDayPress = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
    };

    const getEventsForSelectedDate = () => {
        return events.filter(event => event.date === selectedDate);
    };

    const selectedEvents = getEventsForSelectedDate();

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">Takvim</ThemedText>
            </View>

            <Calendar
                onDayPress={onDayPress}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                }}
                theme={{
                    todayTextColor: '#00adf5',
                    arrowColor: 'orange',
                    textDayFontWeight: 'bold',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: 'bold',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                }}
                style={styles.calendar}
            />

            {selectedDate ? (
                <View>
                    <ThemedText style={styles.selectedDateText}>
                        Seçilen Tarih: {selectedDate}
                    </ThemedText>
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map(event => (
                            <View key={event.id} style={styles.eventContainer}>
                                {/* Display event title and description */}
                                <ThemedText style={styles.eventText}>
                                    {event.title} - {event.description}
                                </ThemedText>

                                {/* Display event cover image */}
                                {event.coverURL && (
                                    <Image
                                        source={{ uri: event.coverURL }}
                                        style={styles.eventImage}
                                    />
                                )}
                            </View>
                        ))
                    ) : (
                        <ThemedText style={styles.eventText}>Bu tarihte etkinlik yok.</ThemedText>
                    )}
                </View>
            ) : (
                <ThemedText style={styles.selectedDateText}>Lütfen bir tarih seçin</ThemedText>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    calendar: {
        borderRadius: 10,
        elevation: 3,
    },
    selectedDateText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
    eventContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    eventText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
        marginBottom: 8,
    },
    eventImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
});
