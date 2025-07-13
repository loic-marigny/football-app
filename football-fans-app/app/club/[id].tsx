import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
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
  primary: '#007AFF',
  secondary: isDark ? '#0A84FF' : '#5856D6',
  text: isDark ? '#FFFFFF' : '#000000',
  textSecondary: isDark ? '#8E8E93' : '#6D6D70',
  border: isDark ? '#38383A' : '#C6C6C8',
  tint: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  card: isDark ? '#2C2C2E' : '#FFFFFF',
  accent: '#FF6B35',
  // Fan token colors
  tokenGold: '#FFD700',
  tokenSilver: '#C0C0C0',
  tokenBronze: '#CD7F32',
});

interface Club {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  fanTokenSymbol: string;
  fanTokenPrice: number;
  description: string;
  founded: number;
  stadium: string;
  followers: number;
  isFollowing: boolean;
  userTokens: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
  endsAt: string;
  totalVotes: number;
  requiredTokens: number;
  category: 'match' | 'transfer' | 'general' | 'tactics';
  isActive: boolean;
  userVoted: boolean;
  userVotedOption?: number;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface UserTokenBalance {
  symbol: string;
  balance: number;
  value: number;
}

const ClubPage: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'my-polls'>('trending');

  // Mock club data
  const clubData = useMemo(() => ({
    id: id || '1',
    name: 'Manchester United',
    logo: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/400x200',
    fanTokenSymbol: 'MUFC',
    fanTokenPrice: 3.45,
    description: 'Official Manchester United Fan Token community. Vote on club decisions and earn rewards.',
    founded: 1878,
    stadium: 'Old Trafford',
    followers: 75000000,
    isFollowing: false,
    userTokens: 250,
  } as Club), [id]);

  const userTokenBalance = useMemo(() => ({
    symbol: clubData.fanTokenSymbol,
    balance: clubData.userTokens,
    value: clubData.userTokens * clubData.fanTokenPrice,
  } as UserTokenBalance), [clubData]);

  const polls = useMemo(() => [
    {
      id: '1',
      question: 'Who should be the next captain of Manchester United?',
      options: [
        { id: '1', text: 'Bruno Fernandes', votes: 1250, percentage: 45 },
        { id: '2', text: 'Harry Maguire', votes: 680, percentage: 24 },
        { id: '3', text: 'Casemiro', votes: 520, percentage: 19 },
        { id: '4', text: 'Marcus Rashford', votes: 330, percentage: 12 },
      ],
      createdBy: {
        name: 'United Fan Club',
        username: '@unitedfc',
        avatar: 'https://via.placeholder.com/40',
        verified: true,
      },
      createdAt: '2024-01-15T10:00:00Z',
      endsAt: '2024-01-22T23:59:59Z',
      totalVotes: 2780,
      requiredTokens: 10,
      category: 'general' as const,
      isActive: true,
      userVoted: false,
    },
    {
      id: '2',
      question: 'Which formation should we use against Liverpool?',
      options: [
        { id: '1', text: '4-3-3', votes: 890, percentage: 52 },
        { id: '2', text: '3-5-2', votes: 450, percentage: 26 },
        { id: '3', text: '4-2-3-1', votes: 380, percentage: 22 },
      ],
      createdBy: {
        name: 'Tactical Analysis',
        username: '@tacticalmufc',
        avatar: 'https://via.placeholder.com/40',
        verified: false,
      },
      createdAt: '2024-01-14T15:30:00Z',
      endsAt: '2024-01-18T20:00:00Z',
      totalVotes: 1720,
      requiredTokens: 5,
      category: 'tactics' as const,
      isActive: true,
      userVoted: true,
      userVotedOption: 0,
    },
    {
      id: '3',
      question: 'Should we sign Kylian Mbappé in the summer?',
      options: [
        { id: '1', text: 'Yes, at any cost', votes: 2150, percentage: 65 },
        { id: '2', text: 'Yes, but only for reasonable price', votes: 890, percentage: 27 },
        { id: '3', text: 'No, focus on other positions', votes: 260, percentage: 8 },
      ],
      createdBy: {
        name: 'Transfer Insider',
        username: '@transfermufc',
        avatar: 'https://via.placeholder.com/40',
        verified: true,
      },
      createdAt: '2024-01-13T09:15:00Z',
      endsAt: '2024-01-20T18:00:00Z',
      totalVotes: 3300,
      requiredTokens: 15,
      category: 'transfer' as const,
      isActive: true,
      userVoted: false,
    },
  ] as Poll[], []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Refresh data here
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleFollow = useCallback(() => {
    Alert.alert(
      clubData.isFollowing ? 'Unfollow Club' : 'Follow Club',
      `Are you sure you want to ${clubData.isFollowing ? 'unfollow' : 'follow'} ${clubData.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log('Follow toggled') },
      ]
    );
  }, [clubData]);

  const handleBuyTokens = useCallback(() => {
    Alert.alert(
      'Buy Fan Tokens',
      `Purchase ${clubData.fanTokenSymbol} tokens to participate in polls and earn rewards.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy Tokens', onPress: () => console.log('Buy tokens') },
      ]
    );
  }, [clubData]);

  const handleVote = useCallback((pollId: string, optionId: string, requiredTokens: number) => {
    if (userTokenBalance.balance < requiredTokens) {
      Alert.alert(
        'Insufficient Tokens',
        `You need ${requiredTokens} ${clubData.fanTokenSymbol} tokens to vote on this poll. You currently have ${userTokenBalance.balance} tokens.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy Tokens', onPress: handleBuyTokens },
        ]
      );
      return;
    }

    Alert.alert(
      'Confirm Vote',
      `This will cost ${requiredTokens} ${clubData.fanTokenSymbol} tokens. Are you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Vote', onPress: () => console.log('Vote cast:', pollId, optionId) },
      ]
    );
  }, [userTokenBalance, clubData, handleBuyTokens]);

  const formatTimeRemaining = useCallback((endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  }, []);

  const getCategoryColor = useCallback((category: Poll['category']) => {
    switch (category) {
      case 'match':
        return colors.success;
      case 'transfer':
        return colors.warning;
      case 'tactics':
        return colors.primary;
      case 'general':
        return colors.secondary;
      default:
        return colors.textSecondary;
    }
  }, [colors]);

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

  const renderPollOption = useCallback((option: PollOption, poll: Poll, index: number) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.pollOption,
        { 
          backgroundColor: poll.userVoted && poll.userVotedOption === index ? colors.primary + '20' : colors.surface,
          borderColor: poll.userVoted && poll.userVotedOption === index ? colors.primary : colors.border,
        }
      ]}
      onPress={() => !poll.userVoted && handleVote(poll.id, option.id, poll.requiredTokens)}
      disabled={poll.userVoted || !poll.isActive}
    >
      <View style={styles.pollOptionContent}>
        <Text style={[styles.pollOptionText, { color: colors.text }]}>
          {option.text}
        </Text>
        <View style={styles.pollOptionStats}>
          <Text style={[styles.pollOptionVotes, { color: colors.textSecondary }]}>
            {option.votes} votes
          </Text>
          <Text style={[styles.pollOptionPercentage, { color: colors.primary }]}>
            {option.percentage}%
          </Text>
        </View>
      </View>
      {poll.userVoted && (
        <View style={[styles.pollOptionBar, { backgroundColor: colors.primary + '20' }]}>
          <View
            style={[
              styles.pollOptionBarFill,
              { 
                width: `${option.percentage}%`,
                backgroundColor: colors.primary,
              }
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  ), [colors, handleVote]);

  const renderPoll = useCallback(({ item: poll }: { item: Poll }) => (
    <View style={[styles.pollCard, { backgroundColor: colors.card }]}>
      {/* Poll Header */}
      <View style={styles.pollHeader}>
        <View style={styles.pollAuthor}>
          <Image source={{ uri: poll.createdBy.avatar }} style={styles.pollAuthorAvatar} />
          <View style={styles.pollAuthorInfo}>
            <View style={styles.pollAuthorName}>
              <Text style={[styles.pollAuthorNameText, { color: colors.text }]}>
                {poll.createdBy.name}
              </Text>
              {poll.createdBy.verified && (
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              )}
            </View>
            <Text style={[styles.pollAuthorUsername, { color: colors.textSecondary }]}>
              {poll.createdBy.username}
            </Text>
          </View>
        </View>
        <View style={styles.pollMeta}>
          <View style={[styles.pollCategory, { backgroundColor: getCategoryColor(poll.category) + '20' }]}>
            <Text style={[styles.pollCategoryText, { color: getCategoryColor(poll.category) }]}>
              {poll.category.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Poll Question */}
      <Text style={[styles.pollQuestion, { color: colors.text }]}>
        {poll.question}
      </Text>

      {/* Poll Options */}
      <View style={styles.pollOptions}>
        {poll.options.map((option, index) => renderPollOption(option, poll, index))}
      </View>

      {/* Poll Footer */}
      <View style={styles.pollFooter}>
        <View style={styles.pollStats}>
          <Text style={[styles.pollTotalVotes, { color: colors.textSecondary }]}>
            {poll.totalVotes.toLocaleString()} votes
          </Text>
          <Text style={[styles.pollTimeRemaining, { color: colors.textSecondary }]}>
            {formatTimeRemaining(poll.endsAt)}
          </Text>
        </View>
        <View style={styles.pollTokenRequirement}>
          <Ionicons name="diamond" size={16} color={colors.tokenGold} />
          <Text style={[styles.pollTokenText, { color: colors.textSecondary }]}>
            {poll.requiredTokens} {clubData.fanTokenSymbol}
          </Text>
        </View>
      </View>

      {/* Vote Button */}
      {!poll.userVoted && poll.isActive && (
        <TouchableOpacity
          style={[
            styles.voteButton,
            { 
              backgroundColor: userTokenBalance.balance >= poll.requiredTokens ? colors.primary : colors.border,
            }
          ]}
          onPress={() => handleVote(poll.id, poll.options[0].id, poll.requiredTokens)}
          disabled={userTokenBalance.balance < poll.requiredTokens}
        >
          <Text style={[
            styles.voteButtonText,
            { color: userTokenBalance.balance >= poll.requiredTokens ? 'white' : colors.textSecondary }
          ]}>
            {userTokenBalance.balance >= poll.requiredTokens ? 'Vote Now' : 'Insufficient Tokens'}
          </Text>
        </TouchableOpacity>
      )}

      {poll.userVoted && (
        <View style={[styles.votedIndicator, { backgroundColor: colors.success + '20' }]}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={[styles.votedText, { color: colors.success }]}>
            You voted for: {poll.options[poll.userVotedOption!].text}
          </Text>
        </View>
      )}
    </View>
  ), [colors, clubData, userTokenBalance, getCategoryColor, formatTimeRemaining, renderPollOption, handleVote]);

  const filteredPolls = useMemo(() => {
    switch (activeTab) {
      case 'trending':
        return polls.sort((a, b) => b.totalVotes - a.totalVotes);
      case 'recent':
        return polls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'my-polls':
        return polls.filter(poll => poll.userVoted);
      default:
        return polls;
    }
  }, [activeTab, polls]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{clubData.name}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

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
        {/* Club Header */}
        <View style={styles.clubHeader}>
          <Image source={{ uri: clubData.coverImage }} style={styles.clubCover} />
          <View style={styles.clubInfo}>
            <View style={styles.clubLogoContainer}>
              <Image source={{ uri: clubData.logo }} style={styles.clubLogo} />
            </View>
            <View style={styles.clubDetails}>
              <Text style={[styles.clubName, { color: colors.text }]}>{clubData.name}</Text>
              <Text style={[styles.clubDescription, { color: colors.textSecondary }]}>
                {clubData.description}
              </Text>
              <View style={styles.clubStats}>
                <Text style={[styles.clubStat, { color: colors.textSecondary }]}>
                  Founded {clubData.founded}
                </Text>
                <Text style={[styles.clubStat, { color: colors.textSecondary }]}>
                  {clubData.stadium}
                </Text>
                <Text style={[styles.clubStat, { color: colors.textSecondary }]}>
                  {(clubData.followers / 1000000).toFixed(0)}M followers
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Token Balance */}
        <View style={[styles.tokenBalance, { backgroundColor: colors.card }]}>
          <View style={styles.tokenInfo}>
            <View style={styles.tokenHeader}>
              <Ionicons name="diamond" size={24} color={colors.tokenGold} />
              <Text style={[styles.tokenSymbol, { color: colors.text }]}>
                {userTokenBalance.symbol}
              </Text>
            </View>
            <Text style={[styles.tokenAmount, { color: colors.text }]}>
              {userTokenBalance.balance.toLocaleString()}
            </Text>
            <Text style={[styles.tokenValue, { color: colors.textSecondary }]}>
              ≈ ${userTokenBalance.value.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.buyTokensButton, { backgroundColor: colors.primary }]}
            onPress={handleBuyTokens}
          >
            <Text style={styles.buyTokensText}>Buy Tokens</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.followButton,
              { backgroundColor: clubData.isFollowing ? 'transparent' : colors.primary }
            ]}
            onPress={handleFollow}
          >
            <Text style={[
              styles.followButtonText,
              { color: clubData.isFollowing ? colors.primary : 'white' }
            ]}>
              {clubData.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.createPollButton, { backgroundColor: colors.secondary }]}
            onPress={() => router.push('/create-post')}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.createPollText}>Create Poll</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {renderTabButton('trending', 'Trending')}
          {renderTabButton('recent', 'Recent')}
          {renderTabButton('my-polls', 'My Polls')}
        </View>

        {/* Polls */}
        <View style={styles.pollsContainer}>
          <FlatList
            data={filteredPolls}
            renderItem={renderPoll}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
  clubHeader: {
    marginBottom: 16,
  },
  clubCover: {
    width: '100%',
    height: 200,
  },
  clubInfo: {
    padding: 16,
  },
  clubLogoContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 16,
  },
  clubLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  clubDetails: {
    alignItems: 'center',
  },
  clubName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  clubDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  clubStats: {
    flexDirection: 'row',
    gap: 16,
  },
  clubStat: {
    fontSize: 14,
  },
  tokenBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: '600',
  },
  tokenAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tokenValue: {
    fontSize: 14,
  },
  buyTokensButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyTokensText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  followButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createPollButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createPollText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pollsContainer: {
    paddingHorizontal: 16,
  },
  pollCard: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pollAuthorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  pollAuthorInfo: {
    flex: 1,
  },
  pollAuthorName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pollAuthorNameText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pollAuthorUsername: {
    fontSize: 14,
    marginTop: 2,
  },
  pollMeta: {
    alignItems: 'flex-end',
  },
  pollCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pollCategoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  pollQuestion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 24,
  },
  pollOptions: {
    gap: 8,
    marginBottom: 16,
  },
  pollOption: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pollOptionContent: {
    padding: 12,
  },
  pollOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  pollOptionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pollOptionVotes: {
    fontSize: 12,
  },
  pollOptionPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  pollOptionBar: {
    height: 4,
    position: 'relative',
  },
  pollOptionBarFill: {
    height: '100%',
  },
  pollFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollStats: {
    flex: 1,
  },
  pollTotalVotes: {
    fontSize: 14,
    fontWeight: '500',
  },
  pollTimeRemaining: {
    fontSize: 12,
    marginTop: 2,
  },
  pollTokenRequirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pollTokenText: {
    fontSize: 12,
    fontWeight: '500',
  },
  voteButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  voteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  votedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  votedText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ClubPage; 