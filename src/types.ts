import { Timestamp } from "firebase/firestore";

export interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  authorUid: string;
  authorName: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  isPublished: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin';
}

export type Category = 'রাজনীতি' | 'খেলাধুলা' | 'বিনোদন' | 'সারাদেশ' | 'আন্তর্জাতিক' | 'প্রযুক্তি';
export const CATEGORIES: Category[] = ['রাজনীতি', 'খেলাধুলা', 'বিনোদন', 'সারাদেশ', 'আন্তর্জাতিক', 'প্রযুক্তি'];
