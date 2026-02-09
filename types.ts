export type ScreenName =
  | 'Onboarding'
  | 'Home'
  | 'Details'
  | 'Cart'
  | 'TrackOrder'
  | 'Wallet'
  | 'Rewards'
  | 'History'
  | 'Invite'
  | 'StoreLocator'
  | 'ReviewOrder'
  | 'AdminDashboard'
  | 'AdminQueue'
  | 'AdminInventory'
  | 'AdminStaff'
  | 'AdminCampaign'
  | 'AdminFeedback'
  | 'AdminNotification';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  isPopular?: boolean;
}

export interface Order {
  id: string;
  items: string[];
  total: number;
  status: 'Completed' | 'Pending' | 'Preparing' | 'Ready' | 'Canceled';
  date: string;
  customerName?: string;
  time?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive' | 'On Shift';
  image: string;
  shift: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  percentage: number;
  status: 'Healthy' | 'Low' | 'Critical';
  image: string;
}

// Store Locator
export interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  closingTime: string;
  busyLevel: 'Low' | 'Medium' | 'High';
  image: string;
  hasDriveThru?: boolean;
  hasMobileOrder?: boolean;
}

// Order Queue (Admin)
export interface OrderQueueItem {
  id: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; quantity: number }[];
  customizations: string[];
  status: 'Critical' | 'Brewing' | 'New' | 'Ready';
  timer: string;
  image: string;
}

// Customer Feedback
export interface CustomerReview {
  id: string;
  customerName: string;
  avatar: string;
  rating: number;
  reviewText: string;
  product: string;
  timeAgo: string;
  isReplied: boolean;
  replyText?: string;
}

// Shopping Cart
export interface CartItem {
  product: Product;
  quantity: number;
  size: 'S' | 'M' | 'L';
  customizations: string[];
}

// Analytics
export interface AnalyticsData {
  totalOrders: number;
  orderChange: number;
  revenue: number;
  revenueChange: number;
  activeMembers: number;
  memberChange: number;
  peakHour: string;
  topSellers: { name: string; count: number; percentage: number }[];
  loyaltyLeaders: { name: string; points: number; lastVisit: string; avatar: string }[];
}

// Rewards
export interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  image: string;
  description: string;
}

// Campaign
export interface Campaign {
  id: string;
  name: string;
  offerType: 'percent' | 'fixed' | 'bogo';
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  status: 'Draft' | 'Active' | 'Ended';
}

// Notifications
export type NotificationAudience = 'all' | 'loyal' | 'inactive' | 'new';

export interface NotificationHistoryItem {
  id: string;
  title: string;
  message: string;
  audience: NotificationAudience;
  delivery: 'now' | 'scheduled';
  status: 'Draft' | 'Scheduled' | 'Sent';
  targetCount: number;
  scheduledFor?: string;
  createdAt: string;
}

// Admin Queue Actions
export type QueueAction = 'start-brewing' | 'mark-ready' | 'complete-order' | 'cancel-order';

// Staff Performance
export interface StaffPerformance extends Staff {
  ordersCompleted: number;
  rating: number;
  avgPrepTime: string;
  salesGenerated: number;
}
