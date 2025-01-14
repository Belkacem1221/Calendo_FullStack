import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { EventController } from '../controllers/EventController';
import { Event } from '../models/Event';
import { RootStackParamList } from '../../../types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'EventDetails'>;
type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

export default function EventDetailsScreen() {
  const route = useRoute<EventDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { eventId } = route.params;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const fetchedEvent = await EventController.getUserEvents(eventId);
        if (fetchedEvent && fetchedEvent.length > 0) {
          setEvent(fetchedEvent[0]);
        } else {
          Alert.alert("Erreur", "L'événement n'a pas été trouvé !");
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("Erreur", "Impossible de récupérer les détails de l'événement.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucun détail disponible pour cet événement.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { title, location, date, time } = event;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de l'événement</Text>
      </View>

      {/* Event Details */}
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.detailRow}>
          <MaterialIcons name="place" size={20} color="#6495ED" />
          <Text style={styles.details}>{location}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="event" size={20} color="#6495ED" />
          <Text style={styles.details}>{date}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="access-time" size={20} color="#6495ED" />
          <Text style={styles.details}>{time}</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.voteButton}
        onPress={() => navigation.navigate('VoteScreen', { eventId })}
      >
        <Text style={styles.voteButtonText}>Voter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7F57FF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#FF0000',
  },
  eventDetailsContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  voteButton: {
    marginTop: 30,
    backgroundColor: '#6495ED',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  voteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
