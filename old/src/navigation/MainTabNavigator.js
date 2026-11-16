import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import DiscoverScreen from '../screens/Discover/DiscoverScreen';
import RestaurantDetailScreen from '../screens/Discover/RestaurantDetailScreen';
import BookingScreen from '../screens/Booking/BookingScreen';
import MyBookingsScreen from '../screens/Booking/MyBookingsScreen';
import FeedScreen from '../screens/Feed/FeedScreen';
import PostDetailScreen from '../screens/Feed/PostDetailScreen';
import CreatePostScreen from '../screens/Feed/CreatePostScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOpts = { headerShown: false };

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="DiscoverHome" component={DiscoverScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
}

function FeedStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="FeedHome" component={FeedScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    </Stack.Navigator>
  );
}

function BookingsStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="MyBookingsHome" component={MyBookingsScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    </Stack.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { borderTopColor: colors.border, height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Discover: focused ? 'compass' : 'compass-outline',
            Feed: focused ? 'newspaper' : 'newspaper-outline',
            Bookings: focused ? 'calendar' : 'calendar-outline',
            Profile: focused ? 'person-circle' : 'person-circle-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverStack} />
      <Tab.Screen name="Feed" component={FeedStack} />
      <Tab.Screen name="Bookings" component={BookingsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
