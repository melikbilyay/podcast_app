import React, { useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,

} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { auth } from '@/config/firebase'; // Import the Firebase auth instance
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    // Handle sign-up
    const handleSignUp = () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up successfully
                const user = userCredential.user;
                console.log('User signed up:', user);
                // Navigate to a different screen if needed
                navigation.navigate('index'); // Adjust to your app's home screen
            })
            .catch(error => {
                setError(error.message);
                console.error("Error signing up: ", error);
            });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <FeatherIcon name="arrow-left" size={24} color="#481E30" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sign Up</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.form}>
                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        value={email}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        autoCapitalize="none"
                        onChangeText={setPassword}
                        value={password}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSignUp}
                    >
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FBF9F4',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 12,
        backgroundColor: '#FBF9F4',
        elevation: 2,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: 12,
        zIndex: 1000,
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '600',
        color: '#481E30',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 24,
        paddingHorizontal: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 1,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderBottomWidth: 1,
        marginBottom: 16,
        fontSize: 16,
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: '#481E30',
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
});
