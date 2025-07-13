import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

interface Club {
  id: string;
  name: string;
  logo: string;
  color: string;
}

const CreatePostScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const { user, userProfile } = useAuth();

  const [postType, setPostType] = useState<'post' | 'poll'>('post');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollTokens, setPollTokens] = useState(5);
  const [isTeamPoll, setIsTeamPoll] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Mock clubs
  const clubs: Club[] = [
    {
      id: '1',
      name: 'Manchester United',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png',
      color: '#DA020E',
    },
    {
      id: '2',
      name: 'Barcelona',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png',
      color: '#004D98',
    },
    {
      id: '3',
      name: 'Real Madrid',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png',
      color: '#FFFFFF',
    },
  ];

  const addPollOption = useCallback(() => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  }, [pollOptions]);

  const removePollOption = useCallback((index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  }, [pollOptions]);

  const updatePollOption = useCallback((index: number, text: string) => {
    const updated = [...pollOptions];
    updated[index] = text;
    setPollOptions(updated);
  }, [pollOptions]);

  const handlePublish = useCallback(async () => {
    if (postType === 'post' && !content.trim()) {
      Alert.alert('Error', 'Please write something to post.');
      return;
    }

    if (postType === 'poll') {
      if (!pollQuestion.trim()) {
        Alert.alert('Error', 'Please enter a poll question.');
        return;
      }

      const validOptions = pollOptions.filter(opt => opt.trim().length > 0);
      if (validOptions.length < 2) {
        Alert.alert('Error', 'Please provide at least 2 poll options.');
        return;
      }

      if (isTeamPoll && (userProfile?.balanceCHZ || 0) < pollTokens) {
        Alert.alert('Insufficient CHZ', `You need ${pollTokens} CHZ to create a team poll.`);
        return;
      }
    }

    setPublishing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success! 🎉', 
        postType === 'post' 
          ? 'Your post has been published!' 
          : 'Your poll has been created!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to publish. Please try again.');
    } finally {
      setPublishing(false);
    }
  }, [postType, content, pollQuestion, pollOptions, isTeamPoll, pollTokens, userProfile?.balanceCHZ]);

  const renderPostForm = () => (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Write your post</Text>
      <TextInput
        style={[styles.contentInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        placeholder="What's happening in football today?"
        placeholderTextColor={colors.textSecondary}
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
      
      <TouchableOpacity style={[styles.addImageButton, { borderColor: colors.border }]}>
        <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
        <Text style={[styles.addImageText, { color: colors.textSecondary }]}>Add Image</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPollForm = () => (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Create a poll</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Question</Text>
        <TextInput
          style={[styles.pollQuestionInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          placeholder="What would you like to ask?"
          placeholderTextColor={colors.textSecondary}
          value={pollQuestion}
          onChangeText={setPollQuestion}
          multiline
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Options</Text>
        {pollOptions.map((option, index) => (
          <View key={index} style={styles.optionContainer}>
            <TextInput
              style={[styles.optionInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder={`Option ${index + 1}`}
              placeholderTextColor={colors.textSecondary}
              value={option}
              onChangeText={(text) => updatePollOption(index, text)}
            />
            {pollOptions.length > 2 && (
              <TouchableOpacity onPress={() => removePollOption(index)}>
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        {pollOptions.length < 4 && (
          <TouchableOpacity style={[styles.addOptionButton, { borderColor: colors.primary }]} onPress={addPollOption}>
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={[styles.addOptionText, { color: colors.primary }]}>Add Option</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Club (Optional)</Text>
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

      <View style={styles.inputGroup}>
        <View style={styles.teamPollSection}>
          <View style={styles.teamPollHeader}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Team Poll</Text>
            <TouchableOpacity
              style={[styles.toggleButton, { backgroundColor: isTeamPoll ? colors.primary : colors.border }]}
              onPress={() => setIsTeamPoll(!isTeamPoll)}
            >
              <View style={[styles.toggleCircle, { 
                backgroundColor: 'white',
                transform: [{ translateX: isTeamPoll ? 20 : 0 }]
              }]} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.teamPollDescription, { color: colors.textSecondary }]}>
            Team polls cost CHZ to vote on and are marked with a blue checkmark
          </Text>
        </View>

        {isTeamPoll && (
          <View style={styles.tokenSection}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>CHZ Cost per Vote</Text>
            <View style={styles.tokenSelector}>
              {[1, 3, 5, 10, 15].map((token) => (
                <TouchableOpacity
                  key={token}
                  style={[
                    styles.tokenOption,
                    { 
                      backgroundColor: pollTokens === token ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => setPollTokens(token)}
                >
                  <Ionicons name="diamond" size={16} color={pollTokens === token ? 'white' : colors.tokenGold} />
                  <Text style={[
                    styles.tokenOptionText,
                    { color: pollTokens === token ? 'white' : colors.text }
                  ]}>
                    {token}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.tokenInfo, { color: colors.textSecondary }]}>
              Your balance: {userProfile?.balanceCHZ || 0} CHZ
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create</Text>
        <TouchableOpacity 
          style={[styles.publishButton, { backgroundColor: colors.primary }]}
          onPress={handlePublish}
          disabled={publishing}
        >
          <Text style={styles.publishButtonText}>
            {publishing ? 'Publishing...' : 'Publish'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              { backgroundColor: postType === 'post' ? colors.primary : colors.surface }
            ]}
            onPress={() => setPostType('post')}
          >
            <Ionicons 
              name="chatbubble-outline" 
              size={20} 
              color={postType === 'post' ? 'white' : colors.textSecondary} 
            />
            <Text style={[
              styles.typeButtonText,
              { color: postType === 'post' ? 'white' : colors.textSecondary }
            ]}>
              Post
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              { backgroundColor: postType === 'poll' ? colors.primary : colors.surface }
            ]}
            onPress={() => setPostType('poll')}
          >
            <Ionicons 
              name="bar-chart-outline" 
              size={20} 
              color={postType === 'poll' ? 'white' : colors.textSecondary} 
            />
            <Text style={[
              styles.typeButtonText,
              { color: postType === 'poll' ? 'white' : colors.textSecondary }
            ]}>
              Poll
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        {postType === 'post' ? renderPostForm() : renderPollForm()}
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
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    marginTop: 16,
    gap: 8,
  },
  addImageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pollQuestionInput: {
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
  teamPollSection: {
    marginBottom: 16,
  },
  teamPollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButton: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  teamPollDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tokenSection: {
    marginTop: 16,
  },
  tokenSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tokenOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  tokenOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tokenInfo: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default CreatePostScreen; 