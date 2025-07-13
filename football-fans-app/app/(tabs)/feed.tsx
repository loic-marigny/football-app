import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
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
import { Match, sportsApi } from '../lib/sportsApi';

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

interface TeamResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeLogo: string;
  awayLogo: string;
  status: 'finished' | 'live';
  time: string;
  competition: string;
}

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  chzEarned?: number;
  category: 'general' | 'match' | 'transfer' | 'viral';
}

const FeedPage: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'trending'>('all');
  const [loading, setLoading] = useState(true);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);



  // Load real match results
  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const matches = await sportsApi.getLiveMatches();
      // Filter to get recent finished matches and live matches
      const relevantMatches = matches.filter(match => 
        match.status === 'FINISHED' || match.status === 'LIVE' || match.status === 'IN_PLAY'
      );
      setRecentMatches(relevantMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const posts = useMemo(() => [
    {
      id: '1',
      user: {
        name: 'John Smith',
        avatar: 'https://via.placeholder.com/40',
        verified: true,
      },
      content: 'What a performance from Bruno! That assist was pure magic ⚽️🔥',
      timestamp: '2h',
      likes: 245,
      comments: 32,
      shares: 18,
      chzEarned: 15,
      category: 'match' as const,
    },
    {
      id: '2',
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://via.placeholder.com/40',
        verified: false,
      },
      content: 'Transfer window predictions: Where do you think Mbappé will end up next season? 🤔 My bet is on Real Madrid! 👑',
      timestamp: '4h',
      likes: 189,
      comments: 67,
      shares: 23,
      chzEarned: 8,
      category: 'transfer' as const,
    },
    {
      id: '3',
      user: {
        name: 'Mike Chen',
        avatar: 'https://via.placeholder.com/40',
        verified: true,
      },
      content: 'Just watched the highlights from last night\'s Champions League match. Absolutely incredible! The level of football is getting better every year 🏆',
      timestamp: '6h',
      likes: 456,
      comments: 89,
      shares: 34,
      chzEarned: 25,
      category: 'viral' as const,
    },
    {
      id: '4',
      user: {
        name: 'Emma Wilson',
        avatar: 'https://via.placeholder.com/40',
        verified: false,
      },
      content: 'Prediction for tomorrow\'s match: City 2-1 Liverpool. What do you think? 🔮',
      timestamp: '8h',
      likes: 123,
      comments: 45,
      shares: 12,
      category: 'general' as const,
    },
    {
      id: '5',
      user: {
        name: 'Alex Rodriguez',
        avatar: 'https://via.placeholder.com/40',
        verified: true,
      },
      content: 'The atmosphere at the stadium today was electric! Nothing beats watching football live ⚡️🏟️',
      timestamp: '12h',
      likes: 334,
      comments: 56,
      shares: 28,
      chzEarned: 18,
      category: 'match' as const,
    },
  ] as Post[], []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  }, [loadMatches]);

  const renderFilterButton = useCallback((filter: 'all' | 'following' | 'trending', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && [styles.activeFilterButton, { backgroundColor: colors.primary }]
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text style={[
        styles.filterText,
        { color: activeFilter === filter ? 'white' : colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  ), [activeFilter, colors]);

  const renderMatchResult = useCallback((match: Match) => (
    <View key={match.id} style={[styles.resultCard, { backgroundColor: colors.surface }]}>
      <LinearGradient
        colors={[colors.primary + '10', colors.gradient1 + '10']}
        style={styles.resultGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.resultHeader}>
        <View style={styles.teamInfo}>
          <View style={styles.teamLogoContainer}>
            <Image source={{ uri: match.homeTeam.crest }} style={styles.teamLogo} />
          </View>
          <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
            {match.homeTeam.shortName}
          </Text>
        </View>
        
        <View style={styles.scoreSection}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: sportsApi.getMatchStatusColor(match.status) }
          ]}>
            <Text style={styles.statusText}>
              {sportsApi.formatMatchTime(match)}
            </Text>
          </View>
          {match.score.fullTime.home !== null ? (
            <Text style={[styles.score, { color: colors.text }]}>
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </Text>
          ) : (
            <Text style={[styles.liveTime, { color: colors.error }]}>
              LIVE
            </Text>
          )}
        </View>
        
        <View style={styles.teamInfo}>
          <View style={styles.teamLogoContainer}>
            <Image source={{ uri: match.awayTeam.crest }} style={styles.teamLogo} />
          </View>
          <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
            {match.awayTeam.shortName}
          </Text>
        </View>
      </View>
      
      <View style={styles.matchDetails}>
        <Text style={[styles.competitionText, { color: colors.textSecondary }]}>
          {match.competition.name}
        </Text>
        <Text style={[styles.matchTime, { color: colors.textSecondary }]}>
          {new Date(match.utcDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  ), [colors]);

  const renderPost = useCallback(({ item }: { item: Post }) => (
    <View style={[styles.postCard, { backgroundColor: colors.card }]}>
      {/* User Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
          <View style={styles.userDetails}>
            <View style={styles.userNameContainer}>
              <Text style={[styles.userName, { color: colors.text }]}>{item.user.name}</Text>
              {item.user.verified && (
                <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
              )}
            </View>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {item.timestamp}
            </Text>
          </View>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
          <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
            {getCategoryLabel(item.category)}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={[styles.postContent, { color: colors.text }]}>
        {item.content}
      </Text>

      {/* CHZ Earnings */}
      {item.chzEarned && (
        <LinearGradient
          colors={[colors.chz + '20', colors.gradient2 + '20']}
          style={styles.chzEarnings}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.chzIcon}>
            <Ionicons name="diamond" size={16} color={colors.chz} />
          </View>
          <Text style={[styles.chzText, { color: colors.chz }]}>
            +{item.chzEarned} CHZ earned from viral engagement 🚀
          </Text>
        </LinearGradient>
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <LinearGradient
            colors={[colors.error + '20', colors.error + '10']}
            style={styles.actionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="heart" size={18} color={colors.error} />
          </LinearGradient>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <LinearGradient
            colors={[colors.accent + '20', colors.accent + '10']}
            style={styles.actionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="chatbubble" size={18} color={colors.accent} />
          </LinearGradient>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {item.comments}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <LinearGradient
            colors={[colors.secondary + '20', colors.secondary + '10']}
            style={styles.actionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="share" size={18} color={colors.secondary} />
          </LinearGradient>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {item.shares}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [colors]);

  const getCategoryColor = (category: Post['category']) => {
    const colors = getColors(isDark);
    switch (category) {
      case 'match': return colors.success;
      case 'transfer': return colors.warning;
      case 'viral': return colors.error;
      default: return colors.primary;
    }
  };

  const getCategoryLabel = (category: Post['category']) => {
    switch (category) {
      case 'match': return '⚽ Match';
      case 'transfer': return '🔄 Transfer';
      case 'viral': return '🔥 Viral';
      default: return '💬 General';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View>
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
                  <Ionicons name="notifications" size={24} color="white" />
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                  <View style={styles.profileContainer}>
                    <Image 
                      source={{ uri: 'https://via.placeholder.com/32' }} 
                      style={styles.profilePic} 
                    />
                    <View style={styles.onlineIndicator} />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Match Results Section */}
            <View style={styles.resultsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🏆 Recent Results
              </Text>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    Loading matches...
                  </Text>
                </View>
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.resultsList}
                >
                  {recentMatches.length > 0 ? (
                    recentMatches.map(renderMatchResult)
                  ) : (
                    <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
                      No recent matches available
                    </Text>
                  )}
                </ScrollView>
              )}
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              {renderFilterButton('all', 'All')}
              {renderFilterButton('following', 'Following')}
              {renderFilterButton('trending', 'Trending 🔥')}
            </View>

            {/* Posts Feed */}
            <View style={styles.postsContainer}>
              <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        )}
        keyExtractor={() => 'feed-content'}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Post Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => console.log('Add new post')}
      >
        <LinearGradient
          colors={[colors.primary, colors.gradient1]}
          style={styles.floatingButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  profileButton: {
    padding: 2,
  },
  profileContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  resultsSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  resultsList: {
    paddingHorizontal: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 16,
    marginRight: 16,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  resultGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamInfo: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogoContainer: {
    padding: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
    marginBottom: 8,
  },
  teamLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  liveTime: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  matchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  competitionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  matchTime: {
    fontSize: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFilterButton: {
    // backgroundColor will be set dynamically
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  postCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  chzEarnings: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  chzIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chzText: {
    fontSize: 14,
    fontWeight: '600',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionGradient: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FeedPage; 