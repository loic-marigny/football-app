// Authentication service for FanZone
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { auth, db } from './firebase';

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  birthDate?: string;
  favoritesTeams: string[];
  follows: string[];
  followers: string[];
  notificationsEnabled: boolean;
  isAdmin: boolean;
  isTeam: boolean;
  theme: 'light' | 'dark';
  language: string;
  balanceCHZ: number;
  posts?: Array<{
    id: string;
    image: string;
    likes: number;
    comments: number;
  }>;
  createdAt: any;
  updatedAt: any;
  lastLoginAt: any;
}

class AuthService {
  // Check if username is available
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }
  }

  // Register new user
  async register(email: string, password: string, displayName: string, username: string): Promise<User> {
    try {
      // Validate username format
      if (!username || username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
      }

      // Check if username is available
      const isAvailable = await this.isUsernameAvailable(username);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName });

      // Create user profile in Firestore (this will trigger the backend function)
      const userProfile: Partial<UserProfile> = {
        uid: user.uid,
        email: user.email || '',
        displayName,
        username: username.toLowerCase(),
        photoURL: user.photoURL || '',
        bio: '',
        location: '',
        favoritesTeams: [],
        follows: [],
        followers: [],
        notificationsEnabled: true,
        isAdmin: false,
        isTeam: false,
        theme: 'light',
        language: 'en',
        balanceCHZ: 50, // Initial balance
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login time
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: serverTimestamp(),
      });

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        console.log('No user profile found');
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Follow/Unfollow user
  async toggleFollow(currentUserId: string, targetUserId: string): Promise<void> {
    try {
      const currentUserRef = doc(db, 'users', currentUserId);
      const targetUserRef = doc(db, 'users', targetUserId);

      const currentUserDoc = await getDoc(currentUserRef);
      const targetUserDoc = await getDoc(targetUserRef);

      if (!currentUserDoc.exists() || !targetUserDoc.exists()) {
        throw new Error('User not found');
      }

      const currentUserData = currentUserDoc.data() as UserProfile;
      const targetUserData = targetUserDoc.data() as UserProfile;

      const isFollowing = currentUserData.follows.includes(targetUserId);

      if (isFollowing) {
        // Unfollow
        await updateDoc(currentUserRef, {
          follows: currentUserData.follows.filter(id => id !== targetUserId),
          updatedAt: serverTimestamp(),
        });

        await updateDoc(targetUserRef, {
          followers: targetUserData.followers.filter(id => id !== currentUserId),
          updatedAt: serverTimestamp(),
        });
      } else {
        // Follow
        await updateDoc(currentUserRef, {
          follows: [...currentUserData.follows, targetUserId],
          updatedAt: serverTimestamp(),
        });

        await updateDoc(targetUserRef, {
          followers: [...targetUserData.followers, currentUserId],
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw error;
    }
  }

  // Update CHZ balance
  async updateCHZBalance(uid: string, amount: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data() as UserProfile;
      const newBalance = userData.balanceCHZ + amount;

      if (newBalance < 0) {
        throw new Error('Insufficient balance');
      }

      await updateDoc(userRef, {
        balanceCHZ: newBalance,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating CHZ balance:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export individual functions for easier use
export const {
  register,
  login,
  logout,
  getCurrentUser,
  onAuthStateChange,
  getUserProfile,
  updateUserProfile,
  toggleFollow,
  updateCHZBalance,
} = authService; 