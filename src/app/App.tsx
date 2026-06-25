import React, { useState, useRef } from "react";
import {
  Search, Heart, Bell, Menu, X, Eye, MessageCircle, Share2, Flag, Plus, Check,
  ArrowRight, ShoppingBag, Users, TrendingUp, Shield, ShieldCheck, Tag, Filter,
  Bookmark, User, Settings, LogOut, Edit, Trash2, Send, CheckCheck, Upload,
  AlertTriangle, ChevronLeft, ChevronRight, Store, Award, Zap, Clock, Activity,
  AlertCircle, Ban, UserCheck, LayoutDashboard, Home, MessageSquare, BarChart2,
  Moon, Sun, Phone, Mail, Lock, EyeOff, MoreVertical, Camera, Star, MapPin,
  Grid3X3, RefreshCw, Package, DollarSign, ChevronDown, SlidersHorizontal,
  Bike, BookOpen, Cpu, Sofa, Shirt, Dumbbell, Pencil, Image as ImageIcon,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Utils ────────────────────────────────────────────────────────────────────
function cn(...cls: (string | undefined | null | false)[]) {
  return cls.filter(Boolean).join(" ");
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "landing" | "marketplace" | "product" | "sell" | "auth" | "profile" | "favourites" | "chat" | "admin";
type AuthMode = "login" | "register" | "otp" | "forgot";
type Condition = "New" | "Like New" | "Good" | "Fair" | "Poor";

interface Product {
  id: number;
  title: string;
  price: number;
  condition: Condition;
  category: string;
  image: string;
  images: string[];
  seller: string;
  sellerId: number;
  sellerAvatar: string;
  views: number;
  negotiable: boolean;
  description: string;
  hostel: string;
  posted: string;
  sold: boolean;
  verified: boolean;
  favourited: boolean;
}

interface Review {
  id: number;
  reviewer: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  transaction: string;
}

interface ChatMsg {
  id: number;
  text: string;
  sent: boolean;
  time: string;
  read: boolean;
}
interface Convo {
  id: number;
  user: string;
  avatar: string;
  verified: boolean;
  productTitle: string;
  productImage: string;
  productPrice: number;
  lastMessage: string;
  time: string;
  unread: number;
  messages: ChatMsg[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Books & Notes",    emoji: "📚", icon: BookOpen, count: 234 },
  { name: "Electronics",      emoji: "💻", icon: Cpu,      count: 187 },
  { name: "Hostel Essentials",emoji: "🏠", icon: Home,     count: 156 },
  { name: "Cycles & Bikes",   emoji: "🚲", icon: Bike,     count: 89  },
  { name: "Stationery",       emoji: "✏️", icon: Pencil,   count: 134 },
  { name: "Clothing",         emoji: "👕", icon: Shirt,    count: 98  },
  { name: "Sports & Fitness", emoji: "⚽", icon: Dumbbell, count: 67  },
  { name: "Furniture",        emoji: "🪑", icon: Sofa,     count: 45  },
];

// Seller rating/review data keyed by sellerId
const SELLER_INFO: Record<number, { rating: number; reviews: number; transactions: number; verified: boolean }> = {
  1:  { rating: 4.8, reviews: 23, transactions: 15, verified: true  },
  2:  { rating: 4.9, reviews: 56, transactions: 34, verified: true  },
  3:  { rating: 4.2, reviews: 8,  transactions: 6,  verified: false },
  4:  { rating: 4.7, reviews: 19, transactions: 12, verified: true  },
  5:  { rating: 5.0, reviews: 41, transactions: 28, verified: true  },
  6:  { rating: 3.8, reviews: 5,  transactions: 3,  verified: false },
  7:  { rating: 4.6, reviews: 31, transactions: 22, verified: true  },
  8:  { rating: 4.3, reviews: 12, transactions: 9,  verified: false },
  9:  { rating: 4.5, reviews: 17, transactions: 11, verified: false },
  10: { rating: 4.9, reviews: 28, transactions: 20, verified: true  },
  11: { rating: 4.1, reviews: 7,  transactions: 5,  verified: false },
  12: { rating: 4.4, reviews: 14, transactions: 8,  verified: false },
};

const INIT_PRODUCTS: Product[] = [
  {
    id: 1, title: "Casio FX-991ES Plus Scientific Calculator",
    price: 350, condition: "Good", category: "Electronics",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop&auto=format",
    ],
    seller: "Arjun Mehta", sellerId: 1,
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    views: 124, negotiable: true, hostel: "Himalaya Block A", posted: "2 hours ago",
    sold: false, verified: true, favourited: false,
    description: "Used for 2 semesters only. Works perfectly. No scratches on screen. Comes with cover case and original box. Perfect for engineering students taking maths and physics.",
  },
  {
    id: 2, title: "Engineering Mathematics — R.K. Jain (3rd Sem)",
    price: 120, condition: "Like New", category: "Books & Notes",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&auto=format"],
    seller: "Priya Sharma", sellerId: 2,
    sellerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b9c0e8bf?w=100&h=100&fit=crop",
    views: 87, negotiable: false, hostel: "Ganga Block C", posted: "5 hours ago",
    sold: false, verified: true, favourited: true,
    description: "Completed my 3rd semester. No highlights or markings inside. Very clean. Includes a few handwritten notes at the back. Useful for M3 and M4 papers.",
  },
  {
    id: 3, title: "Hero Sprint 26T Mountain Cycle",
    price: 3200, condition: "Good", category: "Cycles & Bikes",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop&auto=format"],
    seller: "Rahul Verma", sellerId: 3,
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    views: 256, negotiable: true, hostel: "Cauvery Block B", posted: "1 day ago",
    sold: false, verified: false, favourited: false,
    description: "Using for 1 year. Chain recently serviced. Brakes work perfectly. Tires in good condition. Minor scratches on frame. Selling because I am graduating this semester.",
  },
  {
    id: 4, title: "Dell Inspiron 15 3000 — Core i5, 8GB RAM, 512GB SSD",
    price: 28000, condition: "Like New", category: "Electronics",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&auto=format"],
    seller: "Vikram Singh", sellerId: 4,
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    views: 512, negotiable: true, hostel: "Krishna Block D", posted: "2 days ago",
    sold: false, verified: true, favourited: true,
    description: "Barely used. Bought last year with Windows 11 + MS Office. Battery life 4–5 hrs. Upgraded to MacBook. Comes with original charger, bag, and all box accessories.",
  },
  {
    id: 5, title: "Sony WH-1000XM4 Noise Cancelling Headphones",
    price: 8500, condition: "Like New", category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&auto=format"],
    seller: "Anika Patel", sellerId: 5,
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    views: 341, negotiable: false, hostel: "Saraswathi Block F", posted: "3 days ago",
    sold: false, verified: true, favourited: false,
    description: "6 months old. Perfect condition. All accessories included. ANC works great for studying in noisy hostel environments. Original box and warranty card available.",
  },
  {
    id: 6, title: "Ninja Shark 40L Hiking Backpack",
    price: 600, condition: "Good", category: "Hostel Essentials",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&auto=format"],
    seller: "Karan Nair", sellerId: 6,
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    views: 45, negotiable: true, hostel: "Yamuna Block E", posted: "4 days ago",
    sold: false, verified: false, favourited: false,
    description: "Good quality backpack. Waterproof material. Multiple compartments. Used for 1 year campus commuting. Zippers all work fine. Great for trekking trips too.",
  },
  {
    id: 7, title: "OnePlus Nord CE3 Lite 5G — 8GB RAM, 128GB",
    price: 14500, condition: "Like New", category: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&auto=format"],
    seller: "Deepa Krishnan", sellerId: 7,
    sellerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b9c0e8bf?w=100&h=100&fit=crop",
    views: 389, negotiable: true, hostel: "Ganga Block A", posted: "5 days ago",
    sold: false, verified: true, favourited: false,
    description: "8 months old. 108MP camera. Always had screen protector and cover. Battery health 94%. AMOLED display, 67W SuperVOOC charger included. Switching to iPhone.",
  },
  {
    id: 8, title: "DSA Made Easy — Narasimha Karumanchi (Latest Ed.)",
    price: 200, condition: "Good", category: "Books & Notes",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop&auto=format"],
    seller: "Rohit Kumar", sellerId: 8,
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    views: 167, negotiable: false, hostel: "Himalaya Block C", posted: "6 days ago",
    sold: true, verified: false, favourited: false,
    description: "Some pencil markings on key topics. Very useful for placements. Covers arrays, trees, graphs, DP comprehensively.",
  },
  {
    id: 9, title: "Usha Mist Air Eco 400mm Table Fan",
    price: 450, condition: "Good", category: "Hostel Essentials",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format"],
    seller: "Sneha Iyer", sellerId: 9,
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    views: 92, negotiable: true, hostel: "Ganga Block B", posted: "1 week ago",
    sold: false, verified: false, favourited: false,
    description: "Works perfectly. 3 speed settings. Quiet operation. Great for hostel summers. Selling because I got an AC room in 3rd year.",
  },
  {
    id: 10, title: "Zebronics Wireless Mouse + Keyboard Combo",
    price: 750, condition: "Like New", category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop&auto=format"],
    seller: "Aditya Rajan", sellerId: 10,
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    views: 73, negotiable: false, hostel: "Krishna Block A", posted: "1 week ago",
    sold: false, verified: true, favourited: false,
    description: "Combo set barely used. Single USB dongle for both. 1000 DPI mouse, membrane keyboard. Works on Windows and Mac.",
  },
  {
    id: 11, title: "Puma Running Shoes — Size 9 (EU 43)",
    price: 1200, condition: "Good", category: "Clothing",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&auto=format"],
    seller: "Manish Gupta", sellerId: 11,
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    views: 58, negotiable: true, hostel: "Cauvery Block A", posted: "2 weeks ago",
    sold: false, verified: false, favourited: false,
    description: "Worn about 10 times. Soles in perfect shape. Great for morning runs on the VIT track.",
  },
  {
    id: 12, title: "Decathlon 20kg Adjustable Dumbbell Set",
    price: 2800, condition: "Good", category: "Sports & Fitness",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&auto=format"],
    seller: "Sanjay Reddy", sellerId: 12,
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    views: 134, negotiable: true, hostel: "Himalaya Block B", posted: "2 weeks ago",
    sold: false, verified: false, favourited: false,
    description: "Complete set, 20kg total. All plates and bar included. Minor rust on edges but fully functional.",
  },
];

const REVIEWS: Review[] = [
  { id: 1, reviewer: "Rohit Kumar",   avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", rating: 5, comment: "Excellent condition, exactly as described. Quick handover at hostel gate. 10/10 seller!", date: "Jun 18, 2025", transaction: "Casio FX-991ES Calculator" },
  { id: 2, reviewer: "Sneha Iyer",    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", rating: 5, comment: "Super fast response, item was in perfect condition. Will definitely buy from again!", date: "Jun 12, 2025", transaction: "Engineering Mathematics Book" },
  { id: 3, reviewer: "Karan Nair",    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", rating: 4, comment: "Good seller. Item condition was as stated. Minor delay in response but overall great experience.", date: "May 28, 2025", transaction: "Dell Inspiron Laptop" },
  { id: 4, reviewer: "Aditya Rajan",  avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", rating: 5, comment: "Very honest and trustworthy. Price was fair. Campus pickup was smooth.", date: "May 15, 2025", transaction: "Sony WH-1000XM4 Headphones" },
];

const CONVOS: Convo[] = [
  {
    id: 1, user: "Arjun Mehta", verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    productTitle: "Casio FX-991ES Scientific Calculator",
    productImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=80&h=60&fit=crop&auto=format",
    productPrice: 350, lastMessage: "Okay deal! When can I pick it up?", time: "10:42 AM", unread: 2,
    messages: [
      { id: 1, text: "Hey, is the calculator still available?", sent: false, time: "10:30 AM", read: true },
      { id: 2, text: "Yes it is! Are you interested?", sent: true, time: "10:35 AM", read: true },
      { id: 3, text: "Can you do ₹300?", sent: false, time: "10:40 AM", read: true },
      { id: 4, text: "Lowest I can do is ₹320. It's in great condition honestly.", sent: true, time: "10:41 AM", read: true },
      { id: 5, text: "Okay deal! When can I pick it up?", sent: false, time: "10:42 AM", read: false },
    ],
  },
  {
    id: 2, user: "Priya Sharma", verified: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9c0e8bf?w=100&h=100&fit=crop",
    productTitle: "Engineering Mathematics Textbook",
    productImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=60&fit=crop&auto=format",
    productPrice: 120, lastMessage: "Thanks for the book! Really helpful.", time: "Yesterday", unread: 0,
    messages: [
      { id: 1, text: "Hi! Is the Maths book still available?", sent: false, time: "Yesterday 2:00 PM", read: true },
      { id: 2, text: "Yes! Come pick it up from Ganga Block.", sent: true, time: "Yesterday 2:15 PM", read: true },
      { id: 3, text: "Okay, coming in 30 mins.", sent: false, time: "Yesterday 2:16 PM", read: true },
      { id: 4, text: "Thanks for the book! Really helpful.", sent: false, time: "Yesterday 3:10 PM", read: true },
    ],
  },
  {
    id: 3, user: "Rahul Verma", verified: false,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    productTitle: "Hero Sprint Mountain Cycle",
    productImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=80&h=60&fit=crop&auto=format",
    productPrice: 3200, lastMessage: "Can you bring it to the main gate?", time: "Monday", unread: 1,
    messages: [
      { id: 1, text: "Interested in the cycle. Can I see it?", sent: false, time: "Monday 11:00 AM", read: true },
      { id: 2, text: "Sure! Come to Cauvery Block B after 5 PM.", sent: true, time: "Monday 11:30 AM", read: true },
      { id: 3, text: "Can you bring it to the main gate?", sent: false, time: "Monday 4:45 PM", read: false },
    ],
  },
];

const ADMIN_CHART = [
  { month: "Jan", listings: 45, sales: 28 },
  { month: "Feb", listings: 67, sales: 41 },
  { month: "Mar", listings: 89, sales: 56 },
  { month: "Apr", listings: 123, sales: 78 },
  { month: "May", listings: 145, sales: 98 },
  { month: "Jun", listings: 167, sales: 112 },
];

const ADMIN_USERS = [
  { id: 1, name: "Arjun Mehta",    email: "arjun.21cse@vit.ac.in",   hostel: "Himalaya A",   listings: 5, status: "Active",    joined: "Jan 2024" },
  { id: 2, name: "Priya Sharma",   email: "priya.22ece@vit.ac.in",   hostel: "Ganga C",      listings: 3, status: "Active",    joined: "Feb 2024" },
  { id: 3, name: "Rahul Verma",    email: "rahul.20it@vit.ac.in",    hostel: "Cauvery B",    listings: 8, status: "Suspended", joined: "Mar 2023" },
  { id: 4, name: "Vikram Singh",   email: "vikram.21mech@vit.ac.in", hostel: "Krishna D",    listings: 2, status: "Active",    joined: "Jun 2024" },
  { id: 5, name: "Anika Patel",    email: "anika.22cse@vit.ac.in",   hostel: "Saraswathi F", listings: 6, status: "Active",    joined: "Aug 2024" },
];

const REPORTED = [
  { id: 1, product: "iPhone 14 Pro Max — 256GB",  seller: "Unknown User",   reason: "Suspected stolen device",    date: "Jun 18, 2025", status: "Pending"      },
  { id: 2, product: "Generic Laptop Charger",      seller: "Fake Seller 01", reason: "Counterfeit product",        date: "Jun 19, 2025", status: "Under Review" },
  { id: 3, product: "CBCS Question Bank PDF",      seller: "SpamBot2024",    reason: "Spam / duplicate listing",   date: "Jun 20, 2025", status: "Resolved"     },
];

// ─── Shared UI Components ─────────────────────────────────────────────────────

function ConditionBadge({ condition }: { condition: Condition }) {
  const map: Record<Condition, string> = {
    New:        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Like New": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Good:       "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Fair:       "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Poor:       "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  };
  return <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", map[condition])}>{condition}</span>;
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", color)}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

// ── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ rating, reviews, size = "sm" }: { rating: number; reviews?: number; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3 h-3";
  const tx = size === "lg" ? "text-base" : size === "md" ? "text-sm" : "text-xs";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn(sz, "shrink-0", s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25")} />
      ))}
      <span className={cn("font-bold text-foreground ml-1", tx)}>{rating.toFixed(1)}</span>
      {reviews !== undefined && <span className={cn("text-muted-foreground ml-0.5", tx)}>({reviews})</span>}
    </div>
  );
}

// ── Verified VIT Student Badge ────────────────────────────────────────────────

function VerifiedBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-full font-semibold whitespace-nowrap",
      size === "md" ? "text-xs px-2.5 py-1 gap-1.5" : "text-xs px-2 py-0.5"
    )}>
      <ShieldCheck className={size === "md" ? "w-3.5 h-3.5 shrink-0" : "w-3 h-3 shrink-0"} />
      Verified VIT Student
    </span>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product, onView, onFavourite,
}: {
  product: Product;
  onView: (p: Product) => void;
  onFavourite: (id: number) => void;
}) {
  const info = SELLER_INFO[product.sellerId];
  return (
    <div
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
      onClick={() => onView(product)}
    >
      <div className="relative overflow-hidden bg-muted">
        <img src={product.image} alt={product.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.sold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-bold text-sm px-4 py-1 rounded-full tracking-wide">SOLD</span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onFavourite(product.id); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <Heart className={cn("w-4 h-4 transition-colors", product.favourited ? "fill-red-500 text-red-500" : "text-gray-400")} />
        </button>
        {product.verified && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-blue-600/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white font-medium">
            <ShieldCheck className="w-3 h-3" /> Verified
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 leading-snug">{product.title}</h3>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
          <ConditionBadge condition={product.condition} />
        </div>
        {product.negotiable && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1.5">✓ Negotiable</p>}
        {info && <div className="mb-2"><StarRating rating={info.rating} reviews={info.reviews} size="sm" /></div>}
        <div className="flex items-center justify-between pt-2.5 border-t border-border">
          <div className="flex items-center gap-1.5 min-w-0">
            <img src={product.sellerAvatar} alt={product.seller} className="w-5 h-5 rounded-full object-cover ring-1 ring-border shrink-0" />
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">{product.seller}</span>
            {info?.verified && <ShieldCheck className="w-3 h-3 text-blue-500 shrink-0" />}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Eye className="w-3 h-3" />{product.views}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({
  page, setPage, isDark, setIsDark, isLoggedIn, onLogout,
}: {
  page: Page;
  setPage: (p: Page) => void;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const navLinks = [
    { label: "Home",     p: "landing"     as Page },
    { label: "Browse",   p: "marketplace" as Page },
    { label: "Saved",    p: "favourites"  as Page },
    { label: "Messages", p: "chat"        as Page },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo — branding only */}
          <div className="flex items-center gap-2 shrink-0 select-none">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground font-poppins">
              VIT<span className="text-primary">Mart</span>
            </span>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 bg-muted rounded-xl text-sm border border-transparent focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                onClick={() => setPage("marketplace")}
                readOnly
              />
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => setPage(l.p)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  page === l.p
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-1.5">
            <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-xl bg-muted hover:bg-accent flex items-center justify-center transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isLoggedIn ? (
              <>
                <button className="relative w-9 h-9 rounded-xl bg-muted hover:bg-accent flex items-center justify-center transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>
                <button onClick={() => setPage("sell")} className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  <Plus className="w-4 h-4" /> Sell Item
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button onClick={() => setDropdown(!dropdown)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-muted transition-colors">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b9c0e8bf?w=100&h=100&fit=crop" alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20" />
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-semibold text-foreground leading-none">Priya</p>
                      <p className="text-xs text-muted-foreground leading-none mt-0.5">Student</p>
                    </div>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", dropdown ? "rotate-180" : "")} />
                  </button>

                  {dropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdown(false)} />
                      <div className="absolute right-0 top-full mt-2 w-60 bg-card rounded-2xl border border-border shadow-2xl z-50 overflow-hidden">
                        <div className="px-4 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-border">
                          <div className="flex items-center gap-3">
                            <img src="https://images.unsplash.com/photo-1494790108755-2616b9c0e8bf?w=100&h=100&fit=crop" alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-foreground">Priya Sharma</p>
                              <p className="text-xs text-muted-foreground truncate">priya.22ece@vit.ac.in</p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-col gap-1">
                            <VerifiedBadge size="sm" />
                            <StarRating rating={4.9} reviews={56} size="sm" />
                          </div>
                        </div>
                        <div className="py-1.5">
                          {[
                            { icon: <User className="w-4 h-4" />,         label: "My Profile",  p: "profile"    as Page },
                            { icon: <Heart className="w-4 h-4" />,        label: "Saved Items", p: "favourites" as Page },
                            { icon: <MessageSquare className="w-4 h-4" />, label: "Messages",   p: "chat"       as Page },
                            { icon: <Package className="w-4 h-4" />,      label: "My Listings", p: "profile"    as Page },
                          ].map((item) => (
                            <button
                              key={item.label}
                              onClick={() => { setPage(item.p); setDropdown(false); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left"
                            >
                              <span className="text-muted-foreground">{item.icon}</span>
                              {item.label}
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-border py-1.5">
                          <button
                            onClick={() => { onLogout(); setDropdown(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setPage("auth")} className="px-4 py-2 text-sm font-semibold text-foreground border border-border rounded-xl hover:bg-muted transition-colors">
                  Log In
                </button>
                <button onClick={() => setPage("auth")} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> Register
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white dark:bg-gray-900 px-4 py-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none" onClick={() => { setPage("marketplace"); setMobileOpen(false); }} readOnly />
          </div>
          <div className="grid grid-cols-4 gap-1">
            {navLinks.map((l) => (
              <button key={l.label} onClick={() => { setPage(l.p); setMobileOpen(false); }} className={cn("flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-colors", page === l.p ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
                {l.label === "Home"     && <Home className="w-4 h-4" />}
                {l.label === "Browse"   && <Store className="w-4 h-4" />}
                {l.label === "Saved"    && <Heart className="w-4 h-4" />}
                {l.label === "Messages" && <MessageSquare className="w-4 h-4" />}
                {l.label}
              </button>
            ))}
          </div>
          {isLoggedIn ? (
            <div className="flex gap-2">
              <button onClick={() => { setPage("sell"); setMobileOpen(false); }} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold">
                <Plus className="w-4 h-4" /> Sell Item
              </button>
              <button onClick={() => { setPage("profile"); setMobileOpen(false); }} className="flex items-center justify-center w-11 bg-muted rounded-xl">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b9c0e8bf?w=100&h=100&fit=crop" alt="" className="w-7 h-7 rounded-full object-cover" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setPage("auth"); setMobileOpen(false); }} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">Log In</button>
              <button onClick={() => { setPage("auth"); setMobileOpen(false); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Register
              </button>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border pt-3 text-sm text-muted-foreground">
            <button onClick={() => setIsDark(!isDark)} className="flex items-center gap-1.5">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? "Light" : "Dark"} Mode
            </button>
            {isLoggedIn && (
              <button onClick={() => { onLogout(); setMobileOpen(false); }} className="flex items-center gap-1.5 text-red-500">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage({
  products, setPage, setSelected, onFav, isLoggedIn,
}: {
  products: Product[];
  setPage: (p: Page) => void;
  setSelected: (p: Product) => void;
  onFav: (id: number) => void;
  isLoggedIn: boolean;
}) {
  const trending = products.filter((p) => !p.sold).slice(0, 4);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
              Exclusively for VIT students
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins leading-tight mb-5">
              Buy and Sell<br /><span className="text-yellow-300">Within Your Campus</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mb-8 leading-relaxed">
              The safest marketplace for VIT students. Trade books, electronics, cycles, and hostel essentials — all verified by your campus community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setPage("marketplace")} className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-6 py-3.5 rounded-xl text-base hover:bg-blue-50 transition-colors shadow-lg">
                <Search className="w-5 h-5" /> Browse Products
              </button>
              {!isLoggedIn ? (
                <button onClick={() => setPage("auth")} className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl text-base hover:bg-white/20 transition-colors">
                  <ShieldCheck className="w-5 h-5" /> Join VITMart Free
                </button>
              ) : (
                <button onClick={() => setPage("sell")} className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl text-base hover:bg-white/20 transition-colors">
                  <Plus className="w-5 h-5" /> List an Item
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-72 space-y-3 opacity-90">
          {products.slice(0, 2).map((p) => {
            const si = SELLER_INFO[p.sellerId];
            return (
              <div key={p.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex gap-3 items-center">
                <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover bg-white/20 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{p.title}</p>
                  <p className="text-blue-200 text-sm font-bold">₹{p.price.toLocaleString()}</p>
                  {si?.verified && <div className="flex items-center gap-1 mt-0.5"><ShieldCheck className="w-3 h-3 text-yellow-300" /><span className="text-xs text-yellow-200">Verified Seller</span></div>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-2 flex gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-muted rounded-xl">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input type="text" placeholder="Search for books, electronics, cycles..." className="flex-1 bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground" onClick={() => setPage("marketplace")} readOnly />
          </div>
          <button onClick={() => setPage("marketplace")} className="bg-primary text-white px-6 py-2 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap">Search</button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div><h2 className="text-2xl font-bold text-foreground font-poppins">Browse Categories</h2><p className="text-muted-foreground text-sm mt-1">Find exactly what you need</p></div>
          <button onClick={() => setPage("marketplace")} className="text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <button key={cat.name} onClick={() => setPage("marketplace")} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md transition-all">
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-foreground text-center leading-tight">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div><h2 className="text-2xl font-bold text-foreground font-poppins">Trending Now</h2><p className="text-muted-foreground text-sm mt-1">Most viewed listings this week</p></div>
          <button onClick={() => setPage("marketplace")} className="text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">See all <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} onView={(prod) => { setSelected(prod); setPage("product"); }} onFavourite={onFav} />
          ))}
        </div>
      </section>

      <section className="bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="w-6 h-6 text-blue-600" />, title: "Verified VIT Students Only", desc: "Every account verified with @vit.ac.in email. No outsiders, no strangers." },
              { icon: <MapPin className="w-6 h-6 text-blue-600" />,      title: "On-Campus Pickup",           desc: "Meet safely inside campus hostels or the main gate — always within your community." },
              { icon: <Star className="w-6 h-6 text-blue-600" />,        title: "Trusted Seller Ratings",     desc: "Rate your experience after every trade and build a trustworthy community." },
            ].map((t) => (
              <div key={t.title} className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center shrink-0">{t.icon}</div>
                <div><h3 className="font-semibold text-foreground mb-1">{t.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-poppins mb-2">VITMart by the Numbers</h2>
            <p className="text-blue-200">Growing every day with your campus community</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "4,200+", label: "Active Students"   },
              { value: "12,500+",label: "Total Listings"    },
              { value: "8,900+", label: "Successful Trades" },
              { value: "₹42L+",  label: "Campus Savings"   },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold font-poppins text-yellow-300">{s.value}</p>
                <p className="text-blue-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><Store className="w-4 h-4 text-white" /></div>
              <span className="font-bold text-white">VIT<span className="text-primary">Mart</span></span>
            </div>
            <p className="text-sm text-center">Built for VIT students, by VIT students. © 2025 VITMart.</p>
            <div className="flex gap-4 text-sm">
              {["Privacy", "Terms", "Help"].map((l) => <button key={l} className="hover:text-white transition-colors">{l}</button>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Marketplace Page ─────────────────────────────────────────────────────────

function MarketplacePage({
  products, setPage, setSelected, onFav,
}: {
  products: Product[];
  setPage: (p: Page) => void;
  setSelected: (p: Product) => void;
  onFav: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = products
    .filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (cat !== "All" && p.category !== cat) return false;
      if (condition !== "All" && p.condition !== condition) return false;
      if (p.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      if (sort === "Oldest") return a.id - b.id;
      return b.id - a.id;
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-poppins text-foreground mb-4">Browse Marketplace</h1>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search products, books, electronics..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={cn("flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition-colors", showFilters ? "bg-primary text-white border-primary" : "bg-card border-border hover:border-primary/40")}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Category</label>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option>All</option>{CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {["All", "New", "Like New", "Good", "Fair", "Poor"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {["Newest", "Oldest", "Price: Low to High", "Price: High to Low"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Max Price: ₹{maxPrice.toLocaleString()}</label>
              <input type="range" min={100} max={50000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹100</span><span>₹50,000</span></div>
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {["All", ...CATEGORIES.map((c) => c.name)].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0", cat === c ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
              {c}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> results
          {search && <> for "<span className="text-primary">{search}</span>"</>}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onView={(prod) => { setSelected(prod); setPage("product"); }} onFavourite={onFav} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground text-sm">Try different keywords or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Review Section ───────────────────────────────────────────────────────────

function ReviewSection({ isLoggedIn, productTitle }: { isLoggedIn: boolean; productTitle: string }) {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [flash, setFlash] = useState(false);

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }));

  function submit() {
    if (!rating) return;
    setReviews((prev) => [{
      id: prev.length + 1,
      reviewer: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9c0e8bf?w=100&h=100&fit=crop",
      rating,
      comment: comment || "Great seller, smooth transaction!",
      date: "Just now",
      transaction: productTitle,
    }, ...prev]);
    setRating(0); setComment(""); setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 mt-0">
      <div className="flex items-start justify-between mb-5">
        <h3 className="font-bold text-foreground">Seller Reviews</h3>
        <StarRating rating={avg} reviews={reviews.length} size="sm" />
      </div>

      {/* Distribution */}
      <div className="flex items-center gap-6 mb-5 pb-5 border-b border-border">
        <div className="text-center shrink-0">
          <p className="text-4xl font-bold text-foreground">{avg.toFixed(1)}</p>
          <StarRating rating={avg} size="sm" />
          <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {dist.map((d) => (
            <div key={d.n} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-3 shrink-0">{d.n}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: reviews.length ? `${(d.count / reviews.length) * 100}%` : "0%" }} />
              </div>
              <span className="text-xs text-muted-foreground w-3 shrink-0">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leave a review */}
      {isLoggedIn ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 p-4 mb-5">
          <p className="text-sm font-semibold text-foreground mb-3">Leave a Review</p>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                <Star className={cn("w-7 h-7 transition-colors", s <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
              </button>
            ))}
            {(hovered || rating) > 0 && (
              <span className="text-sm text-muted-foreground ml-2">{["", "Poor", "Fair", "Good", "Great", "Excellent!"][hovered || rating]}</span>
            )}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience with this seller..." className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm resize-none h-20 focus:outline-none focus:border-primary/50 mb-3" />
          <button onClick={submit} disabled={!rating} className={cn("flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40", flash ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary/90")}>
            {flash ? <><Check className="w-4 h-4" /> Review Posted!</> : "Submit Review"}
          </button>
        </div>
      ) : (
        <div className="bg-muted rounded-xl p-4 mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Sign in to leave a review after your purchase.</p>
          <button className="shrink-0 text-sm font-semibold text-primary hover:underline">Sign In</button>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
            <img src={r.avatar} alt={r.reviewer} className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-border" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-foreground">{r.reviewer}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <StarRating rating={r.rating} size="sm" />
              {r.comment && <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{r.comment}</p>}
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Check className="w-3 h-3 text-green-500" /> Verified purchase · {r.transaction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Product Detail Page ──────────────────────────────────────────────────────

function ProductDetailPage({
  product, products, setPage, setSelected, onFav, isLoggedIn,
}: {
  product: Product;
  products: Product[];
  setPage: (p: Page) => void;
  setSelected: (p: Product) => void;
  onFav: (id: number) => void;
  isLoggedIn: boolean;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category && !p.sold).slice(0, 4);
  const allImgs = product.images.length > 0 ? product.images : [product.image];
  const sellerInfo = SELLER_INFO[product.sellerId];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => setPage("landing")} className="hover:text-primary transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => setPage("marketplace")} className="hover:text-primary transition-colors">Marketplace</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Images + Description + Reviews */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden">
              <img src={allImgs[imgIdx]} alt={product.title} className="w-full h-full object-cover" />
              {product.sold && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white text-gray-900 font-bold text-lg px-6 py-2 rounded-full">SOLD</span>
                </div>
              )}
              {allImgs.length > 1 && (
                <>
                  <button onClick={() => setImgIdx((i) => (i - 1 + allImgs.length) % allImgs.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform"><ChevronLeft className="w-5 h-5" /></button>
                  <button onClick={() => setImgIdx((i) => (i + 1) % allImgs.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform"><ChevronRight className="w-5 h-5" /></button>
                </>
              )}
              {product.verified && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-blue-600/90 text-white rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
                </div>
              )}
            </div>
            {allImgs.length > 1 && (
              <div className="flex gap-2">
                {allImgs.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={cn("w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors", i === imgIdx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100")}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="flex items-center gap-1.5 text-xs bg-muted rounded-full px-3 py-1 text-muted-foreground"><Tag className="w-3 h-3" />{product.category}</span>
                <span className="flex items-center gap-1.5 text-xs bg-muted rounded-full px-3 py-1 text-muted-foreground"><MapPin className="w-3 h-3" />{product.hostel}</span>
                <span className="flex items-center gap-1.5 text-xs bg-muted rounded-full px-3 py-1 text-muted-foreground"><Clock className="w-3 h-3" />{product.posted}</span>
              </div>
            </div>

            <ReviewSection isLoggedIn={isLoggedIn} productTitle={product.title} />
          </div>

          {/* Right: Price card + Seller card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <ConditionBadge condition={product.condition} />
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="w-3.5 h-3.5" />{product.views} views</div>
              </div>
              <h1 className="text-xl font-bold text-foreground mb-3 leading-snug">{product.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                {product.negotiable && <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">Negotiable</span>}
              </div>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setPage("chat")} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Chat with Seller
                </button>
                <button onClick={() => onFav(product.id)} className={cn("w-12 h-12 rounded-xl border flex items-center justify-center transition-all", product.favourited ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" : "border-border hover:border-primary/40 bg-card")}>
                  <Heart className={cn("w-5 h-5", product.favourited ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                </button>
                <button className="w-12 h-12 rounded-xl border border-border bg-card flex items-center justify-center hover:border-primary/40 transition-colors">
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <button onClick={() => setPage("chat")} className="w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <Phone className="w-4 h-4" /> Request Phone Number
              </button>
            </div>

            {/* Enhanced Seller card */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Seller</p>
              <div className="flex items-start gap-3 mb-4">
                <div className="relative shrink-0">
                  <img src={product.sellerAvatar} alt={product.seller} className="w-12 h-12 rounded-full object-cover ring-2 ring-border" />
                  {sellerInfo?.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-card">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground mb-1">{product.seller}</p>
                  {sellerInfo?.verified && <VerifiedBadge size="sm" />}
                  <p className="text-xs text-muted-foreground mt-1">{product.hostel}</p>
                  {sellerInfo && <div className="mt-1.5"><StarRating rating={sellerInfo.rating} reviews={sellerInfo.reviews} size="sm" /></div>}
                </div>
              </div>
              <div className="grid grid-cols-3 border border-border rounded-xl overflow-hidden mb-4">
                {[
                  { label: "Listings",     val: "5"                                            },
                  { label: "Sold",         val: String(sellerInfo?.transactions ?? 0)           },
                  { label: "Rating",       val: sellerInfo ? sellerInfo.rating.toFixed(1) : "—" },
                ].map((s, i) => (
                  <div key={s.label} className={cn("py-3 text-center", i > 0 ? "border-l border-border" : "")}>
                    <p className="font-bold text-foreground text-sm">{s.val}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage("chat")} className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                <MessageCircle className="w-4 h-4" /> Start Chat
              </button>
            </div>

            <button onClick={() => setShowReport(true)} className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors py-2">
              <Flag className="w-4 h-4" /> Report this listing
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold font-poppins text-foreground mb-5">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onView={(prod) => { setSelected(prod); setImgIdx(0); }} onFavourite={onFav} />
              ))}
            </div>
          </div>
        )}
      </div>
      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </div>
  );
}

// ─── Report Modal ─────────────────────────────────────────────────────────────

function ReportModal({ onClose }: { onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reasons = ["Stolen or suspicious item", "Counterfeit / fake product", "Misleading description", "Spam or duplicate listing", "Prohibited item", "Other"];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center"><Flag className="w-4 h-4 text-red-600" /></div>
                <h2 className="font-bold text-foreground">Report Listing</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Help keep VITMart safe. Select a reason for reporting.</p>
            <div className="space-y-2 mb-4">
              {reasons.map((r) => (
                <label key={r} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/5">
                  <input type="radio" name="reason" value={r} onChange={() => setReason(r)} className="accent-primary" />
                  <span className="text-sm text-foreground">{r}</span>
                </label>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Additional comments (optional)..." className="w-full bg-muted border border-border rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:border-primary/50 mb-4" />
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => reason && setSubmitted(true)} disabled={!reason} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Submit Report</button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-600" /></div>
            <h3 className="font-bold text-foreground text-lg mb-2">Report Submitted</h3>
            <p className="text-muted-foreground text-sm mb-5">Our team will review this listing within 24 hours.</p>
            <button onClick={onClose} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sell Page ────────────────────────────────────────────────────────────────

function SellPage({ setPage }: { setPage: (p: Page) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", category: "", condition: "", price: "", negotiable: false, description: "", images: [] as string[] });
  const [published, setPublished] = useState(false);
  const steps = ["Category & Title", "Photos", "Details & Price", "Review & Publish"];

  function upd(k: string, v: string | boolean | string[]) { setForm((f) => ({ ...f, [k]: v })); }
  function addImg() {
    if (form.images.length < 6) upd("images", [...form.images, "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop"]);
  }

  if (published) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card rounded-3xl border border-border shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-5"><Check className="w-10 h-10 text-green-600" /></div>
          <h2 className="text-2xl font-bold font-poppins text-foreground mb-2">Listing Published!</h2>
          <p className="text-muted-foreground text-sm mb-2">Your item is now live on VITMart.</p>
          <p className="text-xs text-muted-foreground mb-6 bg-muted rounded-lg p-3">Tip: Respond quickly to messages to sell faster!</p>
          <div className="flex gap-3">
            <button onClick={() => setPage("marketplace")} className="flex-1 border border-border py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors">Browse</button>
            <button onClick={() => { setPublished(false); setStep(1); setForm({ title: "", category: "", condition: "", price: "", negotiable: false, description: "", images: [] }); }} className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">List Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-poppins text-foreground mb-1">List an Item for Sale</h1>
          <p className="text-muted-foreground text-sm">Complete all steps to publish your listing.</p>
        </div>
        <div className="flex items-center gap-0 mb-8 overflow-x-auto">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors", i + 1 < step ? "bg-primary text-white" : i + 1 === step ? "bg-primary text-white ring-4 ring-primary/20" : "bg-muted text-muted-foreground")}>
                  {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn("text-xs font-medium whitespace-nowrap hidden sm:block", i + 1 === step ? "text-primary" : "text-muted-foreground")}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={cn("h-0.5 flex-1 mx-1 transition-colors min-w-4", i + 1 < step ? "bg-primary" : "bg-border")} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-bold text-lg text-foreground">What are you selling?</h2>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Category <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c.name} onClick={() => upd("category", c.name)} className={cn("flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all", form.category === c.name ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/40")}>
                      <span className="text-xl">{c.emoji}</span>{c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Product Title <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={(e) => upd("title", e.target.value)} placeholder="e.g. Casio FX-991ES Plus Scientific Calculator" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                <p className="text-xs text-muted-foreground mt-1">{form.title.length}/80 characters</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-bold text-lg text-foreground">Upload Photos</h2>
              <p className="text-sm text-muted-foreground">Good photos get 3x more responses. Add up to 6 photos.</p>
              <div className="grid grid-cols-3 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => upd("images", form.images.filter((_, idx) => idx !== i))} className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {i === 0 && <div className="absolute bottom-1.5 left-1.5 bg-primary text-white text-xs px-2 py-0.5 rounded-full font-medium">Cover</div>}
                  </div>
                ))}
                {form.images.length < 6 && (
                  <button onClick={addImg} className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Camera className="w-6 h-6" /><span className="text-xs font-medium">Add Photo</span>
                  </button>
                )}
              </div>
              {form.images.length === 0 && (
                <button onClick={addImg} className="w-full border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors">
                  <Upload className="w-10 h-10 text-muted-foreground/50" />
                  <div className="text-center">
                    <p className="font-semibold text-foreground text-sm">Click to upload photos</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB each</p>
                  </div>
                </button>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-bold text-lg text-foreground">Details & Pricing</h2>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Condition <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {(["New", "Like New", "Good", "Fair", "Poor"] as Condition[]).map((c) => (
                    <button key={c} onClick={() => upd("condition", c)} className={cn("p-3 rounded-xl border text-sm font-medium transition-all", form.condition === c ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/40")}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                  <input type="number" value={form.price} onChange={(e) => upd("price", e.target.value)} placeholder="0" className="w-full pl-8 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div><p className="font-semibold text-sm text-foreground">Open to Negotiation?</p><p className="text-xs text-muted-foreground">Buyers can make offers</p></div>
                <button onClick={() => upd("negotiable", !form.negotiable)} className={cn("w-12 h-6 rounded-full transition-colors relative", form.negotiable ? "bg-primary" : "bg-muted-foreground/30")}>
                  <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow", form.negotiable ? "left-[calc(100%-1.375rem)]" : "left-0.5")} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={(e) => upd("description", e.target.value)} placeholder="Describe your item — condition details, reason for selling, accessories included..." className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm resize-none h-28 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-bold text-lg text-foreground">Review Your Listing</h2>
              <div className="bg-muted rounded-2xl p-4 flex gap-4">
                {form.images[0] ? (
                  <img src={form.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0 bg-border" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-border flex items-center justify-center shrink-0"><ImageIcon className="w-8 h-8 text-muted-foreground/50" /></div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground mb-1 truncate">{form.title || "Untitled Product"}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">₹{Number(form.price || 0).toLocaleString()}</p>
                  <div className="flex gap-2 flex-wrap">
                    {form.condition && <ConditionBadge condition={form.condition as Condition} />}
                    {form.negotiable && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Negotiable</span>}
                  </div>
                </div>
              </div>
              {form.description && <div className="bg-muted rounded-xl p-4"><p className="text-sm text-muted-foreground leading-relaxed">{form.description}</p></div>}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-1">Before you publish:</p>
                <ul className="space-y-1 text-xs list-disc list-inside">
                  <li>Make sure your price is accurate</li>
                  <li>Only list items you own and are willing to sell</li>
                  <li>Respond to buyer messages within 24 hours</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-5 border-t border-border">
            {step > 1 && (
              <button onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button onClick={() => { if (step < 4) setStep((s) => (s + 1) as 1 | 2 | 3 | 4); else setPublished(true); }} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              {step === 4 ? <><Zap className="w-4 h-4" /> Publish Listing</> : <>Continue <ChevronRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────

function AuthPage({ setPage, onLogin }: { setPage: (p: Page) => void; onLogin: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPwd, setShowPwd] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleOtp(i: number, v: string) {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  }

  const cardClass = "bg-card rounded-3xl border border-border shadow-xl w-full max-w-md p-8";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Branding + Verified Student Access */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <Store className="w-7 h-7 text-white" />
          </div>
          <span className="font-bold text-2xl font-poppins text-foreground">VIT<span className="text-primary">Mart</span></span>
          <p className="text-muted-foreground text-sm mt-1">Campus marketplace for VIT students</p>
          <div className="mt-3 flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 rounded-full px-4 py-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Verified Student Access Only</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-center max-w-xs">
            Only students with a valid <span className="font-semibold text-foreground">@vit.ac.in</span> email can join VITMart.
          </p>
        </div>

        {mode === "login" && (
          <div className={cardClass}>
            <h2 className="text-xl font-bold text-foreground mb-1">Welcome back!</h2>
            <p className="text-muted-foreground text-sm mb-6">Sign in to your VITMart account</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">VIT Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" placeholder="yourname@vit.ac.in" className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPwd ? "text" : "password"} placeholder="Enter your password" className="w-full pl-10 pr-10 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setMode("forgot")} className="text-sm text-primary hover:underline">Forgot password?</button>
              </div>
              <button onClick={() => setMode("otp")} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Sign In</button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-5">
              New to VITMart?{" "}
              <button onClick={() => setMode("register")} className="text-primary font-semibold hover:underline">Create account</button>
            </p>
          </div>
        )}

        {mode === "register" && (
          <div className={cardClass}>
            <h2 className="text-xl font-bold text-foreground mb-1">Create your account</h2>
            <p className="text-muted-foreground text-sm mb-6">Join 4,200+ VIT students on VITMart</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">First Name</label>
                  <input placeholder="Arjun" className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Last Name</label>
                  <input placeholder="Mehta" className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">VIT Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" placeholder="yourname.21cse@vit.ac.in" className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3 h-3 text-blue-500 shrink-0" />
                  Only <span className="font-semibold text-foreground mx-0.5">@vit.ac.in</span> emails are accepted
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="tel" placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Hostel / Block</label>
                <select className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50">
                  <option value="">Select your hostel</option>
                  {["Himalaya Block A", "Himalaya Block B", "Himalaya Block C", "Ganga Block A", "Ganga Block B", "Cauvery Block A", "Cauvery Block B", "Krishna Block", "Saraswathi Block", "Yamuna Block"].map((h) => <option key={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPwd ? "text" : "password"} placeholder="Min 8 characters" className="w-full pl-10 pr-10 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button onClick={() => setMode("otp")} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Create Account</button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-5">
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Sign in</button>
            </p>
          </div>
        )}

        {mode === "otp" && (
          <div className={cardClass}>
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">Verify your email</h2>
              <p className="text-muted-foreground text-sm">We sent a 6-digit OTP to <span className="font-semibold text-foreground">yourname@vit.ac.in</span></p>
            </div>
            {/* Verified Student Access callout */}
            <div className="flex items-center gap-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl px-4 py-3 mb-5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Verified Student Access</span> — Your @vit.ac.in email ensures only real students trade on VITMart.
              </p>
            </div>
            <div className="flex gap-2.5 justify-center mb-6">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text" maxLength={1} value={v}
                  onChange={(e) => handleOtp(i, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-bold bg-muted border-2 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              ))}
            </div>
            <button onClick={() => { onLogin(); setPage("landing"); }} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors mb-4">
              Verify & Enter VITMart
            </button>
            <p className="text-center text-sm text-muted-foreground">
              {"Didn't"} receive it?{" "}
              <button className="text-primary font-semibold hover:underline">Resend OTP</button>
              <span className="text-muted-foreground"> (30s)</span>
            </p>
          </div>
        )}

        {mode === "forgot" && (
          <div className={cardClass}>
            <div className="mb-6">
              <button onClick={() => setMode("login")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                <ChevronLeft className="w-4 h-4" /> Back to login
              </button>
              <h2 className="text-xl font-bold text-foreground mb-1">Reset Password</h2>
              <p className="text-muted-foreground text-sm">{"Enter your VIT email and we'll send a reset link"}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">VIT Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" placeholder="yourname@vit.ac.in" className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                </div>
              </div>
              <button onClick={() => setMode("otp")} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Send Reset Link</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

function ProfilePage({
  products, setPage, setSelected, onFav,
}: {
  products: Product[];
  setPage: (p: Page) => void;
  setSelected: (p: Product) => void;
  onFav: (id: number) => void;
}) {
  const [tab, setTab] = useState<"listings" | "sold" | "saved" | "messages" | "reviews">("listings");
  const myListings = products.filter((p) => p.sellerId === 1 || p.sellerId === 2);
  const soldItems  = products.filter((p) => p.sold);
  const savedItems = products.filter((p) => p.favourited);
  const si = SELLER_INFO[2]; // Priya Sharma

  const tabs = [
    { key: "listings" as const, label: "My Listings", count: myListings.length },
    { key: "sold"     as const, label: "Sold",        count: soldItems.length  },
    { key: "saved"    as const, label: "Saved",       count: savedItems.length },
    { key: "messages" as const, label: "Messages",    count: 3                 },
    { key: "reviews"  as const, label: "Reviews",     count: REVIEWS.length    },
  ];

  const displayProducts = tab === "listings" ? myListings : tab === "sold" ? soldItems : tab === "saved" ? savedItems : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile card */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden mb-6">
          <div className="h-28 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b9c0e8bf?w=200&h=200&fit=crop" alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-lg" />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow">
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>
              <div className="flex gap-2 pt-12">
                <button className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit Profile
                </button>
                <button onClick={() => setPage("sell")} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> New Listing
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl font-bold text-foreground">Priya Sharma</h1>
                  <VerifiedBadge size="md" />
                </div>
                <p className="text-muted-foreground text-sm">priya.22ece@vit.ac.in</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Ganga Block C</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Joined Jan 2024</span>
                </div>
                <div className="mt-2">
                  <StarRating rating={si.rating} reviews={si.reviews} size="md" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{si.transactions} successful transactions</p>
              </div>
              <div className="flex gap-6 text-center">
                {[
                  { v: String(myListings.length), l: "Listings" },
                  { v: String(soldItems.length),  l: "Sold"     },
                  { v: si.rating.toFixed(1),      l: "Rating"   },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-2xl font-bold text-foreground">{s.v}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Listings"  value={String(myListings.length)} icon={<Package    className="w-4 h-4 text-blue-600"   />} color="bg-blue-100 dark:bg-blue-900/40"   />
          <StatCard label="Items Sold"      value={String(soldItems.length)}  icon={<ShoppingBag className="w-4 h-4 text-green-600"  />} color="bg-green-100 dark:bg-green-900/40" />
          <StatCard label="Total Earnings"  value="₹12,400"                   icon={<DollarSign  className="w-4 h-4 text-amber-600"  />} color="bg-amber-100 dark:bg-amber-900/40" />
          <StatCard label="Seller Rating"   value={`★ ${si.rating}`}          icon={<Star        className="w-4 h-4 text-purple-600" />} color="bg-purple-100 dark:bg-purple-900/40"/>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex border-b border-border overflow-x-auto no-scrollbar">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px", tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
                {t.label}
                {t.count > 0 && <span className={cn("text-xs rounded-full px-2 py-0.5 font-bold", tab === t.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{t.count}</span>}
              </button>
            ))}
          </div>
          <div className="p-5">
            {tab === "messages" ? (
              <div className="space-y-3">
                {CONVOS.map((c) => (
                  <button key={c.id} onClick={() => setPage("chat")} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                    <img src={c.avatar} alt={c.user} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-semibold text-sm text-foreground">{c.user}</span>
                        {c.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                        <span className="text-xs text-muted-foreground ml-auto">{c.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread > 0 && <span className="w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center font-bold shrink-0">{c.unread}</span>}
                  </button>
                ))}
              </div>
            ) : tab === "reviews" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border border-amber-100 dark:border-amber-900/40">
                  <div className="text-center shrink-0">
                    <p className="text-3xl font-bold text-foreground">{si.rating.toFixed(1)}</p>
                    <StarRating rating={si.rating} size="sm" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{si.reviews} total reviews</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{si.transactions} verified transactions</p>
                  </div>
                </div>
                {REVIEWS.map((r) => (
                  <div key={r.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <img src={r.avatar} alt={r.reviewer} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-foreground">{r.reviewer}</span>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} size="sm" />
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{r.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" /> {r.transaction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {displayProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onView={(prod) => { setSelected(prod); setPage("product"); }} onFavourite={onFav} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Nothing here yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Favourites Page ──────────────────────────────────────────────────────────

function FavouritesPage({
  products, setPage, setSelected, onFav,
}: {
  products: Product[];
  setPage: (p: Page) => void;
  setSelected: (p: Product) => void;
  onFav: (id: number) => void;
}) {
  const saved = products.filter((p) => p.favourited);
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-poppins text-foreground">Saved Items</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{saved.length} product{saved.length !== 1 ? "s" : ""} saved</p>
          </div>
          <button onClick={() => setPage("marketplace")} className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all">
            Browse more <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {saved.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} onView={(prod) => { setSelected(prod); setPage("product"); }} onFavourite={onFav} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4"><Heart className="w-10 h-10 text-muted-foreground/40" /></div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No saved items yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">Tap the heart icon on any listing to save it here.</p>
            <button onClick={() => setPage("marketplace")} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">Start Browsing</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Chat Page ────────────────────────────────────────────────────────────────

function ChatPage() {
  const [convos, setConvos] = useState(CONVOS);
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const convo = convos[active];
  const activeSi = SELLER_INFO[active + 1];

  function sendMsg() {
    if (!msg.trim()) return;
    setConvos((prev) => prev.map((c, i) =>
      i === active
        ? { ...c, messages: [...c.messages, { id: c.messages.length + 1, text: msg, sent: true, time: "Now", read: false }], lastMessage: msg, time: "Now" }
        : c
    ));
    setMsg("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold font-poppins text-foreground mb-4">Messages</h1>
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex" style={{ height: "calc(100vh - 200px)", minHeight: 520 }}>

          {/* Sidebar */}
          <div className={cn("w-full sm:w-72 border-r border-border flex-shrink-0 flex flex-col", showSidebar ? "block" : "hidden sm:flex sm:flex-col")}>
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input type="text" placeholder="Search conversations..." className="w-full pl-8 pr-3 py-2 bg-muted rounded-lg text-xs focus:outline-none border border-transparent focus:border-primary/30" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {convos.map((c, i) => {
                const cSi = SELLER_INFO[i + 1];
                return (
                  <button key={c.id} onClick={() => { setActive(i); setShowSidebar(false); }} className={cn("w-full flex items-center gap-3 p-3.5 hover:bg-muted transition-colors text-left border-b border-border/50 last:border-0", i === active ? "bg-primary/5 border-l-2 border-l-primary" : "")}>
                    <div className="relative shrink-0">
                      <img src={c.avatar} alt={c.user} className="w-10 h-10 rounded-full object-cover" />
                      {c.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-card">
                          <ShieldCheck className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      {c.unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-white text-xs flex items-center justify-center font-bold">{c.unread}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm font-semibold truncate", i === active ? "text-primary" : "text-foreground")}>{c.user}</span>
                        <span className="text-xs text-muted-foreground shrink-0 ml-1">{c.time}</span>
                      </div>
                      {cSi && <StarRating rating={cSi.rating} reviews={cSi.reviews} size="sm" />}
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          <div className={cn("flex-1 flex flex-col min-w-0", !showSidebar ? "flex" : "hidden sm:flex")}>
            {/* Header with verified badge + rating */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
              <button onClick={() => setShowSidebar(true)} className="sm:hidden w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="relative shrink-0">
                <img src={convo.avatar} alt={convo.user} className="w-9 h-9 rounded-full object-cover" />
                {convo.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-card">
                    <ShieldCheck className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-bold text-sm text-foreground">{convo.user}</p>
                  {convo.verified && <VerifiedBadge size="sm" />}
                </div>
                {activeSi && <StarRating rating={activeSi.rating} reviews={activeSi.reviews} size="sm" />}
              </div>
              <MoreVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>

            {/* Product preview */}
            <div className="px-4 pt-3">
              <div className="bg-muted rounded-xl p-3 flex items-center gap-3">
                <img src={convo.productImage} alt={convo.productTitle} className="w-12 h-10 rounded-lg object-cover shrink-0 bg-border" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{convo.productTitle}</p>
                  <p className="text-primary text-sm font-bold">₹{convo.productPrice.toLocaleString()}</p>
                </div>
                <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium shrink-0">Available</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {convo.messages.map((m) => (
                <div key={m.id} className={cn("flex", m.sent ? "justify-end" : "justify-start")}>
                  {!m.sent && <img src={convo.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mr-2 mt-auto mb-0.5" />}
                  <div className={cn("max-w-[70%] rounded-2xl px-4 py-2.5 text-sm", m.sent ? "bg-primary text-white rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm")}>
                    {m.text}
                    <div className={cn("flex items-center gap-1 mt-1 justify-end", m.sent ? "text-white/70" : "text-muted-foreground")}>
                      <span className="text-xs">{m.time}</span>
                      {m.sent && <CheckCheck className={cn("w-3 h-3", m.read ? "text-blue-300" : "text-white/60")} />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl bg-muted hover:bg-accent flex items-center justify-center transition-colors shrink-0">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
              </button>
              <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg()} placeholder="Type a message..." className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30" />
              <button onClick={sendMsg} disabled={!msg.trim()} className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors shrink-0">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

function AdminPage({ products }: { products: Product[] }) {
  const [adminTab, setAdminTab] = useState<"overview" | "users" | "products" | "reports" | "categories">("overview");

  const tabs = [
    { key: "overview"   as const, label: "Overview",   icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: "users"      as const, label: "Users",      icon: <Users            className="w-4 h-4" /> },
    { key: "products"   as const, label: "Products",   icon: <Package          className="w-4 h-4" /> },
    { key: "reports"    as const, label: "Reports",    icon: <AlertCircle      className="w-4 h-4" /> },
    { key: "categories" as const, label: "Categories", icon: <Tag              className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-poppins text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">VITMart platform management</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Operational
          </div>
        </div>

        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setAdminTab(t.key)} className={cn("flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap", adminTab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {adminTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Total Users",    value: "4,218",  icon: <Users        className="w-4 h-4 text-blue-600"   />, color: "bg-blue-100 dark:bg-blue-900/40",    change: "+12%" },
                { label: "Total Products", value: "12,540", icon: <Package      className="w-4 h-4 text-indigo-600" />, color: "bg-indigo-100 dark:bg-indigo-900/40", change: "+8%"  },
                { label: "Available",      value: "9,312",  icon: <ShoppingBag  className="w-4 h-4 text-green-600"  />, color: "bg-green-100 dark:bg-green-900/40",   change: "+5%"  },
                { label: "Sold",           value: "3,228",  icon: <Check        className="w-4 h-4 text-amber-600"  />, color: "bg-amber-100 dark:bg-amber-900/40",   change: "+23%" },
                { label: "Reported",       value: "17",     icon: <AlertTriangle className="w-4 h-4 text-red-600"  />, color: "bg-red-100 dark:bg-red-900/40",       change: "-3%"  },
              ].map((s) => (
                <div key={s.label} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", s.color)}>{s.icon}</div>
                  </div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className={cn("text-xs font-medium mt-1", s.change.startsWith("+") ? "text-green-600" : "text-red-500")}>{s.change} this month</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Listings & Sales Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={ADMIN_CHART}>
                    <defs>
                      <linearGradient id="listGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="saleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }} />
                    <Area type="monotone" dataKey="listings" stroke="#2563eb" fill="url(#listGrad)" strokeWidth={2} name="Listings" />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" fill="url(#saleGrad)" strokeWidth={2} name="Sales" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Monthly Sales</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ADMIN_CHART}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }} />
                    <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {adminTab === "users" && (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Registered Users</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input placeholder="Search users..." className="pl-8 pr-4 py-2 bg-muted rounded-lg text-sm border border-transparent focus:border-primary/30 focus:outline-none" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-muted/50">
                  {["Name", "Email", "Hostel", "Listings", "Rating", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {ADMIN_USERS.map((u) => {
                    const uSi = SELLER_INFO[u.id];
                    return (
                      <tr key={u.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{u.name[0]}</div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium text-foreground">{u.name}</span>
                              {uSi?.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{u.hostel}</td>
                        <td className="px-4 py-3 text-sm text-foreground font-medium">{u.listings}</td>
                        <td className="px-4 py-3">{uSi && <StarRating rating={uSi.rating} reviews={uSi.reviews} size="sm" />}</td>
                        <td className="px-4 py-3">
                          <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", u.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400")}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="w-7 h-7 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                            <button className="w-7 h-7 rounded-lg bg-muted hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"><Ban className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "products" && (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">All Listings</h3>
              <span className="text-sm text-muted-foreground">{products.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-muted/50">
                  {["Product", "Seller", "Price", "Category", "Condition", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {products.slice(0, 8).map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={p.image} alt={p.title} className="w-9 h-9 rounded-lg object-cover bg-muted shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate max-w-[160px]">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-muted-foreground">{p.seller}</span>
                          {SELLER_INFO[p.sellerId]?.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary">₹{p.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3"><ConditionBadge condition={p.condition} /></td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", p.sold ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400")}>
                          {p.sold ? "Sold" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="w-7 h-7 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button className="w-7 h-7 rounded-lg bg-muted hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "reports" && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-400 text-sm">3 reports need review</p>
                <p className="text-amber-700 dark:text-amber-500 text-xs mt-0.5">Review within 24 hours per community policy.</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border"><h3 className="font-semibold text-foreground">Reported Listings</h3></div>
              <div className="divide-y divide-border">
                {REPORTED.map((r) => (
                  <div key={r.id} className="p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{r.product}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">By {r.seller} · {r.date}</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"><Flag className="w-3 h-3" />{r.reason}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", r.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" : r.status === "Under Review" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400")}>{r.status}</span>
                      <button className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors">Remove</button>
                      <button className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-semibold rounded-lg hover:bg-accent transition-colors">Dismiss</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {adminTab === "categories" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"><Plus className="w-4 h-4" /> Add Category</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((c) => (
                <div key={c.name} className="bg-card rounded-2xl border border-border p-5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{c.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.count} listings</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button className="w-7 h-7 rounded-lg bg-muted hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [selected, setSelected] = useState<Product>(INIT_PRODUCTS[0]);

  function toggleFav(id: number) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, favourited: !p.favourited } : p));
  }

  function navigate(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const selectedProduct = products.find((p) => p.id === selected.id) || selected;

  return (
    <div className={isDark ? "dark" : ""}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { font-family: 'Inter', 'Poppins', system-ui, sans-serif; }
        .font-poppins { font-family: 'Poppins', 'Inter', system-ui, sans-serif; }
      `}</style>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar
          page={page}
          setPage={navigate}
          isDark={isDark}
          setIsDark={setIsDark}
          isLoggedIn={isLoggedIn}
          onLogout={() => setIsLoggedIn(false)}
        />

        {page === "landing"    && <LandingPage products={products} setPage={navigate} setSelected={(p) => { setSelected(p); navigate("product"); }} onFav={toggleFav} isLoggedIn={isLoggedIn} />}
        {page === "marketplace"&& <MarketplacePage products={products} setPage={navigate} setSelected={(p) => { setSelected(p); navigate("product"); }} onFav={toggleFav} />}
        {page === "product"    && <ProductDetailPage product={selectedProduct} products={products} setPage={navigate} setSelected={setSelected} onFav={toggleFav} isLoggedIn={isLoggedIn} />}
        {page === "sell"       && <SellPage setPage={navigate} />}
        {page === "auth"       && <AuthPage setPage={navigate} onLogin={() => setIsLoggedIn(true)} />}
        {page === "profile"    && <ProfilePage products={products} setPage={navigate} setSelected={setSelected} onFav={toggleFav} />}
        {page === "favourites" && <FavouritesPage products={products} setPage={navigate} setSelected={(p) => { setSelected(p); navigate("product"); }} onFav={toggleFav} />}
        {page === "chat"       && <ChatPage />}
        {page === "admin"      && <AdminPage products={products} />}

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-border z-40">
          <div className="flex items-center justify-around px-2 py-2">
            {[
              { icon: <Home className="w-5 h-5" />,  label: "Home",    p: "landing"     as Page                              },
              { icon: <Store className="w-5 h-5" />, label: "Browse",  p: "marketplace" as Page                              },
              { icon: <Plus className="w-5 h-5" />,  label: "Sell",    p: "sell"        as Page, primary: true               },
              { icon: <Heart className="w-5 h-5" />, label: "Saved",   p: "favourites"  as Page                              },
              { icon: <User className="w-5 h-5" />,  label: "Profile", p: (isLoggedIn ? "profile" : "auth") as Page          },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.p)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                  (item as { primary?: boolean }).primary
                    ? "bg-primary text-white -mt-4 shadow-lg shadow-primary/30 px-4 py-2"
                    : page === item.p ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Admin shortcut */}
        <button
          onClick={() => navigate("admin")}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors z-40 flex items-center gap-1.5"
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Admin
        </button>
      </div>
    </div>
  );
}
