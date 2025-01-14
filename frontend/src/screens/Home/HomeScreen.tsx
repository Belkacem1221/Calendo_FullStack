import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EventController } from '../controllers/EventController';
import { Event } from '../models/Event';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté.');
        return;
      }
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      const fetchedEvents = await EventController.getUserEvents(userId);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les événements.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.eventCard, { borderLeftColor: '#6495ED' }]}
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
          >
            <Text style={styles.eventTitle}>{item.title}</Text>
            <View style={styles.eventDetailsRow}>
              <MaterialIcons name="event" size={18} color="#6495ED" />
              <Text style={styles.eventDetails}>{item.date}</Text>
            </View>
            <View style={styles.eventDetailsRow}>
              <MaterialIcons name="group" size={18} color="#6495ED" />
              <Text style={styles.eventDetails}>{item.category || 'Sans équipe'}</Text>
            </View>
            <View style={styles.eventDetailsRow}>
              <MaterialIcons name="location-on" size={18} color="#6495ED" />
              <Text style={styles.eventDetails}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Bienvenue sur Calendo</Text>
              <Text style={styles.headerSubtitle}>Gardez un œil sur vos prochains événements</Text>
            </View>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate]: { selected: true, marked: true, selectedColor: '#6A5ACD' },
              }}
              style={styles.calendar}
            />
            <Text style={styles.eventListTitle}>Événements</Text>
            <TouchableOpacity style={styles.addEventButton} onPress={() => setIsModalVisible(true)}>
              <AntDesign name="pluscircleo" size={24} color="#FFF" />
              <Text style={styles.addEventText}>Ajouter un événement</Text>
            </TouchableOpacity>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucun événement disponible. Ajoutez-en un pour commencer !
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Créer un nouvel événement</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#7F57FF',
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#DCDCDC',
    marginTop: 8,
  },
  calendar: {
    margin: 16,
    borderRadius: 10,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7F57FF',
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  addEventText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
  },
  eventListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  eventCard: {
    backgroundColor: '#FFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 5,
    marginHorizontal: 16,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 16,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#6495ED',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
  },
});
