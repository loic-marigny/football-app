import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Competition, Match, Scorer, sportsApi, Standing } from '../lib/sportsApi';

const { width } = Dimensions.get('window');

const getColors = (isDark: boolean) => ({
  background: isDark ? '#000000' : '#FFFFFF',
  surface: isDark ? '#1C1C1E' : '#F8F9FA',
  primary: '#FF6B35',
  secondary: '#4ECDC4',
  accent: '#45B7D1',
  text: isDark ? '#FFFFFF' : '#1A1A1A',
  textSecondary: isDark ? '#8E8E93' : '#6B7280',
  border: isDark ? '#38383A' : '#E5E7EB',
  card: isDark ? '#1C1C1E' : '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  chz: '#FF6B35',
  gradient1: isDark ? '#FF6B35' : '#FF8A65',
  gradient2: isDark ? '#FF8A65' : '#FFB74D',
});

interface Prediction {
  id: string;
  match: string;
  prediction: string;
  confidence: number;
  odds: string;
  status: 'pending' | 'won' | 'lost';
}

interface TrendingTopic {
  id: string;
  title: string;
  posts: number;
  trend: 'up' | 'down' | 'stable';
  trending: boolean;
}

interface PopularLeague {
  id: string;
  name: string;
  logo: string;
  country: string;
  followers: number;
  trending: boolean;
}

interface PopularTeam {
  id: string;
  name: string;
  logo: string;
  league: string;
  followers: number;
  trending: boolean;
}

const DiscoverPage: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matches' | 'standings' | 'scorers' | 'trending'>('matches');
  const [loading, setLoading] = useState(true);
  
  // Real data from API
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [topScorers, setTopScorers] = useState<Scorer[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<number>(2021); // Premier League

  // Mock user stats - removed followers
  const userStats = useMemo(() => ({
    points: 15420,
    accuracy: 78,
    predictions: 156,
  }), []);

  // Mock predictions data
  const myPredictions = useMemo(() => [
    {
      id: '1',
      match: 'Man City vs Tottenham',
      prediction: 'Man City Win',
      confidence: 85,
      odds: '1.75',
      status: 'pending' as const,
    },
    {
      id: '2',
      match: 'Bayern vs Dortmund',
      prediction: 'Over 2.5 Goals',
      confidence: 72,
      odds: '1.90',
      status: 'won' as const,
    },
    {
      id: '3',
      match: 'PSG vs Marseille',
      prediction: 'PSG Win',
      confidence: 90,
      odds: '1.45',
      status: 'lost' as const,
    },
  ] as Prediction[], []);

  const trendingTopics = useMemo(() => [
    {
      id: '1',
      title: '#ChampionsLeague',
      posts: 45200,
      trend: 'up' as const,
      trending: true,
    },
    {
      id: '2',
      title: '#PremierLeague',
      posts: 38900,
      trend: 'up' as const,
      trending: true,
    },
    {
      id: '3',
      title: '#WorldCup2026',
      posts: 23400,
      trend: 'stable' as const,
      trending: false,
    },
  ] as TrendingTopic[], []);

  const popularLeagues = useMemo(() => [
    {
      id: '1',
      name: 'Premier League',
      logo: 'https://crests.football-data.org/PL.png',
      country: 'England',
      followers: 125000000,
      trending: true,
    },
    {
      id: '2',
      name: 'La Liga',
      logo: 'https://crests.football-data.org/PD.png',
      country: 'Spain',
      followers: 89000000,
      trending: false,
    },
    {
      id: '3',
      name: 'Serie A',
      logo: 'https://crests.football-data.org/SA.png',
      country: 'Italy',
      followers: 67000000,
      trending: true,
    },
  ] as PopularLeague[], []);

  const popularTeams = useMemo(() => [
    {
      id: '1',
      name: 'Manchester City',
      logo: 'https://crests.football-data.org/65.png',
      league: 'Premier League',
      followers: 45000000,
      trending: true,
    },
    {
      id: '2',
      name: 'Real Madrid',
      logo: 'https://crests.football-data.org/86.png',
      league: 'La Liga',
      followers: 89000000,
      trending: false,
    },
    {
      id: '3',
      name: 'Barcelona',
      logo: 'https://crests.football-data.org/81.png',
      league: 'La Liga',
      followers: 87000000,
      trending: true,
    },
  ] as PopularTeam[], []);

  // Load real data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load competitions first
      const competitionsData = await sportsApi.getCompetitions();
      setCompetitions(competitionsData);
      
      // Load matches, standings, and scorers for selected competition
      const [matchesData, standingsData, scorersData] = await Promise.all([
        sportsApi.getLiveMatches(),
        sportsApi.getStandings(selectedCompetition),
        sportsApi.getTopScorers(selectedCompetition),
      ]);
      
      setLiveMatches(matchesData);
      setStandings(standingsData);
      setTopScorers(scorersData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load sports data. Using offline data.');
    } finally {
      setLoading(false);
    }
  }, [selectedCompetition]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const renderUserStats = useCallback(() => (
    <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.statItem}>
        <Ionicons name="trophy" size={24} color={colors.warning} />
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {userStats.points.toLocaleString()}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {userStats.accuracy}%
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="analytics" size={24} color={colors.primary} />
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {userStats.predictions}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Predictions</Text>
      </View>
    </View>
  ), [userStats, colors]);

  const renderTabButton = useCallback((tab: string, label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && [styles.activeTabButton, { backgroundColor: colors.primary }]
      ]}
      onPress={() => setActiveTab(tab as any)}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={activeTab === tab ? 'white' : colors.textSecondary}
      />
      <Text style={[
        styles.tabText,
        { color: activeTab === tab ? 'white' : colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  ), [activeTab, colors]);

  const renderMatch = useCallback((match: Match) => (
    <View key={match.id} style={[styles.matchCard, { backgroundColor: colors.surface }]}>
      <View style={styles.matchHeader}>
        <Text style={[styles.competitionText, { color: colors.textSecondary }]}>
          {match.competition.name}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: sportsApi.getMatchStatusColor(match.status) }
        ]}>
          <Text style={styles.statusText}>
            {sportsApi.formatMatchTime(match)}
          </Text>
        </View>
      </View>
      <View style={styles.matchContent}>
        <View style={styles.teamContainer}>
          <Image source={{ uri: match.homeTeam.crest }} style={styles.teamLogo} />
          <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={2}>
            {match.homeTeam.shortName}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          {match.score.fullTime.home !== null ? (
            <Text style={[styles.score, { color: colors.text }]}>
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </Text>
          ) : (
            <Text style={[styles.time, { color: colors.textSecondary }]}>
              {new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>
        <View style={styles.teamContainer}>
          <Image source={{ uri: match.awayTeam.crest }} style={styles.teamLogo} />
          <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={2}>
            {match.awayTeam.shortName}
          </Text>
        </View>
      </View>
    </View>
  ), [colors]);

  const renderStanding = useCallback((standing: Standing, index: number) => (
    <View key={standing.team.id} style={[styles.standingRow, { backgroundColor: colors.surface }]}>
      <View style={styles.positionContainer}>
        <Text style={[styles.position, { color: colors.text }]}>{standing.position}</Text>
        {index < 4 && (
          <View style={[styles.positionIndicator, { backgroundColor: colors.success }]} />
        )}
        {index >= standings.length - 3 && (
          <View style={[styles.positionIndicator, { backgroundColor: colors.error }]} />
        )}
      </View>
      <Image source={{ uri: standing.team.crest }} style={styles.teamLogoSmall} />
      <Text style={[styles.teamNameStanding, { color: colors.text }]} numberOfLines={1}>
        {standing.team.shortName}
      </Text>
      <View style={styles.standingStats}>
        <Text style={[styles.standingStat, { color: colors.text }]}>{standing.playedGames}</Text>
        <Text style={[styles.standingStat, { color: colors.text }]}>{standing.won}</Text>
        <Text style={[styles.standingStat, { color: colors.text }]}>{standing.draw}</Text>
        <Text style={[styles.standingStat, { color: colors.text }]}>{standing.lost}</Text>
        <Text style={[styles.standingStat, { color: colors.text, fontWeight: 'bold' }]}>
          {standing.points}
        </Text>
      </View>
    </View>
  ), [colors, standings.length]);

  const renderScorer = useCallback((scorer: Scorer, index: number) => (
    <View key={scorer.player.id} style={[styles.scorerRow, { backgroundColor: colors.surface }]}>
      <View style={styles.scorerRank}>
        <Text style={[styles.rankNumber, { color: colors.text }]}>{index + 1}</Text>
        {index < 3 && (
          <Ionicons 
            name="trophy" 
            size={16} 
            color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} 
          />
        )}
      </View>
      <Image source={{ uri: scorer.team.crest }} style={styles.teamLogoSmall} />
      <View style={styles.scorerInfo}>
        <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
          {scorer.player.name}
        </Text>
        <Text style={[styles.teamNameSmall, { color: colors.textSecondary }]}>
          {scorer.team.shortName}
        </Text>
      </View>
      <View style={styles.scorerStats}>
        <View style={styles.scorerStatItem}>
          <Text style={[styles.scorerStatNumber, { color: colors.text }]}>{scorer.goals}</Text>
          <Text style={[styles.scorerStatLabel, { color: colors.textSecondary }]}>Goals</Text>
        </View>
        <View style={styles.scorerStatItem}>
          <Text style={[styles.scorerStatNumber, { color: colors.text }]}>{scorer.assists}</Text>
          <Text style={[styles.scorerStatLabel, { color: colors.textSecondary }]}>Assists</Text>
        </View>
      </View>
    </View>
  ), [colors]);

  const renderPrediction = useCallback((prediction: Prediction) => (
    <View key={prediction.id} style={[styles.predictionCard, { backgroundColor: colors.surface }]}>
      <View style={styles.predictionHeader}>
        <Text style={[styles.matchText, { color: colors.text }]}>{prediction.match}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: prediction.status === 'won' ? colors.success : prediction.status === 'lost' ? colors.error : colors.warning }
        ]}>
          <Text style={styles.statusText}>
            {prediction.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={[styles.predictionText, { color: colors.textSecondary }]}>
        {prediction.prediction}
      </Text>
      <View style={styles.predictionFooter}>
        <Text style={[styles.confidenceText, { color: colors.primary }]}>
          Confidence: {prediction.confidence}%
        </Text>
        <Text style={[styles.oddsText, { color: colors.textSecondary }]}>
          Odds: {prediction.odds}
        </Text>
      </View>
    </View>
  ), [colors]);

  const renderTabContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'matches':
        return (
          <View style={styles.tabContentContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Live & Recent Matches</Text>
            {liveMatches.length > 0 ? (
              liveMatches.map(renderMatch)
            ) : (
              <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
                No matches available
              </Text>
            )}
          </View>
        );
      case 'standings':
        return (
          <View style={styles.tabContentContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>League Table</Text>
            <View style={[styles.standingHeader, { backgroundColor: colors.card }]}>
              <Text style={[styles.standingHeaderText, { color: colors.textSecondary }]}>Pos</Text>
              <Text style={[styles.standingHeaderText, { color: colors.textSecondary }]}>Team</Text>
              <View style={styles.standingHeaderStats}>
                <Text style={[styles.standingHeaderStat, { color: colors.textSecondary }]}>P</Text>
                <Text style={[styles.standingHeaderStat, { color: colors.textSecondary }]}>W</Text>
                <Text style={[styles.standingHeaderStat, { color: colors.textSecondary }]}>D</Text>
                <Text style={[styles.standingHeaderStat, { color: colors.textSecondary }]}>L</Text>
                <Text style={[styles.standingHeaderStat, { color: colors.textSecondary }]}>Pts</Text>
              </View>
            </View>
            {standings.length > 0 ? (
              standings.map(renderStanding)
            ) : (
              <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
                No standings available
              </Text>
            )}
          </View>
        );
      case 'scorers':
        return (
          <View style={styles.tabContentContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Scorers</Text>
            {topScorers.length > 0 ? (
              topScorers.map(renderScorer)
            ) : (
              <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
                No scorers data available
              </Text>
            )}
          </View>
        );
      case 'trending':
        return (
          <View style={styles.tabContentContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Topics</Text>
            {trendingTopics.map((topic) => (
              <View key={topic.id} style={[styles.trendingCard, { backgroundColor: colors.surface }]}>
                <View style={styles.trendingContent}>
                  <Text style={[styles.trendingTitle, { color: colors.text }]}>{topic.title}</Text>
                  <Text style={[styles.trendingPosts, { color: colors.textSecondary }]}>
                    {topic.posts.toLocaleString()} posts
                  </Text>
                </View>
                <Ionicons
                  name={topic.trend === 'up' ? 'trending-up' : topic.trend === 'down' ? 'trending-down' : 'remove'}
                  size={20}
                  color={topic.trend === 'up' ? colors.success : topic.trend === 'down' ? colors.error : colors.textSecondary}
                />
              </View>
            ))}
            
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Popular Leagues</Text>
            {popularLeagues.map((league) => (
              <View key={league.id} style={[styles.leagueCard, { backgroundColor: colors.surface }]}>
                <Image source={{ uri: league.logo }} style={styles.leagueLogo} />
                <View style={styles.leagueContent}>
                  <View style={styles.leagueNameContainer}>
                    <Text style={[styles.leagueNameText, { color: colors.text }]}>{league.name}</Text>
                    {league.trending && (
                      <View style={[styles.trendingBadge, { backgroundColor: colors.error + '20' }]}>
                        <Text style={[styles.trendingBadgeText, { color: colors.error }]}>🔥 Trending</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.leagueCountry, { color: colors.textSecondary }]}>
                    {league.country} • {(league.followers / 1000000).toFixed(0)}M followers
                  </Text>
                </View>
                <TouchableOpacity style={[styles.followButton, { borderColor: colors.primary }]}>
                  <Text style={[styles.followText, { color: colors.primary }]}>Follow</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Popular Teams</Text>
            {popularTeams.map((team) => (
              <View key={team.id} style={[styles.teamCard, { backgroundColor: colors.surface }]}>
                <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                <View style={styles.teamContent}>
                  <View style={styles.teamNameContainer}>
                    <Text style={[styles.teamNameText, { color: colors.text }]}>{team.name}</Text>
                    {team.trending && (
                      <View style={[styles.trendingBadge, { backgroundColor: colors.error + '20' }]}>
                        <Text style={[styles.trendingBadgeText, { color: colors.error }]}>🔥 Trending</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.teamLeague, { color: colors.textSecondary }]}>
                    {team.league} • {(team.followers / 1000000).toFixed(0)}M followers
                  </Text>
                </View>
                <TouchableOpacity style={[styles.followButton, { borderColor: colors.primary }]}>
                  <Text style={[styles.followText, { color: colors.primary }]}>Follow</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  }, [activeTab, colors, loading, liveMatches, standings, topScorers, trendingTopics, popularLeagues, popularTeams, renderMatch, renderStanding, renderScorer, renderPrediction]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.gradient1]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity onPress={() => router.push('/feed')} activeOpacity={0.7}>
            <Image source={require('../../assets/images/fanzone-logo-orange.png')} style={{ width: 80, height: 80, alignSelf: 'center' }} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="search-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profilePicture}>
                <Ionicons name="person" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* User Stats */}
        {renderUserStats()}

        {/* Competition Selector */}
        <View style={styles.competitionSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {competitions.map((competition) => (
              <TouchableOpacity
                key={competition.id}
                style={[
                  styles.competitionButton,
                  { 
                    backgroundColor: selectedCompetition === competition.id ? colors.primary : colors.surface,
                    borderColor: colors.border
                  }
                ]}
                onPress={() => setSelectedCompetition(competition.id)}
              >
                <Image source={{ uri: competition.emblem }} style={styles.competitionLogo} />
                <Text style={[
                  styles.competitionName,
                  { color: selectedCompetition === competition.id ? 'white' : colors.text }
                ]}>
                  {competition.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {renderTabButton('matches', 'Matches', 'football-outline')}
          {renderTabButton('standings', 'Table', 'list-outline')}
          {renderTabButton('scorers', 'Scorers', 'trophy-outline')}
          {renderTabButton('trending', 'Trending', 'trending-up-outline')}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileButton: {
    padding: 2,
  },
  profilePicture: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  competitionSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  competitionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    gap: 8,
  },
  competitionLogo: {
    width: 20,
    height: 20,
  },
  competitionName: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    gap: 6,
  },
  activeTabButton: {
    // backgroundColor will be set dynamically
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  matchCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  competitionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  matchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    flex: 1,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
  },
  standingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  standingHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    width: 40,
  },
  standingHeaderStats: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  standingHeaderStat: {
    fontSize: 12,
    fontWeight: '600',
    width: 25,
    textAlign: 'center',
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  positionContainer: {
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  position: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
  },
  positionIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
    marginLeft: 4,
  },
  teamLogoSmall: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  teamNameStanding: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  standingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 125,
  },
  standingStat: {
    fontSize: 12,
    width: 25,
    textAlign: 'center',
  },
  scorerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  scorerRank: {
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  scorerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  teamNameSmall: {
    fontSize: 12,
    marginTop: 2,
  },
  scorerStats: {
    flexDirection: 'row',
    gap: 16,
  },
  scorerStatItem: {
    alignItems: 'center',
  },
  scorerStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scorerStatLabel: {
    fontSize: 10,
  },
  predictionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchText: {
    fontSize: 14,
    fontWeight: '600',
  },
  predictionText: {
    fontSize: 16,
    marginBottom: 12,
  },
  predictionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  oddsText: {
    fontSize: 12,
  },
  trendingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendingContent: {
    flex: 1,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trendingPosts: {
    fontSize: 12,
  },
  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leagueLogo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  leagueContent: {
    flex: 1,
  },
  leagueNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  leagueNameText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  leagueCountry: {
    fontSize: 12,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamContent: {
    flex: 1,
  },
  teamNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamNameText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  teamLeague: {
    fontSize: 12,
  },
  trendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  trendingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  followText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DiscoverPage;