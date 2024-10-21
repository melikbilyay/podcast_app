import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
        <Tabs.Screen
            name="podcasts"
            options={{
                title: 'Podcastler',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'musical-notes' : 'musical-notes-outline'} size={30} color={color} />
                ),
            }}
        />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anasayfa',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} size={30} color={color} />
          ),
        }}
      />
        <Tabs.Screen
            name="calendars"
            options={{
                title: 'Takvim',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} size={30} color={color} />
                ),
            }}
        />

    </Tabs>
  );
}
