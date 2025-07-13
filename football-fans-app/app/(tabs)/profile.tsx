import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
  walletGradient1: '#FF6B35',
  walletGradient2: '#FF8A65',
  walletGradient3: '#FFB74D',
});

interface ProfilePost {
  id: string;
  image: string;
  likes: number;
  comments: number;
}

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'bonus' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  icon: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  image: string;
  available: boolean;
}

const LoginForm: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const { login, register, loading } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async () => {
    if (isLoginMode) {
      // Login
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      
      try {
        await login(email, password);
      } catch (error: any) {
        Alert.alert('Login Failed', error.message || 'Failed to login');
      }
    } else {
      // Register
      if (!email || !password || !name || !username) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      
      try {
        await register(email, password, name, username);
      } catch (error: any) {
        Alert.alert('Registration Failed', error.message || 'Failed to register');
      }
    }
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.gradient1]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
                    <TouchableOpacity activeOpacity={0.7}>
          <Image source={require('../../assets/images/fanzone-logo-orange.png')} style={{ width: 80, height: 80, alignSelf: 'center' }} resizeMode="contain" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.loginContainer}>
        <View style={[styles.loginCard, { backgroundColor: colors.card }]}>
          <View style={styles.loginHeader}>
            <Text style={[styles.loginTitle, { color: colors.text }]}>
              {isLoginMode ? 'Welcome Back!' : 'Join FanZone'}
            </Text>
            <Text style={[styles.loginSubtitle, { color: colors.textSecondary }]}>
              {isLoginMode ? 'Login to your account' : 'Create your account'}
            </Text>
          </View>

          <View style={styles.loginForm}>
            {!isLoginMode && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Username</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Choose a username"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                  />
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={[colors.primary, colors.gradient1]}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Please wait...' : (isLoginMode ? 'Login' : 'Create Account')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchModeButton}
              onPress={() => setIsLoginMode(!isLoginMode)}
            >
              <Text style={[styles.switchModeText, { color: colors.textSecondary }]}>
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <Text style={[styles.switchModeLink, { color: colors.primary }]}>
                  {isLoginMode ? 'Sign up' : 'Login'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileContent: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const { user, userProfile, logout, refreshUserProfile, updateProfile } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'achievements' | 'wallet' | 'transactions'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Dynamic data from user profile
  const posts: ProfilePost[] = userProfile?.posts || [];

  const userPolls = [
    {
      id: 'user-poll-1',
      question: 'Who should be our next captain?',
      totalVotes: 156,
      timeLeft: '2d 5h',
      image: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=Poll+1',
    },
    {
      id: 'user-poll-2',
      question: 'Best formation for next match?',
      totalVotes: 89,
      timeLeft: '1d 12h',
      image: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Poll+2',
    },
    {
      id: 'user-poll-3',
      question: 'Transfer priority this summer?',
      totalVotes: 234,
      timeLeft: '3d 8h',
      image: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Poll+3',
    },
  ];

  const achievements = [
    { id: '1', title: 'First Vote', description: 'Cast your first vote', icon: 'trophy', earned: true },
    { id: '2', title: 'Poll Creator', description: 'Create your first poll', icon: 'create', earned: true },
    { id: '3', title: 'Super Fan', description: 'Vote on 10 polls', icon: 'star', earned: true },
    { id: '4', title: 'Trending Creator', description: 'Create a trending poll', icon: 'flame', earned: false },
    { id: '5', title: 'CHZ Collector', description: 'Earn 100 CHZ', icon: 'diamond', earned: false },
    { id: '6', title: 'Community Leader', description: 'Get 50 followers', icon: 'people', earned: false },
  ];

  const transactions: Transaction[] = [
    { id: '1', type: 'earned', amount: 50, description: 'Welcome bonus', date: '2024-01-15', icon: 'gift', status: 'completed' },
    { id: '2', type: 'spent', amount: 10, description: 'Poll vote', date: '2024-01-14', icon: 'vote', status: 'completed' },
    { id: '3', type: 'earned', amount: 25, description: 'Poll creation bonus', date: '2024-01-13', icon: 'create', status: 'completed' },
    { id: '4', type: 'earned', amount: 15, description: 'Daily login bonus', date: '2024-01-12', icon: 'calendar', status: 'completed' },
    { id: '5', type: 'spent', amount: 5, description: 'Poll vote', date: '2024-01-11', icon: 'vote', status: 'completed' },
  ];

  const rewards: Reward[] = [
    { id: '1', title: 'Team Jersey', description: 'Official team jersey', points: 500, image: 'https://via.placeholder.com/60', available: true },
    { id: '2', title: 'Match Tickets', description: 'VIP match tickets', points: 1000, image: 'https://via.placeholder.com/60', available: false },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshUserProfile();
    setRefreshing(false);
  }, [refreshUserProfile]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  }, [logout]);

  const handleEditProfile = useCallback(() => {
    setEditName(userProfile?.displayName || '');
    setEditBio(userProfile?.bio || '');
    setShowEditModal(true);
  }, [userProfile]);

  const handleSaveProfile = useCallback(async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      await updateProfile({
        displayName: editName.trim(),
        bio: editBio.trim(),
      });
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile');
    }
  }, [editName, editBio, updateProfile]);

  // Handle profile photo change
  const handleChangePhoto = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photos to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadingPhoto(true);
        
        try {
          const asset = result.assets[0];
          
          // For demo purposes, simulate successful upload
          // In production, you would upload to Firebase Storage here
          const mockPhotoURL = asset.uri;
          
          // Update profile with new photo URL
          await updateProfile({ photoURL: mockPhotoURL });
          
          Alert.alert('Success! 🎉', 'Your profile photo has been updated successfully!');
        } catch (uploadError: any) {
          console.error('Upload error:', uploadError);
          Alert.alert(
            'Upload Failed', 
            'Failed to update profile photo. Please try again.'
          );
        }
      }
    } catch (error: any) {
      console.error('Photo picker error:', error);
      Alert.alert(
        'Error', 
        'Failed to update profile photo. Please try again.'
      );
    } finally {
      setUploadingPhoto(false);
    }
  }, [user, updateProfile]);

  const renderStats = useCallback(() => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {posts.length}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {userProfile?.followers?.length || 0}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {userProfile?.follows?.length || 0}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {userProfile?.balanceCHZ?.toLocaleString() || '0'}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>CHZ</Text>
      </View>
    </View>
  ), [userProfile, posts.length, colors]);

  const renderTabButton = useCallback((tab: 'posts' | 'achievements' | 'wallet' | 'transactions', label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && [styles.activeTabButton, { borderBottomColor: colors.primary }]
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={activeTab === tab ? colors.primary : colors.textSecondary}
      />
      <Text style={[
        styles.tabLabel,
        { color: activeTab === tab ? colors.primary : colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  ), [activeTab, colors]);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'posts':
        return (
          <View style={styles.postsContainer}>
            {/* Posts Section */}
            <View style={styles.postsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Posts</Text>
              <View style={styles.postsGrid}>
                {posts.map((post) => (
                  <TouchableOpacity key={post.id} style={styles.postItem}>
                    <Image source={{ uri: post.image }} style={styles.postImage} />
                    <View style={styles.postOverlay}>
                      <View style={styles.postStats}>
                        <Ionicons name="heart" size={16} color="white" />
                        <Text style={styles.postStatText}>{post.likes}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Polls Section */}
            <View style={styles.pollsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>My Polls</Text>
              <View style={styles.pollsGrid}>
                {userPolls.map((poll) => (
                  <TouchableOpacity key={poll.id} style={styles.pollItem}>
                    <Image source={{ uri: poll.image }} style={styles.pollImage} />
                    <View style={styles.pollOverlay}>
                      <Text style={styles.pollQuestion} numberOfLines={2}>
                        {poll.question}
                      </Text>
                      <View style={styles.pollStats}>
                        <View style={styles.pollStat}>
                          <Ionicons name="people" size={12} color="white" />
                          <Text style={styles.pollStatText}>{poll.totalVotes}</Text>
                        </View>
                        <View style={styles.pollStat}>
                          <Ionicons name="time" size={12} color="white" />
                          <Text style={styles.pollStatText}>{poll.timeLeft}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 'achievements':
        return (
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={[styles.achievementItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.earned ? colors.primary : colors.border }]}>
                  <Ionicons
                    name={achievement.icon as any}
                    size={24}
                    color={achievement.earned ? 'white' : colors.textSecondary}
                  />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[styles.achievementTitle, { color: colors.text }]}>{achievement.title}</Text>
                  <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>{achievement.description}</Text>
                </View>
                {achievement.earned && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                )}
              </View>
            ))}
          </View>
        );
      case 'wallet':
        return (
          <View style={styles.walletContainer}>
            <View style={[styles.balanceCard, { backgroundColor: colors.card }]}>
              <LinearGradient
                colors={[colors.walletGradient1, colors.walletGradient2]}
                style={styles.balanceGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.balanceContent}>
                  <Ionicons name="diamond" size={32} color="white" />
                  <Text style={styles.balanceAmount}>{userProfile?.balanceCHZ || 0} CHZ</Text>
                  <Text style={styles.balanceLabel}>Available Balance</Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        );
      case 'transactions':
        return (
          <View style={styles.transactionsContainer}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={[styles.transactionItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.transactionIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name={transaction.icon as any} size={20} color="white" />
                </View>
                <View style={styles.transactionContent}>
                  <Text style={[styles.transactionDescription, { color: colors.text }]}>{transaction.description}</Text>
                  <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>{transaction.date}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'earned' ? colors.success : colors.error }
                ]}>
                  {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} CHZ
                </Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  }, [activeTab, posts, achievements, transactions, userProfile, colors]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[colors.primary, colors.gradient1]}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onLongPress={handleChangePhoto}
              disabled={uploadingPhoto || !user || user.uid !== userProfile?.uid}
              activeOpacity={0.7}
            >
              <View style={styles.avatar}>
                {uploadingPhoto ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : userProfile?.photoURL ? (
                  <Image source={{ uri: userProfile.photoURL }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={40} color={colors.primary} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: colors.text }]}>
            {userProfile?.displayName || 'Football Fan'}
          </Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            @{userProfile?.username || 'user'}
          </Text>
          <Text style={[styles.bio, { color: colors.text }]}>
            {userProfile?.bio || 'Football enthusiast • FanZone member'}
          </Text>
        </View>

        {/* Stats */}
        {renderStats()}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleEditProfile}
          >
            <LinearGradient
              colors={[colors.primary, colors.gradient1]}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="create" size={16} color="white" />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleLogout}
          >
            <LinearGradient
              colors={[colors.surface, colors.surface]}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="log-out" size={16} color={colors.text} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderColor: colors.border }]}>
          {renderTabButton('posts', 'Posts', 'grid-outline')}
          {renderTabButton('achievements', 'Achievements', 'trophy-outline')}
          {renderTabButton('wallet', 'Wallet', 'wallet-outline')}
          {renderTabButton('transactions', 'History', 'time-outline')}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
      </ScrollView>

      {/* Simple Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>  
          <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={handleChangePhoto}
              disabled={uploadingPhoto}
              activeOpacity={0.7}
            >
              <View style={styles.avatar}>
                {uploadingPhoto ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : userProfile?.photoURL ? (
                  <Image source={{ uri: userProfile.photoURL }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={40} color={colors.primary} />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={[styles.modalCancelText, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={[styles.modalSaveText, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.editSection}>
              <Text style={[styles.editLabel, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[styles.editInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.editSection}>
              <Text style={[styles.editLabel, { color: colors.text }]}>Bio</Text>
              <TextInput
                style={[styles.editTextArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return user ? <ProfileContent /> : <LoginForm />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  loginForm: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchModeButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchModeText: {
    fontSize: 16,
  },
  switchModeLink: {
    fontWeight: '600',
  },
  profileHeader: {
    height: 200,
    position: 'relative',
  },
  profileGradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -40,
    alignSelf: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  profileInfo: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    marginHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
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
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  postItem: {
    width: (width - 56) / 3,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
  },
  walletContainer: {
    gap: 20,
  },
  balanceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceGradient: {
    padding: 24,
    alignItems: 'center',
  },
  balanceContent: {
    alignItems: 'center',
    gap: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  transactionsContainer: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
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
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
    gap: 20,
  },
  editSection: {
    gap: 8,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  editTextArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  postsContainer: {
    padding: 20,
  },
  postsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pollsSection: {
    marginBottom: 24,
  },
  pollsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pollItem: {
    width: (width - 56) / 3,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pollImage: {
    width: '100%',
    height: '100%',
  },
  pollOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 6,
  },
  pollQuestion: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  pollStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pollStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pollStatText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  profilePhotoContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
});

export default ProfilePage;
