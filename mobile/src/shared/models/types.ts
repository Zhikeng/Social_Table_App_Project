export type Identifier = string;

export type User = {
  id: Identifier;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  followers?: number;
  following?: number;
  savedSpots?: string[];
};

export type Restaurant = {
  id: Identifier;
  name: string;
  cuisine: string;
  priceLevel: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  image: string;
  address: string;
  description: string;
  tags: string[];
  availableSlots: string[];
  menuHighlights: { id: string; name: string; price: string }[];
};

export type Comment = { id: Identifier; userId: Identifier; text: string };

export type FeedPost = {
  id: Identifier;
  userId: Identifier;
  restaurantId: Identifier;
  image: string;
  caption: string;
  rating: number;
  likes: number;
  liked: boolean;
  comments: Comment[];
  timestamp: string;
};

export type Booking = {
  id: Identifier;
  restaurantId: Identifier;
  date: string;
  time: string;
  partySize: number;
  status: 'upcoming' | 'past';
  note?: string;
};
