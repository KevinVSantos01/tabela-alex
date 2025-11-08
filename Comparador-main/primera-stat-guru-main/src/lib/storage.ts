import { ClubStats } from '@/types/football';
import { INITIAL_CLUBS } from './clubs';

const STORAGE_KEY = 'primera-federacion-stats';

export const loadClubs = (): ClubStats[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading clubs:', error);
  }
  
  // Initialize with IDs
  return INITIAL_CLUBS.map((club, index) => ({
    ...club,
    id: `club-${index}`
  }));
};

export const saveClubs = (clubs: ClubStats[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clubs));
  } catch (error) {
    console.error('Error saving clubs:', error);
  }
};

export const resetAllData = (): ClubStats[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting data:', error);
  }
  return loadClubs();
};

export const exportToJSON = (clubs: ClubStats[]): void => {
  const dataStr = JSON.stringify(clubs, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `primera-federacion-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (clubs: ClubStats[]): void => {
  const headers = ['Clube', 'Grupo', 'Gols Marcados Casa', 'Gols Marcados Fora', 'Gols Sofridos Casa', 'Gols Sofridos Fora', 'Amarelos Casa', 'Amarelos Fora', 'Vermelhos Casa', 'Vermelhos Fora'];
  
  const rows = clubs.map(club => [
    club.name,
    club.group,
    club.goalsScored.home.length,
    club.goalsScored.away.length,
    club.goalsConceded.home.length,
    club.goalsConceded.away.length,
    club.yellowCards.home,
    club.yellowCards.away,
    club.redCards.home,
    club.redCards.away
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `primera-federacion-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file: File): Promise<ClubStats[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
