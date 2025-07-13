// Sports API service for real match data and leaderboards

// Free tier API key - replace with your own from football-data.org API
const API_KEY = ''; // Get from https://www.football-data.org/
const BASE_URL = 'https://api.football-data.org/v4';

// Alternative free API endpoints (no key required)
const ALTERNATIVE_BASE_URL = 'https://api.football-data.org/v4';

export interface Competition {
  id: number;
  name: string;
  code: string;
  emblem: string;
  area: {
    name: string;
    code: string;
  };
  currentSeason: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
  };
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
}

export interface Match {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
  matchday: number;
  stage: string;
  group?: string;
  lastUpdated: string;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    winner?: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW';
    duration: string;
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: Competition;
}

export interface Standing {
  position: number;
  team: Team;
  playedGames: number;
  form: string;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface Scorer {
  player: {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    position: string;
  };
  team: Team;
  goals: number;
  assists: number;
  penalties: number;
}

class SportsApiService {
  private headers = {
    'X-Auth-Token': API_KEY,
    'Content-Type': 'application/json',
  };

  // Fallback data for when API is unavailable
  private getFallbackMatches(): Match[] {
    return [
      {
        id: 1,
        utcDate: new Date().toISOString(),
        status: 'LIVE',
        matchday: 15,
        stage: 'REGULAR_SEASON',
        lastUpdated: new Date().toISOString(),
        homeTeam: {
          id: 66,
          name: 'Manchester United',
          shortName: 'Man United',
          tla: 'MUN',
          crest: 'https://crests.football-data.org/66.png',
          address: 'Old Trafford, Manchester',
          website: 'https://www.manutd.com',
          founded: 1878,
          clubColors: 'Red / White',
          venue: 'Old Trafford'
        },
        awayTeam: {
          id: 64,
          name: 'Liverpool FC',
          shortName: 'Liverpool',
          tla: 'LIV',
          crest: 'https://crests.football-data.org/64.png',
          address: 'Anfield, Liverpool',
          website: 'https://www.liverpoolfc.com',
          founded: 1892,
          clubColors: 'Red',
          venue: 'Anfield'
        },
        score: {
          winner: 'HOME_TEAM',
          duration: 'REGULAR',
          fullTime: { home: 2, away: 1 },
          halfTime: { home: 1, away: 0 }
        },
        competition: {
          id: 2021,
          name: 'Premier League',
          code: 'PL',
          emblem: 'https://crests.football-data.org/PL.png',
          area: { name: 'England', code: 'ENG' },
          currentSeason: {
            id: 1564,
            startDate: '2024-08-17',
            endDate: '2025-05-25',
            currentMatchday: 15
          }
        }
      },
      {
        id: 2,
        utcDate: new Date(Date.now() + 3600000).toISOString(),
        status: 'SCHEDULED',
        matchday: 15,
        stage: 'REGULAR_SEASON',
        lastUpdated: new Date().toISOString(),
        homeTeam: {
          id: 57,
          name: 'Arsenal FC',
          shortName: 'Arsenal',
          tla: 'ARS',
          crest: 'https://crests.football-data.org/57.png',
          address: 'Emirates Stadium, London',
          website: 'https://www.arsenal.com',
          founded: 1886,
          clubColors: 'Red / White',
          venue: 'Emirates Stadium'
        },
        awayTeam: {
          id: 61,
          name: 'Chelsea FC',
          shortName: 'Chelsea',
          tla: 'CHE',
          crest: 'https://crests.football-data.org/61.png',
          address: 'Stamford Bridge, London',
          website: 'https://www.chelseafc.com',
          founded: 1905,
          clubColors: 'Blue',
          venue: 'Stamford Bridge'
        },
        score: {
          duration: 'REGULAR',
          fullTime: { home: null, away: null },
          halfTime: { home: null, away: null }
        },
        competition: {
          id: 2021,
          name: 'Premier League',
          code: 'PL',
          emblem: 'https://crests.football-data.org/PL.png',
          area: { name: 'England', code: 'ENG' },
          currentSeason: {
            id: 1564,
            startDate: '2024-08-17',
            endDate: '2025-05-25',
            currentMatchday: 15
          }
        }
      }
    ];
  }

  private getFallbackStandings(): Standing[] {
    return [
      {
        position: 1,
        team: {
          id: 65,
          name: 'Manchester City',
          shortName: 'Man City',
          tla: 'MCI',
          crest: 'https://crests.football-data.org/65.png',
          address: 'Etihad Stadium, Manchester',
          website: 'https://www.mancity.com',
          founded: 1880,
          clubColors: 'Sky Blue / White',
          venue: 'Etihad Stadium'
        },
        playedGames: 14,
        form: 'W,W,D,W,W',
        won: 10,
        draw: 2,
        lost: 2,
        points: 32,
        goalsFor: 28,
        goalsAgainst: 12,
        goalDifference: 16
      },
      {
        position: 2,
        team: {
          id: 64,
          name: 'Liverpool FC',
          shortName: 'Liverpool',
          tla: 'LIV',
          crest: 'https://crests.football-data.org/64.png',
          address: 'Anfield, Liverpool',
          website: 'https://www.liverpoolfc.com',
          founded: 1892,
          clubColors: 'Red',
          venue: 'Anfield'
        },
        playedGames: 14,
        form: 'W,W,W,D,W',
        won: 9,
        draw: 3,
        lost: 2,
        points: 30,
        goalsFor: 26,
        goalsAgainst: 14,
        goalDifference: 12
      },
      {
        position: 3,
        team: {
          id: 57,
          name: 'Arsenal FC',
          shortName: 'Arsenal',
          tla: 'ARS',
          crest: 'https://crests.football-data.org/57.png',
          address: 'Emirates Stadium, London',
          website: 'https://www.arsenal.com',
          founded: 1886,
          clubColors: 'Red / White',
          venue: 'Emirates Stadium'
        },
        playedGames: 14,
        form: 'W,D,W,L,W',
        won: 8,
        draw: 4,
        lost: 2,
        points: 28,
        goalsFor: 24,
        goalsAgainst: 15,
        goalDifference: 9
      }
    ];
  }

  private getFallbackScorers(): Scorer[] {
    return [
      {
        player: {
          id: 1,
          name: 'Erling Haaland',
          firstName: 'Erling',
          lastName: 'Haaland',
          dateOfBirth: '2000-07-21',
          nationality: 'Norway',
          position: 'Centre-Forward'
        },
        team: {
          id: 65,
          name: 'Manchester City',
          shortName: 'Man City',
          tla: 'MCI',
          crest: 'https://crests.football-data.org/65.png',
          address: 'Etihad Stadium, Manchester',
          website: 'https://www.mancity.com',
          founded: 1880,
          clubColors: 'Sky Blue / White',
          venue: 'Etihad Stadium'
        },
        goals: 18,
        assists: 3,
        penalties: 2
      },
      {
        player: {
          id: 2,
          name: 'Mohamed Salah',
          firstName: 'Mohamed',
          lastName: 'Salah',
          dateOfBirth: '1992-06-15',
          nationality: 'Egypt',
          position: 'Right Winger'
        },
        team: {
          id: 64,
          name: 'Liverpool FC',
          shortName: 'Liverpool',
          tla: 'LIV',
          crest: 'https://crests.football-data.org/64.png',
          address: 'Anfield, Liverpool',
          website: 'https://www.liverpoolfc.com',
          founded: 1892,
          clubColors: 'Red',
          venue: 'Anfield'
        },
        goals: 15,
        assists: 8,
        penalties: 1
      },
      {
        player: {
          id: 3,
          name: 'Harry Kane',
          firstName: 'Harry',
          lastName: 'Kane',
          dateOfBirth: '1993-07-28',
          nationality: 'England',
          position: 'Centre-Forward'
        },
        team: {
          id: 5,
          name: 'FC Bayern Munich',
          shortName: 'Bayern',
          tla: 'FCB',
          crest: 'https://crests.football-data.org/5.png',
          address: 'Allianz Arena, Munich',
          website: 'https://www.fcbayern.com',
          founded: 1900,
          clubColors: 'Red / White',
          venue: 'Allianz Arena'
        },
        goals: 14,
        assists: 5,
        penalties: 3
      }
    ];
  }

  async fetchData(endpoint: string): Promise<any> {
    // If no API key is provided, return null immediately to use fallback data
    if (!API_KEY) {
      console.log('No API key provided, using fallback data');
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('API request failed, using fallback data:', error);
      return null;
    }
  }

  // Get live and recent matches
  async getLiveMatches(): Promise<Match[]> {
    try {
      const data = await this.fetchData('/matches?status=LIVE,FINISHED,SCHEDULED&limit=20');
      return data?.matches || this.getFallbackMatches();
    } catch (error) {
      console.error('Error fetching live matches:', error);
      return this.getFallbackMatches();
    }
  }

  // Get matches for a specific competition
  async getMatchesByCompetition(competitionId: number): Promise<Match[]> {
    try {
      const data = await this.fetchData(`/competitions/${competitionId}/matches?status=LIVE,FINISHED,SCHEDULED&limit=20`);
      return data?.matches || this.getFallbackMatches();
    } catch (error) {
      console.error('Error fetching competition matches:', error);
      return this.getFallbackMatches();
    }
  }

  // Get league standings/leaderboard
  async getStandings(competitionId: number = 2021): Promise<Standing[]> {
    try {
      const data = await this.fetchData(`/competitions/${competitionId}/standings`);
      return data?.standings?.[0]?.table || this.getFallbackStandings();
    } catch (error) {
      console.error('Error fetching standings:', error);
      return this.getFallbackStandings();
    }
  }

  // Get top scorers leaderboard
  async getTopScorers(competitionId: number = 2021): Promise<Scorer[]> {
    try {
      const data = await this.fetchData(`/competitions/${competitionId}/scorers?limit=20`);
      return data?.scorers || this.getFallbackScorers();
    } catch (error) {
      console.error('Error fetching top scorers:', error);
      return this.getFallbackScorers();
    }
  }

  // Get available competitions
  async getCompetitions(): Promise<Competition[]> {
    try {
      const data = await this.fetchData('/competitions');
      return data?.competitions || [
        {
          id: 2021,
          name: 'Premier League',
          code: 'PL',
          emblem: 'https://crests.football-data.org/PL.png',
          area: { name: 'England', code: 'ENG' },
          currentSeason: {
            id: 1564,
            startDate: '2024-08-17',
            endDate: '2025-05-25',
            currentMatchday: 15
          }
        },
        {
          id: 2014,
          name: 'La Liga',
          code: 'PD',
          emblem: 'https://crests.football-data.org/PD.png',
          area: { name: 'Spain', code: 'ESP' },
          currentSeason: {
            id: 1565,
            startDate: '2024-08-17',
            endDate: '2025-05-25',
            currentMatchday: 15
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching competitions:', error);
      return [];
    }
  }

  // Get team information
  async getTeam(teamId: number): Promise<Team | null> {
    try {
      const data = await this.fetchData(`/teams/${teamId}`);
      return data || null;
    } catch (error) {
      console.error('Error fetching team:', error);
      return null;
    }
  }

  // Get match details
  async getMatch(matchId: number): Promise<Match | null> {
    try {
      const data = await this.fetchData(`/matches/${matchId}`);
      return data || null;
    } catch (error) {
      console.error('Error fetching match:', error);
      return null;
    }
  }

  // Get matches for today
  async getTodayMatches(): Promise<Match[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await this.fetchData(`/matches?dateFrom=${today}&dateTo=${today}`);
      return data?.matches || this.getFallbackMatches();
    } catch (error) {
      console.error('Error fetching today matches:', error);
      return this.getFallbackMatches();
    }
  }

  // Format match time for display
  formatMatchTime(match: Match): string {
    const matchDate = new Date(match.utcDate);
    const now = new Date();
    
    if (match.status === 'LIVE' || match.status === 'IN_PLAY') {
      return 'LIVE';
    } else if (match.status === 'FINISHED') {
      return 'FT';
    } else if (match.status === 'SCHEDULED') {
      return matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return match.status;
    }
  }

  // Get match status color
  getMatchStatusColor(status: string): string {
    switch (status) {
      case 'LIVE':
      case 'IN_PLAY':
        return '#EF4444'; // Red
      case 'FINISHED':
        return '#10B981'; // Green
      case 'SCHEDULED':
        return '#F59E0B'; // Yellow
      default:
        return '#6B7280'; // Gray
    }
  }
}

// Export singleton instance
export const sportsApi = new SportsApiService();

// Export individual functions for easier use
export const {
  getLiveMatches,
  getMatchesByCompetition,
  getStandings,
  getTopScorers,
  getCompetitions,
  getTeam,
  getMatch,
  getTodayMatches,
  formatMatchTime,
  getMatchStatusColor,
} = sportsApi; 