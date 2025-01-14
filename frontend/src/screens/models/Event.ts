export type Event = {
  id?: string;
  title: string;
  location: string;
  date: string; // ISO date string
  time: string; // ISO time string
  participants?: string[]; // Liste des IDs des participants
  category?: string; // Catégorie ou équipe
};
