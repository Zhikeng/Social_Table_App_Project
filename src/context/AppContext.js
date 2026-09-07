import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  currentUser,
  feedPosts as initialFeedPosts,
  initialBookings,
  restaurants,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [posts, setPosts] = useState(initialFeedPosts);
  const [bookings, setBookings] = useState(initialBookings);
  const [savedSpots, setSavedSpots] = useState(currentUser.savedSpots);

  const login = (email) => {
    setUser({ ...currentUser, username: email ? `@${email.split('@')[0]}` : currentUser.username });
    setIsAuthenticated(true);
  };

  const logout = () => setIsAuthenticated(false);

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const addComment = (postId, text) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: `c${Date.now()}`, userId: user.id, text },
              ],
            }
          : p
      )
    );
  };

  const addPost = (post) => {
    setPosts((prev) => [
      {
        id: `p${Date.now()}`,
        userId: user.id,
        likes: 0,
        liked: false,
        comments: [],
        timestamp: 'Just now',
        ...post,
      },
      ...prev,
    ]);
  };

  const addBooking = (booking) => {
    setBookings((prev) => [
      { id: `b${Date.now()}`, status: 'upcoming', ...booking },
      ...prev,
    ]);
  };

  const cancelBooking = (bookingId) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const toggleSaved = (restaurantId) => {
    setSavedSpots((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      user,
      posts,
      toggleLike,
      addComment,
      addPost,
      bookings,
      addBooking,
      cancelBooking,
      savedSpots,
      toggleSaved,
      restaurants,
    }),
    [isAuthenticated, user, posts, bookings, savedSpots]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
