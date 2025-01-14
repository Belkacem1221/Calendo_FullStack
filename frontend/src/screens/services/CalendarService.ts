import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://calendo-full.vercel.app';

export interface EventData {
  summary: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  timeZone: string;
}

export interface Event {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export interface MergedCalendar {
  message: string;
  mergedCalendar: Event[];
}

class APIError extends Error {
  constructor(
    message: string, 
    public status?: number, 
    public details?: string,
    public requestInfo?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function validateToken(token: string | null): Promise<string> {
  if (!token) {
    throw new APIError('No authentication token found', 401);
  }
  
  // Check if token format is valid (assuming JWT)
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    throw new APIError('Invalid token format', 401);
  }
  
  return token;
}

async function handleResponse<T>(response: Response, requestInfo: string): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorData = {};
    
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      console.error('Failed to parse error response:', errorText);
    }
    
    throw new APIError(
      (errorData as any).message || `Request failed with status ${response.status}`,
      response.status,
      (errorData as any).details,
      requestInfo
    );
  }
  
  if (!isJson) {
    console.warn('Response is not JSON:', await response.text());
    throw new APIError('Invalid response format', 500);
  }
  
  return response.json();
}

async function getAuthHeaders(): Promise<Headers> {
  const token = await AsyncStorage.getItem('authToken');
  const validatedToken = await validateToken(token);
  
  console.log('Auth token present:', !!validatedToken);
  
  return new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${validatedToken}`
  });
}

async function makeRequest<T>(
  endpoint: string,
  method: string,
  body?: any
): Promise<T> {
  const headers = await getAuthHeaders();
  const requestInfo = `${method} ${endpoint}`;
  
  console.log(`Making request: ${requestInfo}`);
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) })
  });
  
  return handleResponse<T>(response, requestInfo);
}

export const getGoogleCalendarEvents = async (): Promise<Event[]> => {
  try {
    console.log('Initiating calendar events fetch');
    return await makeRequest<Event[]>('/api/google/calendar/events', 'GET');
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to fetch calendar events');
  }
};

export const createGoogleCalendarEvent = async (eventData: EventData): Promise<{ id: string; status: string }> => {
  return makeRequest<{ id: string; status: string }>(
    '/api/google/calendar/create-event',
    'POST',
    eventData
  );
};

export const updateGoogleCalendarEvent = async (eventId: string, eventData: EventData): Promise<Event> => {
  return makeRequest<Event>(
    `/api/google/calendar/update-event/${eventId}`,
    'PUT',
    eventData
  );
};

export const deleteGoogleCalendarEvent = async (eventId: string): Promise<{ message: string }> => {
  return makeRequest<{ message: string }>(
    `/api/google/calendar/delete-event/${eventId}`,
    'DELETE'
  );
};

export const mergeTeamCalendars = async (teamId: string): Promise<MergedCalendar> => {
  return makeRequest<MergedCalendar>(
    `/api/teamCalendar/merge/${teamId}`,
    'GET'
  );
};

export const syncGoogleCalendar = async (): Promise<Event[]> => {
  try {
    console.log('Starting calendar sync process');
    
    // First check if we have a valid token
    const token = await AsyncStorage.getItem('authToken');
    await validateToken(token);
    
    console.log('Token validation successful');
    
    const events = await getGoogleCalendarEvents();
    console.log(`Successfully synced ${events.length} events`);
    return events;
  } catch (error) {
    console.error('Calendar sync failed:', error);
    if (error instanceof APIError) {
      if (error.status === 401) {
        throw new APIError(
          'Authentication failed. Please log in again.',
          401,
          error.details,
          error.requestInfo
        );
      } else if (error.status === 400) {
        throw new APIError(
          'Invalid request. Please check your calendar permissions.',
          400,
          error.details,
          error.requestInfo
        );
      }
      throw error;
    }
    throw new APIError('Calendar synchronization failed');
  }
};