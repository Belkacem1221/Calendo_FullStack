const BASE_URL = 'https://calendo-full.vercel.app/api/teams';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const TeamController = {
  async getTeamDetails(teamId: string) {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Récupérez le token
      if (!token) {
        throw new Error('Token non disponible.');
      }

      const response = await fetch(`${BASE_URL}/${teamId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Incluez le token dans les en-têtes
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des détails de l\'équipe.');
      }

      return await response.json(); // Retournez les détails de l'équipe
    } catch (error) {
      console.error('Erreur dans getTeamDetails:', error);
      throw error;
    }
  },
  async getTeamsByUserId(userId: string) {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Récupérez le token
      if (!token) {
        throw new Error('Token non disponible.');
      }

      const response = await fetch(`${BASE_URL}/users/${userId}/teams`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Incluez le token dans les en-têtes
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des équipes.');
      }

      return await response.json(); // Retournez les équipes
    } catch (error) {
      console.error('Erreur dans getTeamsByUserId:', error);
      throw error;
    }
  },
  async getAllTeams() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token non disponible.');
      }
  
      console.log('Token utilisé pour la requête:', token);
  
      const response = await fetch(`${BASE_URL}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      console.log('Statut de la réponse:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Erreur retournée par l\'API:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des équipes.');
      }
  
      const data = await response.json();
      console.log('Équipes récupérées:', data);
      return data;
    } catch (error) {
      console.error('Erreur dans getAllTeams:', error);
      throw error;
    }
  }
  ,
  async createTeam(teamName: string) {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: teamName }),
    });
  
    const responseData = await response.json();
    console.log('API Response:', responseData);
  
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create team');
    }
  
    return responseData;
  },
  async getTeamByName(teamName: string) {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/${teamName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch team by name');
    return response.json();
  },
  async addMember(teamName: string, member: string) {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/add-member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ teamName, userId: member }),
    });
    if (!response.ok) throw new Error('Failed to add member');
    return response.json();
  },
  async removeMember(teamName: string, member: string) {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/remove-member`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ teamName, userId: member }),
    });
    if (!response.ok) throw new Error('Failed to remove member');
    return response.json();
  },
  async saveTeamChanges(teamName: string, members: string[]) {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/update-members`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ teamName, members }),
    });
    if (!response.ok) throw new Error('Failed to save team changes');
    return response.json();
  },
};

async function getToken() {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Token non disponible.');
    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token :', error);
    throw error;
  }
}
