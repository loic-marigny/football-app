import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../../hooks/useColorScheme';

const { width } = Dimensions.get('window');

// Define colors that work with both light and dark modes
const getColors = (isDark: boolean) => ({
  background: isDark ? '#000000' : '#FFFFFF',
  surface: isDark ? '#1C1C1E' : '#F2F2F7',
  primary: '#1DA1F2', // Twitter blue
  secondary: isDark ? '#0A84FF' : '#5856D6',
  text: isDark ? '#FFFFFF' : '#000000',
  textSecondary: isDark ? '#8E8E93' : '#6D6D70',
  border: isDark ? '#38383A' : '#E1E8ED',
  tint: '#1DA1F2',
  success: '#17BF63',
  warning: '#FFAD1F',
  error: '#F7931E',
  card: isDark ? '#1C1C1E' : '#FFFFFF',
  accent: '#794BC4',
  searchBackground: isDark ? '#2F3336' : '#F7F9FA',
  trending: '#1DA1F2',
  gradient1: isDark ? '#1DA1F2' : '#1DA1F2',
});

interface TrendingTopic {
  id: string;
  category: string;
  title: string;
  tweets: number;
  trend: 'up' | 'down' | 'stable';
  isPromoted?: boolean;
}

interface HashtagTrend {
  id: string;
  hashtag: string;
  tweets: number;
  category: string;
}

interface WhoToFollow {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  bio: string;
  followers: number;
  isFollowing: boolean;
}

interface TrendingEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  engagement: number;
}

const ExplorePage: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'sports' | 'news' | 'entertainment'>('trending');



  const trendingTopics = useMemo(() => [
    {
      id: '1',
      category: 'Football',
      title: 'Champions League',
      tweets: 127000,
      trend: 'up' as const,
    },
    {
      id: '2',
      category: 'Trending in Sports',
      title: 'Messi vs Ronaldo',
      tweets: 89000,
      trend: 'up' as const,
    },
    {
      id: '3',
      category: 'Premier League',
      title: 'Manchester United',
      tweets: 65000,
      trend: 'stable' as const,
    },
    {
      id: '4',
      category: 'Transfer News',
      title: 'Mbappé to Real Madrid',
      tweets: 156000,
      trend: 'up' as const,
      isPromoted: true,
    },
    {
      id: '5',
      category: 'La Liga',
      title: 'El Clasico',
      tweets: 234000,
      trend: 'up' as const,
    },
  ] as TrendingTopic[], []);

  const hashtagTrends = useMemo(() => [
    { id: '1', hashtag: '#ChampionsLeague', tweets: 45000, category: 'Sports' },
    { id: '2', hashtag: '#PremierLeague', tweets: 32000, category: 'Football' },
    { id: '3', hashtag: '#TransferNews', tweets: 28000, category: 'Football' },
    { id: '4', hashtag: '#WorldCup2024', tweets: 67000, category: 'Sports' },
    { id: '5', hashtag: '#FootballAnalysis', tweets: 19000, category: 'Sports' },
  ] as HashtagTrend[], []);

  const whoToFollow = useMemo(() => [
    {
      id: '1',
      name: 'ESPN FC',
      username: '@ESPNFC',
      avatar: 'https://via.placeholder.com/40',
      verified: true,
      bio: 'The home of football on ESPN',
      followers: 15600000,
      isFollowing: false,
    },
    {
      id: '2',
      name: 'Fabrizio Romano',
      username: '@FabrizioRomano',
      avatar: 'https://via.placeholder.com/40',
      verified: true,
      bio: 'Football transfers expert',
      followers: 8900000,
      isFollowing: false,
    },
    {
      id: '3',
      name: 'Sky Sports Football',
      username: '@SkySportsNews',
      avatar: 'https://via.placeholder.com/40',
      verified: true,
      bio: 'Breaking football news and analysis',
      followers: 12300000,
      isFollowing: true,
    },
  ] as WhoToFollow[], []);

  const trendingEvents = useMemo(() => [
    {
      id: '1',
      title: 'Champions League Final',
      description: 'Real Madrid vs Manchester City - Live coverage',
      image: 'https://via.placeholder.com/100x100',
      time: 'Live',
      engagement: 89000,
    },
    {
      id: '2',
      title: 'Transfer Window Update',
      description: 'Latest signings and rumors from top European clubs',
      image: 'https://via.placeholder.com/100x100',
      time: '2h',
      engagement: 45000,
    },
    {
      id: '3',
      title: 'Premier League Highlights',
      description: 'Best goals and moments from this weekend',
      image: 'https://via.placeholder.com/100x100',
      time: '4h',
      engagement: 67000,
    },
  ] as TrendingEvent[], []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Refresh data here
    } finally {
      setRefreshing(false);
    }
  }, []);

  const formatNumber = useCallback((num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }, []);

  const handleFollow = useCallback((userId: string) => {
    // Handle follow/unfollow logic
    console.log('Follow/unfollow user:', userId);
  }, []);

  const renderSearchBar = useCallback(() => (
    <View style={[styles.searchContainer, { backgroundColor: colors.searchBackground }]}>
      <Ionicons name="search" size={20} color={colors.textSecondary} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }]}
        placeholder="Search Twitter"
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  ), [searchQuery, colors]);

  const renderTabButton = useCallback((tab: string, label: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && [styles.activeTabButton, { borderBottomColor: colors.primary }]
      ]}
      onPress={() => setActiveTab(tab as any)}
    >
      <Text style={[
        styles.tabText,
        { color: activeTab === tab ? colors.primary : colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  ), [activeTab, colors]);

  const renderTrendingTopic = useCallback(({ item }: { item: TrendingTopic }) => (
    <TouchableOpacity style={[styles.trendingItem, { backgroundColor: colors.card }]}>
      <View style={styles.trendingHeader}>
        <View style={styles.trendingInfo}>
          <Text style={[styles.trendingCategory, { color: colors.textSecondary }]}>
            {item.category}
          </Text>
          {item.isPromoted && (
            <View style={[styles.promotedBadge, { backgroundColor: colors.warning + '20' }]}>
              <Text style={[styles.promotedText, { color: colors.warning }]}>Promoted</Text>
            </View>
          )}
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.trendingTitle, { color: colors.text }]}>{item.title}</Text>
      
      <View style={styles.trendingStats}>
        <Text style={[styles.trendingCount, { color: colors.textSecondary }]}>
          {formatNumber(item.tweets)} Tweets
        </Text>
        <Ionicons
          name={item.trend === 'up' ? 'trending-up' : item.trend === 'down' ? 'trending-down' : 'remove'}
          size={16}
          color={item.trend === 'up' ? colors.success : item.trend === 'down' ? colors.error : colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  ), [colors, formatNumber]);

  const renderHashtagTrend = useCallback(({ item }: { item: HashtagTrend }) => (
    <TouchableOpacity style={[styles.hashtagItem, { backgroundColor: colors.card }]}>
      <View style={styles.hashtagContent}>
        <Text style={[styles.hashtagText, { color: colors.primary }]}>{item.hashtag}</Text>
        <Text style={[styles.hashtagCategory, { color: colors.textSecondary }]}>
          Trending in {item.category}
        </Text>
        <Text style={[styles.hashtagCount, { color: colors.textSecondary }]}>
          {formatNumber(item.tweets)} Tweets
        </Text>
      </View>
    </TouchableOpacity>
  ), [colors, formatNumber]);

  const renderWhoToFollow = useCallback(({ item }: { item: WhoToFollow }) => (
    <View style={[styles.followItem, { backgroundColor: colors.card }]}>
      <View style={styles.followContent}>
        <Image source={{ uri: item.avatar }} style={styles.followAvatar} />
        <View style={styles.followInfo}>
          <View style={styles.followNameContainer}>
            <Text style={[styles.followName, { color: colors.text }]}>{item.name}</Text>
            {item.verified && (
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            )}
          </View>
          <Text style={[styles.followUsername, { color: colors.textSecondary }]}>
            {item.username}
          </Text>
          <Text style={[styles.followBio, { color: colors.text }]} numberOfLines={2}>
            {item.bio}
          </Text>
          <Text style={[styles.followFollowers, { color: colors.textSecondary }]}>
            {formatNumber(item.followers)} followers
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          { 
            backgroundColor: item.isFollowing ? 'transparent' : colors.text,
            borderColor: item.isFollowing ? colors.border : colors.text,
          }
        ]}
        onPress={() => handleFollow(item.id)}
      >
        <Text style={[
          styles.followButtonText,
          { color: item.isFollowing ? colors.text : colors.background }
        ]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  ), [colors, formatNumber, handleFollow]);

  const renderTrendingEvent = useCallback(({ item }: { item: TrendingEvent }) => (
    <TouchableOpacity style={[styles.eventItem, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.eventDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.eventStats}>
          <Text style={[styles.eventTime, { color: colors.textSecondary }]}>{item.time}</Text>
          <View style={styles.eventEngagement}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.eventEngagementText, { color: colors.textSecondary }]}>
              {formatNumber(item.engagement)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [colors, formatNumber]);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'trending':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Trending Topics */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending for you</Text>
              <FlatList
                data={trendingTopics}
                renderItem={renderTrendingTopic}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
              />
            </View>

            {/* Hashtag Trends */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Hashtag Trends</Text>
              <FlatList
                data={hashtagTrends}
                renderItem={renderHashtagTrend}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
              />
            </View>

            {/* Who to Follow */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Who to follow</Text>
              <FlatList
                data={whoToFollow}
                renderItem={renderWhoToFollow}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
              />
            </View>

            {/* Trending Events */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>What's happening</Text>
              <FlatList
                data={trendingEvents}
                renderItem={renderTrendingEvent}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
              />
            </View>
          </ScrollView>
        );
      case 'sports':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Sports Trending</Text>
              <FlatList
                data={trendingTopics.filter(topic => topic.category.toLowerCase().includes('sport') || topic.category.toLowerCase().includes('football'))}
                renderItem={renderTrendingTopic}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
              />
            </View>
          </ScrollView>
        );
      case 'news':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>News</Text>
              <FlatList
                data={trendingEvents}
                renderItem={renderTrendingEvent}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
              />
            </View>
          </ScrollView>
        );
      case 'entertainment':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Entertainment</Text>
              <FlatList
                data={trendingTopics.slice(0, 3)}
                renderItem={renderTrendingTopic}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
              />
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  }, [activeTab, colors, trendingTopics, hashtagTrends, whoToFollow, trendingEvents, renderTrendingTopic, renderHashtagTrend, renderWhoToFollow, renderTrendingEvent]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
      </LinearGradient>

      {/* Search Bar */}
      <View style={[styles.searchSection, { backgroundColor: colors.card }]}>
        {renderSearchBar()}
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsList}>
            {renderTabButton('trending', 'Trending')}
            {renderTabButton('sports', 'Sports')}
            {renderTabButton('news', 'News')}
            {renderTabButton('entertainment', 'Entertainment')}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabsContainer: {
    borderBottomWidth: 1,
  },
  tabsList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  trendingItem: {
    padding: 16,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  trendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendingCategory: {
    fontSize: 13,
    fontWeight: '400',
  },
  promotedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promotedText: {
    fontSize: 11,
    fontWeight: '600',
  },
  trendingTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trendingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendingCount: {
    fontSize: 13,
    fontWeight: '400',
  },
  hashtagItem: {
    padding: 16,
  },
  hashtagContent: {
    gap: 2,
  },
  hashtagText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  hashtagCategory: {
    fontSize: 13,
    fontWeight: '400',
  },
  hashtagCount: {
    fontSize: 13,
    fontWeight: '400',
  },
  followItem: {
    padding: 16,
  },
  followContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  followAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  followInfo: {
    flex: 1,
  },
  followNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  followName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  followUsername: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 4,
  },
  followBio: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  followFollowers: {
    fontSize: 13,
    fontWeight: '400',
  },
  followButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  eventImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  eventStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventTime: {
    fontSize: 13,
    fontWeight: '400',
  },
  eventEngagement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventEngagementText: {
    fontSize: 13,
    fontWeight: '400',
  },
});

export default ExplorePage;
