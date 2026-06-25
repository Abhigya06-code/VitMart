export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  block?: string;
  show_phone: boolean;
  role: "user" | "admin";
}

export interface Product {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  condition: "New" | "Like New" | "Good" | "Fair";
  negotiable: boolean;
  status: "Available" | "Sold";
  views: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  product_id: number;
  buyer_id: number;
  seller_id: number;
}

export interface Favourite {
  user_id: number;
  product_id: number;
}