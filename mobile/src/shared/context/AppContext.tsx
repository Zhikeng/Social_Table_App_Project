import React, { createContext, useContext, useMemo, useState } from 'react';
import { currentUser, feedPosts as initialFeedPosts, initialBookings, restaurants } from '../data/mockData';
import type { Booking, FeedPost, User } from '../models/types';

type NewPost = Pick<FeedPost, 'restaurantId' | 'image' | 'caption' | 'rating'>;
type AppContextValue = {
  isAuthenticated: boolean;
  login: (email?: string) => void;
  logout: () => void;
  user: User;
  updateUser: (updates: Partial<User>) => void;
  posts: FeedPost[];
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addPost: (post: NewPost) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  cancelBooking: (bookingId: string) => void;
  savedSpots: string[];
  toggleSaved: (restaurantId: string) => void;
  restaurants: typeof restaurants;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: React.PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(currentUser);
  const [posts, setPosts] = useState(initialFeedPosts);
  const [bookings, setBookings] = useState(initialBookings);
  const [savedSpots, setSavedSpots] = useState(currentUser.savedSpots ?? []);

  const login = (email?: string) => {
    setUser({ ...currentUser, username: email ? `@${email.split('@')[0]}` : currentUser.username });
    setIsAuthenticated(true);
  };
  const logout = () => setIsAuthenticated(false);
  const updateUser = (updates: Partial<User>) => setUser((previous) => ({ ...previous, ...updates }));

  const value = useMemo<AppContextValue>(() => ({
    isAuthenticated,
    login,
    logout,
    user,
    updateUser,
    posts,
    toggleLike: (postId) => setPosts((previous) => previous.map((post) =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post)),
    addComment: (postId, text) => setPosts((previous) => previous.map((post) =>
      post.id === postId
        ? { ...post, comments: [...post.comments, { id: `c${Date.now()}`, userId: user.id, text }] }
        : post)),
    addPost: (post) => setPosts((previous) => [{
      ...post, id: `p${Date.now()}`, userId: user.id, likes: 0, liked: false,
      comments: [], timestamp: 'Just now',
    }, ...previous]),
    bookings,
    addBooking: (booking) => setBookings((previous) => [{ ...booking, id: `b${Date.now()}`, status: 'upcoming' }, ...previous]),
    cancelBooking: (bookingId) => setBookings((previous) => previous.filter((booking) => booking.id !== bookingId)),
    savedSpots,
    toggleSaved: (restaurantId) => setSavedSpots((previous) => previous.includes(restaurantId)
      ? previous.filter((id) => id !== restaurantId)
      : [...previous, restaurantId]),
    restaurants,
  }), [isAuthenticated, user, posts, bookings, savedSpots]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
