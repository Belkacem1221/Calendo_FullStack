import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncGoogleCalendar } from '../services/CalendarService';

interface AuthStatus {
  hasToken: boolean;
  hasCalendarAccess: boolean;
}

export default function GetStartedScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    hasToken: false,
    hasCalendarAccess: false,
  });

  useEffect(() => {
    checkAuthStatus();

    const handleUrl = ({ url }: { url: string }) => {
      // Parse the URL from Google OAuth callback
      const queryParams = new URLSearchParams(url.split('?')[1]);
      const authCode = queryParams.get('code');

      if (authCode) {
        handleGoogleCallback(authCode);
      }
    };

    Linking.addEventListener('url', handleUrl);

    return () => {
      (Linking as any).removeEventListener('url', handleUrl);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [authToken, calendarAccess] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('googleCalendarAccess'),
      ]);

      const status = {
        hasToken: !!authToken,
        hasCalendarAccess: !!calendarAccess,
      };

      console.log('Auth status:', status);
      setAuthStatus(status);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({ hasToken: false, hasCalendarAccess: false });
    }
  };

  const handleGoogleCallback = async (authCode: string) => {
    try {
      const response = await fetch('https://calendo-full.vercel.app/api/google/oauth2callback', {
        method: 'POST',
        body: JSON.stringify({ code: authCode }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.access_token) {
        // Store the access token securely
        await AsyncStorage.setItem('authToken', data.access_token);
        await AsyncStorage.setItem('googleCalendarAccess', 'true');
        setAuthStatus({ hasToken: true, hasCalendarAccess: true });
        Alert.alert('Success', 'Google Calendar access granted.');
      } else {
        Alert.alert('Error', 'Failed to retrieve Google Calendar access token.');
      }
    } catch (error) {
      console.error('Error during callback handling', error);
      Alert.alert('Error', 'Failed to exchange auth code for token.');
    }
  };

  const handleRequestCalendarAccess = async () => {
    try {
      setIsLoading(true);

      // Fetch the Google Auth URL from the backend
      const response = await fetch('https://calendo-full.vercel.app/api/google/auth-url');
      const data = await response.json();
      if (data.authUrl) {
        Linking.openURL(data.authUrl); // Redirect user to Google OAuth page
      }
    } catch (error) {
      console.error('Calendar permission error:', error);
      Alert.alert('Authorization Error', 'Unable to obtain calendar access. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncGoogleCalendar = async () => {
    if (!authStatus.hasToken) {
      // Need to login first
      navigation.navigate('Login' as never);
      return;
    }

    if (!authStatus.hasCalendarAccess) {
      Alert.alert(
        'Authorization Required',
        'We need your permission to access your Google Calendar.',
        [
          {
            text: 'Later',
            style: 'cancel',
          },
          {
            text: 'Allow',
            onPress: handleRequestCalendarAccess,
          },
        ]
      );
      return;
    }

    setIsLoading(true);
    try {
      const events = await syncGoogleCalendar();
      console.log('Sync successful:', events.length, 'events found');

      Alert.alert(
        'Success',
        `${events.length} events synchronized successfully.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Sync error:', error);

      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // Token expired, need to re-authenticate
          setAuthStatus((prev) => ({ ...prev, hasToken: false }));
          navigation.navigate('Login' as never);
        } else if (error.message.includes('403')) {
          // Calendar permission revoked
          setAuthStatus((prev) => ({ ...prev, hasCalendarAccess: false }));
          handleRequestCalendarAccess();
        } else {
          Alert.alert(
            'Sync Error',
            'Failed to sync with Google Calendar. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (!authStatus.hasToken) {
      return 'Sign in with Google';
    }
    if (!authStatus.hasCalendarAccess) {
      return 'Allow calendar access';
    }
    return 'Sync with Google Calendar';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sync your calendar with your friends</Text>

      <TouchableOpacity
        style={[styles.syncButton, isLoading && styles.disabledButton]}
        onPress={handleSyncGoogleCalendar}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.syncButtonText}>{getButtonText()}</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.getStartedButton, (!authStatus.hasCalendarAccess || isLoading) && styles.disabledButton]}
        onPress={() => navigation.navigate('Main' as never)}
        disabled={!authStatus.hasCalendarAccess || isLoading}
      >
        <Text style={styles.getStartedButtonText}>Start</Text>
      </TouchableOpacity>

      {authStatus.hasToken && !authStatus.hasCalendarAccess && (
        <Text style={styles.infoText}>
          Calendar access is required to sync your events
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  syncButton: {
    backgroundColor: '#6495ED',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 30,
    width: '80%',
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  syncButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  getStartedButton: {
    backgroundColor: '#7F57FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  getStartedButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
  },
});
