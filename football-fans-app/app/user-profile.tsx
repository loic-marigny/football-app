import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/useColorScheme';
import { useAuth } from './contexts/AuthContext';

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
  gradient1: '#FF8A65',
  tokenGold: '#FFD700',
});

interface UserPost {
  id: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

interface UserPoll {
  id: string;
  question: string;
  totalVotes: number;
  timeLeft: string;
  createdAt: Date;
}

const UserProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const { user, userProfile } = useAuth();
  const params = useLocalSearchParams();
  
  const [activeTab, setActiveTab] = useState<'posts' | 'polls' | 'about'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data based on params
  const profileUser = {
    id: params.id as string || 'user1',
    name: params.name as string || 'Manchester United',
    username: params.username as string || 'manutd',
    avatar: params.avatar as string || 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png',
    bio: params.bio as string || 'Official Manchester United Football Club account. #MUFC 🔴',
    isTeam: params.isTeam === 'true',
    followers: 2500000,
    following: 50,
    posts: 1250,
    balanceCHZ: 50000,
  };

  // Mock posts
  const userPosts: UserPost[] = [
    {
      id: '1',
      content: 'Match day! 🔴 Ready for another big game at Old Trafford!',
      image: 'https://via.placeholder.com/400x300/DA020E/FFFFFF?text=Match+Day',
      likes: 45000,
      comments: 2300,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      content: 'Training session completed. The team is looking sharp! 💪',
      image: 'https://via.placeholder.com/400x300/DA020E/FFFFFF?text=Training',
      likes: 32000,
      comments: 1800,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      id: '3',
      content: 'Welcome to the family! 👋 New signing announcement coming soon...',
      likes: 67000,
      comments: 4500,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  // Mock polls
  const userPolls: UserPoll[] = [
    {
      id: '1',
      question: 'Who should start vs Liverpool? 🔴',
      totalVotes: 45000,
      timeLeft: '2h 15m',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: '2',
      question: 'Best goal of the season so far?',
      totalVotes: 32000,
      timeLeft: '1d 8h',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      id: '3',
      question: 'Transfer window priority?',
      totalVotes: 28000,
      timeLeft: '3d',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? 'Unfollowed' : 'Following',
      isFollowing ? `You've unfollowed ${profileUser.name}` : `You're now following ${profileUser.name}`
    );
  };

  const renderTabButton = (tab: 'posts' | 'polls' | 'about', label: string, icon: string) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        activeTab === tab && [styles.activeTabButton, { borderBottomColor: colors.primary }]
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={activeTab === tab ? colors.primary : colors.textSecondary} 
      />
      <Text style={[
        styles.tabLabel, 
        { color: activeTab === tab ? colors.primary : colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: UserPost }) => (
    <View style={[styles.postCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.postContent, { color: colors.text }]}>
        {item.content}
      </Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Ionicons name="heart-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {item.likes.toLocaleString()}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {item.comments.toLocaleString()}
          </Text>
        </View>
        <Text style={[styles.postTime, { color: colors.textSecondary }]}>
          {item.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderPoll = ({ item }: { item: UserPoll }) => (
    <View style={[styles.pollCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.pollQuestion, { color: colors.text }]}>
        {item.question}
      </Text>
      <View style={styles.pollStats}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={16} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {item.totalVotes.toLocaleString()} votes
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={16} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {item.timeLeft}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <FlatList
            data={userPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tabContent}
          />
        );
      case 'polls':
        return (
          <FlatList
            data={userPolls}
            renderItem={renderPoll}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tabContent}
          />
        );
      case 'about':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={[styles.aboutCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.aboutTitle, { color: colors.text }]}>About</Text>
              <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
                {profileUser.bio}
              </Text>
              
              <View style={styles.aboutStats}>
                <View style={styles.aboutStat}>
                  <Text style={[styles.aboutStatNumber, { color: colors.text }]}>
                    {profileUser.followers.toLocaleString()}
                  </Text>
                  <Text style={[styles.aboutStatLabel, { color: colors.textSecondary }]}>
                    Followers
                  </Text>
                </View>
                <View style={styles.aboutStat}>
                  <Text style={[styles.aboutStatNumber, { color: colors.text }]}>
                    {profileUser.following.toLocaleString()}
                  </Text>
                  <Text style={[styles.aboutStatLabel, { color: colors.textSecondary }]}>
                    Following
                  </Text>
                </View>
                <View style={styles.aboutStat}>
                  <Text style={[styles.aboutStatNumber, { color: colors.text }]}>
                    {profileUser.posts.toLocaleString()}
                  </Text>
                  <Text style={[styles.aboutStatLabel, { color: colors.textSecondary }]}>
                    Posts
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: profileUser.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {profileUser.name}
              </Text>
              {profileUser.isTeam && (
                <Ionicons name="checkmark-circle" size={20} color="white" style={styles.teamBadge} />
              )}
            </View>
            <Text style={[styles.profileUsername, { color: colors.textSecondary }]}>
              @{profileUser.username}
            </Text>
            <Text style={[styles.profileBio, { color: colors.textSecondary }]}>
              {profileUser.bio}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {profileUser.posts.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {profileUser.followers.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {profileUser.following.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isFollowing ? colors.surface : colors.primary }]}
            onPress={handleFollow}
          >
            <Text style={[styles.actionButtonText, { color: isFollowing ? colors.text : 'white' }]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.messageButton, { borderColor: colors.border }]}
          >
            <Ionicons name="mail-outline" size={20} color={colors.text} />
            <Text style={[styles.messageButtonText, { color: colors.text }]}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderColor: colors.border }]}>
          {renderTabButton('posts', 'Posts', 'grid-outline')}
          {renderTabButton('polls', 'Polls', 'bar-chart-outline')}
          {renderTabButton('about', 'About', 'information-circle-outline')}
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
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamBadge: {
    marginLeft: 4,
  },
  profileUsername: {
    fontSize: 16,
    marginTop: 2,
  },
  profileBio: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minWidth: 0,
  },
  activeTabButton: {
    // borderBottomColor will be set dynamically
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  tabContent: {
    padding: 20,
  },
  postCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  postStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
  },
  postTime: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  pollCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pollQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  pollStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  aboutCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  aboutStat: {
    alignItems: 'center',
  },
  aboutStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default UserProfileScreen; 