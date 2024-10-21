import React, { useState } from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase'; // Adjust the path as necessary
import { SignUpScreenNavigationProp } from '@/types/navigation'; // Adjust the path as necessary
import { StackActions } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FeatherIcon from "react-native-vector-icons/Feather"; // Import Feather icons

interface SignUpProps {
    navigation: SignUpScreenNavigationProp;
}

export default function SignUp({ navigation }: SignUpProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log('User signed up:', user);
                // Navigate to the Home screen
                navigation.dispatch(StackActions.replace('index')); // Ensure 'index' is the correct route name
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
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
                <Text style={styles.headerTitle}>Sign In</Text>
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
                        <Text style={styles.buttonText}>Sign In</Text>
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
