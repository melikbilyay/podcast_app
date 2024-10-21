import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Switch,
    Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { auth } from '@/config/firebase'; // Import the Firebase auth instance

export default function Example() {
    const [form, setForm] = useState({
        emailNotifications: true,
        pushNotifications: false,
    });
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    // Handle sign-out
    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                setUser(null);
                navigation.navigate('(menu)/SignIn'); // Ensure you have a SignIn screen
            })
            .catch(error => {
                console.error("Error signing out: ", error);
            });
    };

    // Handle user authentication status
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    const handleProfilePress = () => {
        navigation.navigate('(menu)/SignUp'); // 'SignIn' ekranına yönlendir
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FBF9F4' }}>
            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <FeatherIcon name="arrow-left" size={24} color="#481E30" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ayarlar</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.section, { paddingTop: 4 }]}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <View style={styles.sectionBody}>
                        {user ? (
                            <TouchableOpacity
                                onPress={handleProfilePress}
                                style={styles.profile}>
                                <Image
                                    source={{ uri: user.photoURL || 'https://example.com/default-avatar.png' }}
                                    style={styles.profileAvatar} />

                                <View style={styles.profileBody}>
                                    <Text style={styles.profileName}>{user.displayName || 'John Doe'}</Text>
                                    <Text style={styles.profileHandle}>{user.email || 'john@example.com'}</Text>
                                </View>

                                <FeatherIcon
                                    color="#bcbcbc"
                                    name="chevron-right"
                                    size={22} />
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.profileName}          onPress={handleProfilePress}>Not Signed In</Text>

                        )}
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <View style={styles.sectionBody}>
                        {/* Language Option */}
                        <View style={[styles.rowWrapper, styles.rowFirst]}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Language</Text>

                                <View style={styles.rowSpacer} />

                                <Text style={styles.rowValue}>English</Text>

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>

                        {/* Email Notifications Option */}
                        <View style={styles.rowWrapper}>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>Email Notifications</Text>

                                <View style={styles.rowSpacer} />

                                <Switch
                                    onValueChange={emailNotifications =>
                                        setForm({ ...form, emailNotifications })
                                    }
                                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                    value={form.emailNotifications} />
                            </View>
                        </View>

                        {/* Push Notifications Option */}
                        <View style={[styles.rowWrapper, styles.rowLast]}>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>Push Notifications</Text>

                                <View style={styles.rowSpacer} />

                                <Switch
                                    onValueChange={pushNotifications =>
                                        setForm({ ...form, pushNotifications })
                                    }
                                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                    value={form.pushNotifications} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Resources Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resources</Text>

                    <View style={styles.sectionBody}>
                        {/* Contact Us Option */}
                        <View style={[styles.rowWrapper, styles.rowFirst]}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Contact Us</Text>

                                <View style={styles.rowSpacer} />

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>

                        {/* Report Bug Option */}
                        <View style={styles.rowWrapper}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Report Bug</Text>

                                <View style={styles.rowSpacer} />

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>

                        {/* Rate in App Store Option */}
                        <View style={styles.rowWrapper}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Rate in App Store</Text>

                                <View style={styles.rowSpacer} />

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>

                        {/* Terms and Privacy Option */}
                        <View style={[styles.rowWrapper, styles.rowLast]}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Terms and Privacy</Text>

                                <View style={styles.rowSpacer} />

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Log Out Option */}
                {user && (
                    <View style={styles.section}>
                        <View style={styles.sectionBody}>
                            <View
                                style={[
                                    styles.rowWrapper,
                                    styles.rowFirst,
                                    styles.rowLast,
                                    { alignItems: 'center' },
                                ]}>
                                <TouchableOpacity
                                    onPress={handleSignOut}
                                    style={styles.row}>
                                    <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                                        Log Out
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Footer */}
                <Text style={styles.contentFooter}>App Version 2.24 #50491</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    /** Header */
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
    /** Content */
    content: {
        paddingHorizontal: 16,
    },
    contentFooter: {
        marginTop: 24,
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
        color: '#a69f9f',
    },
    /** Section */
    section: {
        paddingVertical: 12,
    },
    sectionTitle: {
        margin: 8,
        marginLeft: 12,
        fontSize: 13,
        letterSpacing: 0.33,
        fontWeight: '500',
        color: '#481E30',
        textTransform: 'uppercase',
    },
    sectionBody: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 1,
    },
    /** Row */
    rowWrapper: {
        marginBottom: 12,
    },
    rowFirst: {
        marginTop: 0,
    },
    rowLast: {
        marginBottom: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#481E30',
    },
    rowLabelLogout: {
        color: '#F6C6C6',
    },
    rowSpacer: {
        flex: 1,
    },
    rowValue: {
        fontSize: 14,
        color: '#6c6c6c',
    },
    /** Profile */
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
    },
    profileBody: {
        flex: 1,
        marginLeft: 12,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#481E30',
    },
    profileHandle: {
        fontSize: 14,
        color: '#a69f9f',
    },
});
