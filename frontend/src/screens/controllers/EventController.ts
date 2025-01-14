import { Event } from '../models/Event';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventService } from '../services/EventService';

const BASE_URL = 'https://calendo-full.vercel.app/api/events'; 

export const EventController = {
  /**
   * Crée un nouvel événement.
   * @param {Event} event - L'événement à créer.
   * @returns {Promise<any>}
   */
  async createEvent(event: {
    title: string;
    location: string;
    startTime: string;
    endTime: string;
    teamId: string;
  }): Promise<any> {
    try {
      console.log('Données envoyées :', event);
  
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Erreur : Token non disponible');
        throw new Error('Vous devez être connecté pour effectuer cette action.');
      }
  
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });
  
      console.log('Statut de la réponse :', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur retournée par l\'API :', errorData);
        throw new Error(errorData.message || 'Erreur lors de la création de l’événement');
      }
  
      const responseData = await response.json();
      console.log('Réponse API :', responseData);
      return responseData;
    } catch (error) {
      console.error('Erreur dans EventController.createEvent :', error);
      throw error;
    }
  },
  

  /**
   * Récupère tous les événements d'un utilisateur.
   * @param {string} userId - L'ID de l'utilisateur.
   * @returns {Promise<Event[]>}
   */
  async getUserEvents(userId: string): Promise<Event[]> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Erreur : Token non disponible');
        throw new Error('Vous devez être connecté pour effectuer cette action.');
      }

      const response = await fetch(`${BASE_URL}/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Statut de la réponse :', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur retournée par l\'API :', errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des événements.');
      }

      const events = await response.json();
      console.log('Événements récupérés :', events);
      return events;
    } catch (error) {
      console.error('Erreur dans EventController.getUserEvents :', error);
      throw error;
    }
  },

  /**
   * Récupère les détails d'un événement par son ID.
   * @param {string} eventId - L'ID de l'événement.
   * @returns {Promise<Event>}
   */
  async getEventById(eventId: string): Promise<Event> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Erreur : Token non disponible');
        throw new Error('Vous devez être connecté pour effectuer cette action.');
      }

      const response = await fetch(`${BASE_URL}/details/${eventId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Statut de la réponse :', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur retournée par l\'API :', errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des détails de l’événement.');
      }

      const event = await response.json();
      console.log('Détails de l\'événement récupérés :', event);
      return event;
    } catch (error) {
      console.error('Erreur dans EventController.getEventById :', error);
      throw error;
    }
  },
};
