import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
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
    hasCalendarAccess: false
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [authToken, calendarAccess] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('googleCalendarAccess')
      ]);

      const status = {
        hasToken: !!authToken,
        hasCalendarAccess: !!calendarAccess
      };
      
      console.log('Auth status:', status);
      setAuthStatus(status);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({ hasToken: false, hasCalendarAccess: false });
    }
  };

  const handleRequestCalendarAccess = async () => {
    try {
      setIsLoading(true);
      
      // Navigate to the calendar permission screen
      navigation.navigate('Main' as never);
      
    } catch (error) {
      console.error('Calendar permission error:', error);
      Alert.alert(
        'Erreur d\'autorisation',
        'Impossible d\'obtenir l\'accès au calendrier. Veuillez réessayer.'
      );
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
        'Autorisation requise',
        'Nous avons besoin de votre autorisation pour accéder à votre Google Calendar.',
        [
          {
            text: 'Plus tard',
            style: 'cancel'
          },
          {
            text: 'Autoriser',
            onPress: handleRequestCalendarAccess
          }
        ]
      );
      return;
    }

    setIsLoading(true);
    try {
      const events = await syncGoogleCalendar();
      console.log('Sync successful:', events.length, 'events found');
      
      Alert.alert(
        'Succès',
        `${events.length} événements synchronisés avec succès`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Sync error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // Token expired, need to re-authenticate
          setAuthStatus(prev => ({ ...prev, hasToken: false }));
          navigation.navigate('Login' as never);
        } else if (error.message.includes('403')) {
          // Calendar permission revoked
          setAuthStatus(prev => ({ ...prev, hasCalendarAccess: false }));
          handleRequestCalendarAccess();
        } else {
          Alert.alert(
            'Erreur de synchronisation',
            'Impossible de synchroniser avec Google Calendar. Veuillez réessayer.'
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (!authStatus.hasToken) {
      return 'Se connecter avec Google';
    }
    if (!authStatus.hasCalendarAccess) {
      return 'Autoriser l\'accès au calendrier';
    }
    return 'Synchroniser avec Google Calendar';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Synchronisez votre calendrier avec vos amis</Text>
      
      <TouchableOpacity 
        style={[styles.syncButton, isLoading && styles.disabledButton]} 
        onPress={handleSyncGoogleCalendar}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.syncButtonText}>{getButtonText()}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.getStartedButton,
          (!authStatus.hasCalendarAccess || isLoading) && styles.disabledButton
        ]}
        onPress={() => navigation.navigate('Main' as never)}
        disabled={!authStatus.hasCalendarAccess || isLoading}
      >
        <Text style={styles.getStartedButtonText}>Commencer</Text>
      </TouchableOpacity>
      
      {authStatus.hasToken && !authStatus.hasCalendarAccess && (
        <Text style={styles.infoText}>
          L'accès au calendrier est nécessaire pour synchroniser vos événements
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
  }
});