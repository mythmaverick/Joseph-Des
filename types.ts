export enum UserRole {
  GUEST = 'GUEST',
  BUYER = 'BUYER',
  SELLER = 'SELLER'
}

export enum University {
  UNILAG = 'University of Lagos',
  ABU = 'Ahmadu Bello University',
  UI = 'University of Ibadan',
  UNN = 'University of Nigeria, Nsukka',
  OAU = 'Obafemi Awolowo University',
  CU = 'Covenant University',
  OTHER = 'Other'
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  university: University;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  timestamp: number;
}

export interface Message {
  id: string;
  sender: 'me' | 'other' | 'system';
  text: string;
  timestamp: number;
  isSafetyAlert?: boolean;
}

export interface ChatSession {
  id: string;
  productId: string;
  productTitle: string;
  otherPartyName: string;
  messages: Message[];
  safetyScore: number; // 0 to 100
}
