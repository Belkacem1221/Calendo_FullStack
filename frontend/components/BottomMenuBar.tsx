import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

// Screen imports
import HomeScreen from '../src/screens/Home/HomeScreen';
import TeamsScreen from '../src/screens/Teams/TeamsScreen';
import NotificationsScreen from '../src/screens/Notifications/NotificationsScreen';
import UserProfileScreen from '../src/screens/Profile/UserProfileScreen';

// Type for the tab navigation
type TabParamList = {
  Home: undefined;
  Teams: undefined;
  AddEvent: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function AppNavigator() {
  const navigation = useNavigation();

  const handleAddEvent = () => {
    // Utilisez la navigation depuis le stack parent
    navigation.navigate('AddEvent' as never);
  };

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarShowLabel: true,
    tabBarStyle: styles.tabBar,
    tabBarActiveTintColor: '#7F57FF',
    tabBarInactiveTintColor: '#555',
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
  <Tab.Screen
    name="Home"
    component={HomeScreen}
    options={{
      tabBarIcon: ({ color }) => (
        <Ionicons name="home-outline" size={22} color={color} />
      ),
      tabBarLabel: 'Home',
    }}
  />
  

  <Tab.Screen
    name="Teams"
    component={TeamsScreen}
    options={{
      tabBarIcon: ({ color }) => (
        <MaterialIcons name="group" size={26} color={color} />
      ),
      tabBarLabel: 'Teams',
    }}
  />

  {/* Utiliser une clé existante pour AddEvent */}
  <Tab.Screen
    name="AddEvent"
    component={View} // Ce composant ne sera jamais affiché
    options={{
      tabBarButton: () => (
        <TouchableOpacity
          style={styles.centralButton}
          onPress={() => navigation.navigate('AddEvent' as never)} // Navigue vers AddEvent
        >
          <View style={styles.buttonInner}>
            <Ionicons name="add" size={26} color="#FFF" />
          </View>
        </TouchableOpacity>
      ),
      tabBarLabel: '',
    }}
  />

  <Tab.Screen
    name="Notifications"
    component={NotificationsScreen}
    options={{
      tabBarIcon: ({ color }) => (
        <Ionicons name="notifications-outline" size={22} color={color} />
      ),
      tabBarLabel: 'Notif',
    }}
  />

  <Tab.Screen
    name="Profile"
    component={UserProfileScreen}
    options={{
      tabBarIcon: ({ color }) => (
        <Feather name="user" size={22} color={color} />
      ),
      tabBarLabel: 'Profile',
    }}
  />
</Tab.Navigator>

  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFF',
    height: 60,
    borderTopWidth: 0,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  centralButton: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    backgroundColor: '#7F57FF',
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7F57FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});