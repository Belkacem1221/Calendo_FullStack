import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../models/Event';

const BASE_URL = 'https://calendo-full.vercel.app/api/events';

export const EventService = {
  async createEvent(event: Event): Promise<void> {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Token non disponible.');

    const response = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'événement.');
    }
  },

  async getUserEvents(userId: string): Promise<Event[]> {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Token non disponible.');

    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des événements.');
    }

    return await response.json();
  
  },

 

  async updateEvent(event: Event): Promise<void> {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Token non disponible.');

    const response = await fetch(`${BASE_URL}/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de l\'événement.');
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Token non disponible.');

    const response = await fetch(`${BASE_URL}/${eventId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'événement.');
    }
  },
  async getEventById(eventId: string): Promise<Event> {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Token non disponible.');
  
    const response = await fetch(`${BASE_URL}/details/${eventId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails de l\'événement.');
    }
  
    return await response.json();
  }
  
};
