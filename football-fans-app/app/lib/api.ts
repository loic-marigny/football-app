// API service for FanZone backend communication

// Base URL for your Firebase Functions
const BASE_URL = 'https://us-central1-footballconnect-d810b.cloudfunctions.net/api';

// Types for API responses
export interface Post {
  id: string;
  uid: string;
  content: string;
  createdAt: any;
  likes?: string[];
  reposts?: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  voters: string[];
  createdAt: any;
  createdBy: string;
  premium: boolean;
  tokenCost: number;
}

export interface PollResult {
  title: string;
  options: string[];
  totalVotes: number;
  votes: Record<string, number>;
  percentages: Record<string, string>;
  createdAt: any;
  endsAt?: any;
}

// API Functions
class FanZoneAPI {
  // Posts API
  async createPost(uid: string, content: string): Promise<{ message: string; id: string }> {
    const response = await fetch(`${BASE_URL}/createPost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getRecentPosts(): Promise<Post[]> {
    const response = await fetch(`${BASE_URL}/getRecentPosts`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async likePost(postId: string, uid: string): Promise<{ message: string; likeCount: number }> {
    const response = await fetch(`${BASE_URL}/likePost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId, uid }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async repostPost(postId: string, uid: string): Promise<{ message: string; repostCount: number }> {
    const response = await fetch(`${BASE_URL}/repostPost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId, uid }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Polls API
  async createPoll(
    question: string,
    options: string[],
    createdBy: string,
    premium: boolean = false,
    tokenCost: number = 0
  ): Promise<{ message: string; id: string }> {
    const response = await fetch(`${BASE_URL}/createPoll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, options, createdBy, premium, tokenCost }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async vote(pollId: string, selectedOptionIndex: number, uid: string): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pollId, selectedOptionIndex, uid }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getPollResults(pollId: string): Promise<PollResult> {
    const response = await fetch(`${BASE_URL}/getPollResults?pollId=${pollId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Team Registration
  async registerTeam(uid: string, name: string, email: string): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/registerTeam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, name, email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Trending Analysis
  async analyzeTrending(): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/analyzeTrending`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const fanZoneAPI = new FanZoneAPI();

// Export individual functions for easier use
export const {
  createPost,
  getRecentPosts,
  likePost,
  repostPost,
  createPoll,
  vote,
  getPollResults,
  registerTeam,
  analyzeTrending,
} = fanZoneAPI; 