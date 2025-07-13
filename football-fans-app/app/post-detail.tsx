import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
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

interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isTeam?: boolean;
  };
  likes: number;
  createdAt: Date;
  isLiked: boolean;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isTeam?: boolean;
  };
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  isLiked: boolean;
  isHighlight?: boolean;
}

const PostDetailScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const { user, userProfile } = useAuth();
  const params = useLocalSearchParams();
  
  const [commentText, setCommentText] = useState('');
  const [post, setPost] = useState<Post>({
    id: '1',
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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isLiked: false,
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      text: 'Absolutely incredible match! The atmosphere was electric! 🔥',
      author: {
        id: 'user1',
        name: 'MatchGoer',
        username: 'match_goer',
        avatar: 'https://via.placeholder.com/32',
      },
      likes: 15,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      isLiked: false,
    },
    {
      id: '2',
      text: 'That goal was pure class! What a finish! ⚽',
      author: {
        id: 'user2',
        name: 'GoalHunter',
        username: 'goal_hunter',
        avatar: 'https://via.placeholder.com/32',
      },
      likes: 8,
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      isLiked: false,
    },
    {
      id: '3',
      text: 'The team really showed character today. Proud of them! 💪',
      author: {
        id: 'user3',
        name: 'TeamSupporter',
        username: 'team_supporter',
        avatar: 'https://via.placeholder.com/32',
      },
      likes: 12,
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      isLiked: false,
    },
  ]);

  const handleLikePost = useCallback(() => {
    setPost(prev => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));
  }, []);

  const handleLikeComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          }
        : comment
    ));
  }, []);

  const handleAddComment = useCallback(() => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText.trim(),
      author: {
        id: user?.uid || 'user',
        name: userProfile?.displayName || 'User',
        username: userProfile?.username || 'user',
        avatar: userProfile?.photoURL || 'https://via.placeholder.com/32',
        isTeam: userProfile?.isTeam,
      },
      likes: 0,
      createdAt: new Date(),
      isLiked: false,
    };

    setComments(prev => [newComment, ...prev]);
    setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
    setCommentText('');
  }, [commentText, user, userProfile]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const renderComment = useCallback(({ item: comment }: { item: Comment }) => (
    <View style={[styles.commentItem, { backgroundColor: colors.surface }]}>
      <Image source={{ uri: comment.author.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <View style={styles.commentAuthorRow}>
            <Text style={[styles.commentAuthorName, { color: colors.text }]}>
              {comment.author.name}
            </Text>
            {comment.author.isTeam && (
              <Ionicons name="checkmark-circle" size={14} color="white" style={styles.teamBadge} />
            )}
          </View>
          <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
            {formatTimeAgo(comment.createdAt)}
          </Text>
        </View>
        <Text style={[styles.commentText, { color: colors.text }]}>
          {comment.text}
        </Text>
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.commentAction}
            onPress={() => handleLikeComment(comment.id)}
          >
            <Ionicons 
              name={comment.isLiked ? "heart" : "heart-outline"} 
              size={16} 
              color={comment.isLiked ? colors.error : colors.textSecondary} 
            />
            <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
              {comment.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [colors, handleLikeComment]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post Content */}
        <View style={[styles.postCard, { backgroundColor: colors.card }]}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <Image source={{ uri: post.creator.avatar }} style={styles.postAvatar} />
            <View style={styles.postHeaderInfo}>
              <View style={styles.creatorNameRow}>
                <Text style={[styles.postCreatorName, { color: colors.text }]}>
                  {post.creator.name}
                </Text>
                {post.creator.isTeam && (
                  <Ionicons name="checkmark-circle" size={16} color="white" style={styles.teamBadge} />
                )}
              </View>
              <Text style={[styles.postUsername, { color: colors.textSecondary }]}>
                @{post.creator.username}
              </Text>
              <Text style={[styles.postTime, { color: colors.textSecondary }]}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
            {post.isHighlight && (
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
            {post.content}
          </Text>

          {/* Post Image */}
          {post.image && (
            <Image source={{ uri: post.image }} style={styles.postImage} />
          )}

          {/* Post Actions */}
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.postAction} onPress={handleLikePost}>
              <Ionicons 
                name={post.isLiked ? "heart" : "heart-outline"} 
                size={20} 
                color={post.isLiked ? colors.error : colors.textSecondary} 
              />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>
                {post.likes.toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>
                {post.comments.toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>
                {post.shares.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={[styles.commentsTitle, { color: colors.text }]}>
            Comments ({post.comments})
          </Text>
          
          {comments.map(comment => renderComment({ item: comment }))}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={[styles.commentInputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Image source={{ uri: userProfile?.photoURL || 'https://via.placeholder.com/32' }} style={styles.inputAvatar} />
        <TextInput
          style={[styles.commentInput, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textSecondary}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: commentText.trim() ? colors.primary : colors.border }]}
          onPress={handleAddComment}
          disabled={!commentText.trim()}
        >
          <Ionicons name="send" size={20} color={commentText.trim() ? 'white' : colors.textSecondary} />
        </TouchableOpacity>
      </View>
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
  shareButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  postCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  creatorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postCreatorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  teamBadge: {
    marginLeft: 4,
  },
  postUsername: {
    fontSize: 14,
    marginTop: 2,
  },
  postTime: {
    fontSize: 12,
    marginTop: 2,
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
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
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
  commentsSection: {
    paddingHorizontal: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentAuthorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default PostDetailScreen; 