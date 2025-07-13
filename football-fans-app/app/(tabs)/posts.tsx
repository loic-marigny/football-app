import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
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
import { useAuth } from '../contexts/AuthContext';
import { fanZoneAPI } from '../lib/api';

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
  tokenGold: '#FFD700',
  gradient1: isDark ? '#FF6B35' : '#FF8A65',
  gradient2: isDark ? '#FF8A65' : '#FFB74D',
  inputBackground: isDark ? '#2C2C2E' : '#F3F2EF',
});

interface Club {
  id: string;
  name: string;
  logo: string;
  color: string;
  polls: Poll[];
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  creator: {
    id: string;
    name: string;
    avatar: string;
    isTeam?: boolean; // Added for team polls
  };
  club?: Club;
  totalVotes: number;
  requiredTokens: number;
  timeLeft: string;
  userVoted: boolean;
  userVoteOption?: string;
  trending: boolean;
  isPremium: boolean;
  createdAt: Date;
}

interface FeedPost {
  id: string;
  type: 'poll' | 'post' | 'highlight';
  content: string;
  image?: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  poll?: Poll;
  isLiked?: boolean;
}

const VotePage: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const { user, userProfile, updateCHZBalance } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedPost[]>([]);

  // Create Poll Modal State
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [selectedClub, setSelectedClub] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Mock clubs with their polls
  const clubs = useMemo((): Club[] => [
    {
      id: '1',
      name: 'Manchester United',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png',
      color: '#DA020E',
      polls: [
        {
          id: 'mu1',
          question: 'Who should start vs Liverpool? 🔴',
          options: [
            { id: '1', text: 'Rashford', votes: 120, percentage: 48 },
            { id: '2', text: 'Martial', votes: 80, percentage: 32 },
            { id: '3', text: 'Garnacho', votes: 50, percentage: 20 },
          ],
          creator: { id: 'user1', name: 'Manchester United', avatar: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png', isTeam: true },
          totalVotes: 250,
          requiredTokens: 5,
          timeLeft: '2h 15m',
          userVoted: false,
          trending: true,
          isPremium: false,
          createdAt: new Date(),
        },
        {
          id: 'mu2',
          question: 'Best summer signing priority?',
          options: [
            { id: '1', text: 'Striker', votes: 200, percentage: 57 },
            { id: '2', text: 'Midfielder', votes: 90, percentage: 26 },
            { id: '3', text: 'Defender', votes: 60, percentage: 17 },
          ],
          creator: { id: 'user2', name: 'UnitedFan', avatar: 'https://via.placeholder.com/40', isTeam: false },
          totalVotes: 350,
          requiredTokens: 0,
          timeLeft: '1d 5h',
          userVoted: false,
          trending: false,
          isPremium: true,
          createdAt: new Date(),
        },
        {
          id: 'mu3',
          question: 'Formation vs City?',
          options: [
            { id: '1', text: '4-3-3', votes: 60, percentage: 40 },
            { id: '2', text: '3-5-2', votes: 55, percentage: 37 },
            { id: '3', text: '4-2-3-1', votes: 35, percentage: 23 },
          ],
          creator: { id: 'user3', name: 'TacticsGuru', avatar: 'https://via.placeholder.com/40', isTeam: false },
          totalVotes: 150,
          requiredTokens: 0,
          timeLeft: '6h',
          userVoted: false,
          trending: false,
          isPremium: false,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '2',
      name: 'Barcelona',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png',
      color: '#004D98',
      polls: [
        {
          id: 'bar1',
          question: 'Messi return this summer? 🐐',
          options: [
            { id: '1', text: 'Yes, definitely!', votes: 2500, percentage: 70 },
            { id: '2', text: 'Maybe', votes: 750, percentage: 21 },
            { id: '3', text: 'No way', votes: 320, percentage: 9 },
          ],
          creator: { id: 'user4', name: 'FC Barcelona', avatar: 'https://via.placeholder.com/40', isTeam: true },
          totalVotes: 3570,
          requiredTokens: 15,
          timeLeft: '3d 2h',
          userVoted: false,
          trending: true,
          isPremium: true,
          createdAt: new Date(),
        },
        {
          id: 'bar2',
          question: 'Best young talent?',
          options: [
            { id: '1', text: 'Pedri', votes: 900, percentage: 45 },
            { id: '2', text: 'Gavi', votes: 800, percentage: 40 },
            { id: '3', text: 'Yamal', votes: 300, percentage: 15 },
          ],
          creator: { id: 'user5', name: 'LaMasia', avatar: 'https://via.placeholder.com/40', isTeam: false },
          totalVotes: 2000,
          requiredTokens: 0,
          timeLeft: '12h',
          userVoted: false,
          trending: false,
          isPremium: false,
          createdAt: new Date(),
        },
        {
          id: 'bar3',
          question: 'Next captain after Busquets?',
          options: [
            { id: '1', text: 'Ter Stegen', votes: 600, percentage: 40 },
            { id: '2', text: 'Araujo', votes: 500, percentage: 33 },
            { id: '3', text: 'Pedri', votes: 400, percentage: 27 },
          ],
          creator: { id: 'user6', name: 'BarçaLegend', avatar: 'https://via.placeholder.com/40', isTeam: false },
          totalVotes: 1500,
          requiredTokens: 0,
          timeLeft: '1d',
          userVoted: false,
          trending: false,
          isPremium: false,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '3',
      name: 'Real Madrid',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png',
      color: '#FFFFFF',
      polls: [
        {
          id: 'rm1',
          question: 'Mbappé or Haaland? 👑',
          options: [
            { id: '1', text: 'Mbappé', votes: 1800, percentage: 55 },
            { id: '2', text: 'Haaland', votes: 1200, percentage: 37 },
            { id: '3', text: 'Both!', votes: 250, percentage: 8 },
          ],
          creator: { id: 'user7', name: 'Real Madrid CF', avatar: 'https://via.placeholder.com/40', isTeam: true },
          totalVotes: 3250,
          requiredTokens: 12,
          timeLeft: '2d 8h',
          userVoted: false,
          trending: true,
          isPremium: true,
          createdAt: new Date(),
        },
        {
          id: 'rm2',
          question: 'Best midfield trio?',
          options: [
            { id: '1', text: 'Modric-Kroos-Casemiro', votes: 1100, percentage: 65 },
            { id: '2', text: 'Bellingham-Valverde-Camavinga', votes: 400, percentage: 24 },
            { id: '3', text: 'Mix of both', votes: 180, percentage: 11 },
          ],
          creator: { id: 'user8', name: 'MidfieldMaster', avatar: 'https://via.placeholder.com/40', isTeam: false },
          totalVotes: 1680,
          requiredTokens: 0,
          timeLeft: '18h',
          userVoted: false,
          trending: false,
          isPremium: false,
          createdAt: new Date(),
        },
        {
          id: 'rm3',
          question: 'Champions League prediction?',
          options: [
            { id: '1', text: 'Winners', votes: 1200, percentage: 60 },
            { id: '2', text: 'Final', votes: 500, percentage: 25 },
            { id: '3', text: 'Semi-final', votes: 300, percentage: 15 },
          ],
          creator: { id: 'user9', name: 'ChampionsLeague', avatar: 'https://via.placeholder.com/40', isTeam: false },
          totalVotes: 2000,
          requiredTokens: 0,
          timeLeft: '4d',
          userVoted: false,
          trending: false,
          isPremium: false,
          createdAt: new Date(),
        },
      ],
    },
  ], []);

  // Initialize feed items
  React.useEffect(() => {
    const allPolls = clubs.flatMap(club => 
      club.polls.map(poll => ({ ...poll, club }))
    );
    
    const trendingPolls = allPolls.filter(poll => poll.trending);
    const regularPolls = allPolls.filter(poll => !poll.trending);
    
    console.log('All polls:', allPolls.length);
    console.log('Trending polls:', trendingPolls.length);
    console.log('Regular polls:', regularPolls.length);
    
    // Create mixed feed items with more posts
    const items: FeedPost[] = [
      // Trending polls first
      ...trendingPolls.slice(0, 2).map(poll => ({
        id: `trending-${poll.id}`,
        type: 'poll' as const,
        content: poll.question,
        creator: {
          id: poll.creator.id,
          name: poll.creator.name,
          username: poll.creator.name.toLowerCase().replace(/\s+/g, '_'),
          avatar: poll.creator.avatar,
        },
        likes: poll.totalVotes,
        comments: Math.floor(poll.totalVotes * 0.1),
        shares: Math.floor(poll.totalVotes * 0.05),
        createdAt: poll.createdAt,
        poll,
      })),
      
      // Regular posts
      {
        id: 'post1',
        type: 'post' as const,
        content: 'Just watched the most incredible match! That last-minute goal was absolutely insane! ⚽🔥 What a game!',
        image: 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Match+Highlight',
        creator: {
          id: 'user10',
          name: 'FootballLover',
          username: 'football_lover',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 342,
        comments: 28,
        shares: 12,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      
      // Regular poll
      ...regularPolls.slice(0, 1).map(poll => ({
        id: `regular-${poll.id}`,
        type: 'poll' as const,
        content: poll.question,
        creator: {
          id: poll.creator.id,
          name: poll.creator.name,
          username: poll.creator.name.toLowerCase().replace(/\s+/g, '_'),
          avatar: poll.creator.avatar,
        },
        likes: poll.totalVotes,
        comments: Math.floor(poll.totalVotes * 0.1),
        shares: Math.floor(poll.totalVotes * 0.05),
        createdAt: poll.createdAt,
        poll,
      })),
      
      // Highlight post
      {
        id: 'highlight1',
        type: 'highlight' as const,
        content: 'GOAL OF THE SEASON! 🚀 This volley from outside the box is absolutely world class!',
        image: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Goal+Highlight',
        creator: {
          id: 'user11',
          name: 'GoalHunter',
          username: 'goal_hunter',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 892,
        comments: 67,
        shares: 45,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      
      // More regular polls
      ...regularPolls.slice(1, 3).map(poll => ({
        id: `regular-${poll.id}`,
        type: 'poll' as const,
        content: poll.question,
        creator: {
          id: poll.creator.id,
          name: poll.creator.name,
          username: poll.creator.name.toLowerCase().replace(/\s+/g, '_'),
          avatar: poll.creator.avatar,
        },
        likes: poll.totalVotes,
        comments: Math.floor(poll.totalVotes * 0.1),
        shares: Math.floor(poll.totalVotes * 0.05),
        createdAt: poll.createdAt,
        poll,
      })),
      
      // Another post
      {
        id: 'post2',
        type: 'post' as const,
        content: 'Match day vibes! 🎉 Nothing beats the atmosphere at the stadium. The energy is electric!',
        image: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Stadium+View',
        creator: {
          id: 'user12',
          name: 'StadiumGoer',
          username: 'stadium_goer',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 156,
        comments: 23,
        shares: 8,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      
      // More polls
      ...regularPolls.slice(3, 5).map(poll => ({
        id: `regular-${poll.id}`,
        type: 'poll' as const,
        content: poll.question,
        creator: {
          id: poll.creator.id,
          name: poll.creator.name,
          username: poll.creator.name.toLowerCase().replace(/\s+/g, '_'),
          avatar: poll.creator.avatar,
        },
        likes: poll.totalVotes,
        comments: Math.floor(poll.totalVotes * 0.1),
        shares: Math.floor(poll.totalVotes * 0.05),
        createdAt: poll.createdAt,
        poll,
      })),
      
      // Additional posts
      {
        id: 'post3',
        type: 'post' as const,
        content: 'Transfer window is heating up! 🔥 Who do you think will be the biggest signing this summer?',
        image: 'https://via.placeholder.com/400x300/FFD700/FFFFFF?text=Transfer+News',
        creator: {
          id: 'user13',
          name: 'TransferGuru',
          username: 'transfer_guru',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 234,
        comments: 45,
        shares: 18,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      },
      
      {
        id: 'post4',
        type: 'post' as const,
        content: 'Training session today was intense! 💪 The team is looking sharp for the weekend match.',
        image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Training+Session',
        creator: {
          id: 'user14',
          name: 'TrainingInsider',
          username: 'training_insider',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 89,
        comments: 12,
        shares: 5,
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
      },
      
      {
        id: 'post5',
        type: 'highlight' as const,
        content: 'UNBELIEVABLE SAVE! 🧤 The goalkeeper just pulled off the save of the century!',
        image: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Amazing+Save',
        creator: {
          id: 'user15',
          name: 'SaveMaster',
          username: 'save_master',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 567,
        comments: 34,
        shares: 22,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      
      {
        id: 'post6',
        type: 'post' as const,
        content: 'Match day atmosphere is absolutely electric! ⚡ The fans are incredible today!',
        image: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Match+Atmosphere',
        creator: {
          id: 'user16',
          name: 'AtmosphereKing',
          username: 'atmosphere_king',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 445,
        comments: 67,
        shares: 28,
        createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
      },
      
      {
        id: 'post7',
        type: 'post' as const,
        content: 'Just finished watching the youth team play. Some incredible talent coming through! 🌟',
        image: 'https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Youth+Team',
        creator: {
          id: 'user17',
          name: 'YouthScout',
          username: 'youth_scout',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 178,
        comments: 23,
        shares: 9,
        createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
      },
      
      {
        id: 'post8',
        type: 'highlight' as const,
        content: 'GOAL OF THE SEASON CONTENDER! 🚀 This free kick is absolutely world class!',
        image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Free+Kick+Goal',
        creator: {
          id: 'user18',
          name: 'GoalOfTheSeason',
          username: 'goal_of_the_season',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 892,
        comments: 89,
        shares: 45,
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
      },
      
      {
        id: 'post9',
        type: 'post' as const,
        content: 'The tactical analysis from today\'s match was spot on! 📊 Great insights from the coach.',
        image: 'https://via.placeholder.com/400x300/84CC16/FFFFFF?text=Tactical+Analysis',
        creator: {
          id: 'user19',
          name: 'TacticalExpert',
          username: 'tactical_expert',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 156,
        comments: 34,
        shares: 12,
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
      },
      
      {
        id: 'post10',
        type: 'post' as const,
        content: 'Post-match celebrations are always the best! 🎉 Champions mentality!',
        image: 'https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Post+Match',
        creator: {
          id: 'user20',
          name: 'CelebrationKing',
          username: 'celebration_king',
          avatar: 'https://via.placeholder.com/40',
        },
        likes: 334,
        comments: 56,
        shares: 18,
        createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
      },
    ];
    
    setFeedItems(items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  }, [clubs]);

  const handleVote = useCallback(async (poll: Poll, optionId: string) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to vote.');
      return;
    }

    if (poll.userVoted) {
      Alert.alert('Already Voted', 'You have already voted for this poll.');
      return;
    }

    // Check if poll creator is a team account
    const isTeamPoll = poll.creator.isTeam || false;
    const requiredTokens = isTeamPoll ? poll.requiredTokens : 0;

    if (requiredTokens > 0 && (userProfile?.balanceCHZ || 0) < requiredTokens) {
      Alert.alert(
        'Insufficient CHZ',
        `You need ${requiredTokens} CHZ to vote on this team poll.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy CHZ', onPress: () => Alert.alert('Buy CHZ', 'Redirecting to purchase') },
        ]
      );
      return;
    }

    const selectedOption = poll.options.find(opt => opt.id === optionId);
    
    Alert.alert(
      'Confirm Vote',
      requiredTokens > 0 
        ? `Vote for "${selectedOption?.text}" (${requiredTokens} CHZ)`
        : `Vote for "${selectedOption?.text}" (Free)`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Vote', 
          onPress: async () => {
            try {
              // Deduct CHZ if it's a team poll
              if (requiredTokens > 0) {
                await updateCHZBalance(-requiredTokens);
              }

              // Try real API first
              await fanZoneAPI.vote(poll.id, parseInt(optionId) - 1, user.uid);
              setFeedItems((prev: any[]) => prev.map(item =>
                item.poll && item.poll.id === poll.id
                  ? { ...item, poll: { ...item.poll, userVoted: true, userVoteOption: optionId } }
                  : item
              ));
              Alert.alert('Success! 🎉', 'Your vote has been recorded!');
            } catch (error: any) {
              // If API fails, update UI locally for demo purposes
              setFeedItems((prev: any[]) => prev.map(item =>
                item.poll && item.poll.id === poll.id
                  ? { ...item, poll: { ...item.poll, userVoted: true, userVoteOption: optionId } }
                  : item
              ));
              Alert.alert('Success (Demo)', 'Your vote has been recorded locally (API not available).');
            }
          }
        },
      ]
    );
  }, [user, userProfile?.balanceCHZ, updateCHZBalance]);

  const handleCreatePoll = useCallback(async () => {
    if (!newPollQuestion.trim() || !selectedClub) {
      Alert.alert('Error', 'Please fill in all fields and select a club.');
      return;
    }

    const validOptions = newPollOptions.filter(opt => opt.trim().length > 0);
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Please provide at least 2 options.');
      return;
    }

    setCreateLoading(true);
    try {
      await fanZoneAPI.createPoll(newPollQuestion, validOptions, user?.uid || '', false, 5);
      setShowCreateModal(false);
      setNewPollQuestion('');
      setNewPollOptions(['', '']);
      setSelectedClub('');
      Alert.alert('Success! 🎉', 'Your poll has been created!');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create poll');
    } finally {
      setCreateLoading(false);
    }
  }, [newPollQuestion, newPollOptions, selectedClub, user]);

  const addPollOption = useCallback(() => {
    if (newPollOptions.length < 4) {
      setNewPollOptions([...newPollOptions, '']);
    }
  }, [newPollOptions]);

  const removePollOption = useCallback((index: number) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions(newPollOptions.filter((_, i) => i !== index));
    }
  }, [newPollOptions]);

  const updatePollOption = useCallback((index: number, text: string) => {
    const updated = [...newPollOptions];
    updated[index] = text;
    setNewPollOptions(updated);
  }, [newPollOptions]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderPollOption = useCallback((option: PollOption, poll: Poll, isSelected: boolean) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.pollOption,
        { 
          backgroundColor: poll.userVoted ? colors.surface : colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 2 : 1,
        }
      ]}
      onPress={() => !poll.userVoted && handleVote(poll, option.id)}
      disabled={poll.userVoted}
    >
      <View style={styles.pollOptionContent}>
        <View style={styles.pollOptionHeader}>
          <Text style={[styles.pollOptionText, { color: colors.text }]}>
            {option.text}
          </Text>
          {poll.userVoted && (
            <Text style={[styles.pollOptionPercentage, { color: colors.primary }]}>
              {option.percentage}%
            </Text>
          )}
          {isSelected && !poll.userVoted && (
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
          )}
        </View>
        {poll.userVoted && (
          <View style={styles.pollOptionBarContainer}>
            <View style={[styles.pollOptionBar, { backgroundColor: colors.border }]}> 
              <View style={[styles.pollOptionBarFill, { width: `${option.percentage}%`, backgroundColor: isSelected ? colors.primary : colors.accent }]} />
            </View>
          </View>
        )}
        {poll.userVoted && (
          <Text style={[styles.pollOptionVotes, { color: colors.textSecondary }]}> 
            {option.votes.toLocaleString()} votes
          </Text>
        )}
      </View>
    </TouchableOpacity>
  ), [colors, handleVote]);

  const handleLikePost = useCallback((postId: string) => {
    setFeedItems(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  }, []);

  const renderFeedItem = useCallback(({ item }: { item: FeedPost }) => {
    if (item.type === 'poll' && item.poll) {
      const poll = item.poll;
      return (
        <View style={[styles.feedCard, { backgroundColor: colors.card }]}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <TouchableOpacity 
              onPress={() => router.push(`/user-profile?id=${item.creator.id}&name=${item.creator.name}&username=${item.creator.username}&avatar=${item.creator.avatar}&isTeam=${poll.creator.isTeam}`)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.creator.avatar }} style={styles.postAvatar} />
            </TouchableOpacity>
            <View style={styles.postHeaderInfo}>
              <TouchableOpacity 
                onPress={() => router.push(`/user-profile?id=${item.creator.id}&name=${item.creator.name}&username=${item.creator.username}&avatar=${item.creator.avatar}&isTeam=${poll.creator.isTeam}`)}
                activeOpacity={0.7}
              >
                <View style={styles.creatorNameRow}>
                  <Text style={[styles.postCreatorName, { color: colors.text }]}>
                    {item.creator.name}
                  </Text>
                  {poll.creator.isTeam && (
                    <Ionicons name="checkmark-circle" size={16} color="#1DA1F2" style={styles.teamBadge} />
                  )}
                </View>
                <Text style={[styles.postUsername, { color: colors.textSecondary }]}>
                  @{item.creator.username}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.postTime, { color: colors.textSecondary }]}>
                {item.createdAt.toLocaleDateString()}
              </Text>
            </View>
            {poll.trending && (
              <LinearGradient
                colors={['#FF6B35', '#FF8A65']}
                style={styles.trendingBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="flame" size={12} color="white" />
                <Text style={styles.trendingText}>TRENDING</Text>
              </LinearGradient>
            )}
          </View>

          {/* Poll Question */}
          <Text style={[styles.pollQuestion, { color: colors.text }]}>
            {poll.question}
          </Text>

          {/* Poll Options */}
          <View style={styles.pollOptions}>
            {poll.options.map((option) => 
              renderPollOption(option, poll, poll.userVoteOption === option.id)
            )}
          </View>

          {/* Poll Stats */}
          <View style={styles.pollStats}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {poll.totalVotes.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {poll.timeLeft}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="diamond" size={16} color={colors.tokenGold} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {poll.requiredTokens} CHZ
              </Text>
            </View>
          </View>

          {/* Post Actions */}
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.postAction}>
              <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>
                {item.likes.toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>
                {item.comments.toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>
                {item.shares.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Regular post or highlight
    return (
      <TouchableOpacity 
        style={[styles.feedCard, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/post-detail?id=${item.id}`)}
        activeOpacity={0.7}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity 
            onPress={() => router.push(`/user-profile?id=${item.creator.id}&name=${item.creator.name}&username=${item.creator.username}&avatar=${item.creator.avatar}&isTeam=false`)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: item.creator.avatar }} style={styles.postAvatar} />
          </TouchableOpacity>
          <View style={styles.postHeaderInfo}>
            <TouchableOpacity 
              onPress={() => router.push(`/user-profile?id=${item.creator.id}&name=${item.creator.name}&username=${item.creator.username}&avatar=${item.creator.avatar}&isTeam=false`)}
              activeOpacity={0.7}
            >
              <View style={styles.creatorNameRow}>
                <Text style={[styles.postCreatorName, { color: colors.text }]}>
                  {item.creator.name}
                </Text>
              </View>
              <Text style={[styles.postUsername, { color: colors.textSecondary }]}>
                @{item.creator.username}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.postTime, { color: colors.textSecondary }]}>
              {item.createdAt.toLocaleDateString()}
            </Text>
          </View>
          {item.type === 'highlight' && (
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.highlightBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="star" size={12} color="white" />
              <Text style={styles.highlightText}>HIGHLIGHT</Text>
            </LinearGradient>
          )}
        </View>

        {/* Post Content */}
        <Text style={[styles.postContent, { color: colors.text }]}>
          {item.content}
        </Text>

        {/* Post Image */}
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.postAction}
            onPress={() => handleLikePost(item.id)}
          >
            <Ionicons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={item.isLiked ? colors.error : colors.textSecondary} 
            />
            <Text style={[styles.postActionText, { color: colors.textSecondary }]}>
              {item.likes.toLocaleString()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.postActionText, { color: colors.textSecondary }]}>
              {item.comments.toLocaleString()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.postActionText, { color: colors.textSecondary }]}>
              {item.shares.toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }, [colors, renderPollOption, handleLikePost]);

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loginPrompt}>
          <Ionicons name="lock-closed" size={64} color={colors.textSecondary} />
          <Text style={[styles.loginTitle, { color: colors.text }]}>Login Required</Text>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Please log in to access polls and voting features
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sticky Header with CHZ Balance */}
      <View style={styles.stickyHeader}>
        <LinearGradient
          colors={[colors.primary, colors.gradient1]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={require('../../assets/images/fanzone-logo-orange.png')} style={{ width: 80, height: 80, alignSelf: 'center' }} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={() => {
              console.log('Create button pressed');
              router.push('/create-post');
            }}
          >
            <Ionicons name="add-circle" size={28} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Sticky CHZ Balance */}
        <View style={styles.balanceSection}>
          <LinearGradient
            colors={[colors.primary, colors.gradient1]}
            style={styles.balanceCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.balanceContent}>
              <Ionicons name="diamond" size={24} color="white" />
              <Text style={styles.balanceAmount}>{userProfile?.balanceCHZ || 0} CHZ</Text>
              <Text style={styles.balanceLabel}>Available</Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      <FlatList
        data={feedItems}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedList}
      />

      {/* Create Poll Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.modalCancelText, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create Poll</Text>
            <TouchableOpacity onPress={handleCreatePoll} disabled={createLoading}>
              <Text style={[styles.modalCreateText, { color: colors.primary }]}>
                {createLoading ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Question</Text>
              <TextInput
                style={[styles.questionInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="What would you like to ask?"
                placeholderTextColor={colors.textSecondary}
                value={newPollQuestion}
                onChangeText={setNewPollQuestion}
                multiline
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Options</Text>
              {newPollOptions.map((option, index) => (
                <View key={index} style={styles.optionContainer}>
                  <TextInput
                    style={[styles.optionInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                    placeholder={`Option ${index + 1}`}
                    placeholderTextColor={colors.textSecondary}
                    value={option}
                    onChangeText={(text) => updatePollOption(index, text)}
                  />
                  {newPollOptions.length > 2 && (
                    <TouchableOpacity onPress={() => removePollOption(index)}>
                      <Ionicons name="close-circle" size={24} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              
              {newPollOptions.length < 4 && (
                <TouchableOpacity style={[styles.addOptionButton, { borderColor: colors.primary }]} onPress={addPollOption}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                  <Text style={[styles.addOptionText, { color: colors.primary }]}>Add Option</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Club</Text>
              <View style={styles.clubSelector}>
                {clubs.map((club) => (
                  <TouchableOpacity
                    key={club.id}
                    style={[
                      styles.clubOption,
                      { 
                        backgroundColor: selectedClub === club.id ? colors.primary : colors.surface,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setSelectedClub(club.id)}
                  >
                    <Image source={{ uri: club.logo }} style={styles.clubOptionLogo} />
                    <Text style={[
                      styles.clubOptionText,
                      { color: selectedClub === club.id ? 'white' : colors.text }
                    ]}>
                      {club.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  createButton: {
    padding: 4,
  },
  balanceSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  balanceCard: {
    borderRadius: 12,
    padding: 12,
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  feedList: {
    paddingTop: 140, // Account for sticky header
    paddingBottom: 20,
  },
  feedCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  postCreatorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  postUsername: {
    fontSize: 14,
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  highlightText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pollQuestion: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 16,
  },
  pollOptions: {
    gap: 12,
    marginBottom: 16,
  },
  pollOption: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  pollOptionContent: {
    padding: 16,
  },
  pollOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pollOptionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  pollOptionPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pollOptionBarContainer: {
    marginTop: 8,
  },
  pollOptionBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  pollOptionBarFill: {
    height: '100%',
  },
  pollOptionVotes: {
    fontSize: 12,
    marginTop: 4,
  },
  pollStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  loginText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCreateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  questionInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
  },
  addOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  clubSelector: {
    gap: 12,
  },
  clubOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  clubOptionLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  clubOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  creatorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  teamBadge: {
    marginLeft: 4,
  },
});

export default VotePage; 