import { useState } from 'react'
import {
  LayoutDashboard, Users, Package, AlertCircle, Tag, Search, Eye, Ban,
  Trash2, Edit, Plus, Check, AlertTriangle, ShieldCheck, ShoppingBag, Flag,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'
import { ADMIN_CHART, ADMIN_USERS, REPORTED, CATEGORIES, SELLER_INFO } from '@/data/products'
import { ConditionBadge } from '@/components/ConditionBadge'
import { StarRating } from '@/components/StarRating'

export function AdminPage({ products }: { products: Product[] }) {
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'products' | 'reports' | 'categories'>('overview')

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'users' as const, label: 'Users', icon: <Users className="w-4 h-4" /> },
    { key: 'products' as const, label: 'Products', icon: <Package className="w-4 h-4" /> },
    { key: 'reports' as const, label: 'Reports', icon: <AlertCircle className="w-4 h-4" /> },
    { key: 'categories' as const, label: 'Categories', icon: <Tag className="w-4 h-4" /> },
  ]

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
            <button key={t.key} onClick={() => setAdminTab(t.key)} className={cn('flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap', adminTab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {adminTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Total Users', value: '4,218', icon: <Users className="w-4 h-4 text-blue-600" />, color: 'bg-blue-100 dark:bg-blue-900/40', change: '+12%' },
                { label: 'Total Products', value: '12,540', icon: <Package className="w-4 h-4 text-indigo-600" />, color: 'bg-indigo-100 dark:bg-indigo-900/40', change: '+8%' },
                { label: 'Available', value: '9,312', icon: <ShoppingBag className="w-4 h-4 text-green-600" />, color: 'bg-green-100 dark:bg-green-900/40', change: '+5%' },
                { label: 'Sold', value: '3,228', icon: <Check className="w-4 h-4 text-amber-600" />, color: 'bg-amber-100 dark:bg-amber-900/40', change: '+23%' },
                { label: 'Reported', value: '17', icon: <AlertTriangle className="w-4 h-4 text-red-600" />, color: 'bg-red-100 dark:bg-red-900/40', change: '-3%' },
              ].map((s) => (
                <div key={s.label} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                    <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', s.color)}>{s.icon}</div>
                  </div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className={cn('text-xs font-medium mt-1', s.change.startsWith('+') ? 'text-green-600' : 'text-red-500')}>{s.change} this month</p>
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
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
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
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
                    <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'users' && (
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
                  {['Name', 'Email', 'Hostel', 'Listings', 'Rating', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {ADMIN_USERS.map((u) => {
                    const uSi = SELLER_INFO[u.id]
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
                          <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', u.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400')}>
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'products' && (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">All Listings</h3>
              <span className="text-sm text-muted-foreground">{products.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-muted/50">
                  {['Product', 'Seller', 'Price', 'Category', 'Condition', 'Status', 'Actions'].map((h) => (
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
                        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', p.sold ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400')}>
                          {p.sold ? 'Sold' : 'Active'}
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

        {adminTab === 'reports' && (
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
                      <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', r.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : r.status === 'Under Review' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400')}>{r.status}</span>
                      <button className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors">Remove</button>
                      <button className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-semibold rounded-lg hover:bg-accent transition-colors">Dismiss</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {adminTab === 'categories' && (
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
  )
}
