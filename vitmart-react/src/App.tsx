import { useState } from 'react'
import { Home, Store, Plus, Heart, User, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Page, Product } from '@/types'
import { INIT_PRODUCTS } from '@/data/products'
import { Navbar } from '@/components/Navbar'
import { LandingPage } from '@/pages/LandingPage'
import { MarketplacePage } from '@/pages/MarketplacePage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { SellPage } from '@/pages/SellPage'
import { AuthPage } from '@/pages/AuthPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { FavouritesPage } from '@/pages/FavouritesPage'
import { ChatPage } from '@/pages/ChatPage'
import { AdminPage } from '@/pages/AdminPage'

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [isDark, setIsDark] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [products, setProducts] = useState(INIT_PRODUCTS)
  const [selected, setSelected] = useState<Product>(INIT_PRODUCTS[0])

  function toggleFav(id: number) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, favourited: !p.favourited } : p)))
  }

  function navigate(p: Page) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedProduct = products.find((p) => p.id === selected.id) || selected

  return (
    <div className={isDark ? 'dark' : ''}>
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

        {page === 'landing' && <LandingPage products={products} setPage={navigate} setSelected={(p) => { setSelected(p); navigate('product') }} onFav={toggleFav} isLoggedIn={isLoggedIn} />}
        {page === 'marketplace' && <MarketplacePage products={products} setPage={navigate} setSelected={(p) => { setSelected(p); navigate('product') }} onFav={toggleFav} />}
        {page === 'product' && <ProductDetailPage product={selectedProduct} products={products} setPage={navigate} setSelected={setSelected} onFav={toggleFav} isLoggedIn={isLoggedIn} />}
        {page === 'sell' && <SellPage setPage={navigate} />}
        {page === 'auth' && <AuthPage setPage={navigate} onLogin={() => setIsLoggedIn(true)} />}
        {page === 'profile' && <ProfilePage products={products} setPage={navigate} setSelected={setSelected} onFav={toggleFav} />}
        {page === 'favourites' && <FavouritesPage products={products} setPage={navigate} setSelected={(p) => { setSelected(p); navigate('product') }} onFav={toggleFav} />}
        {page === 'chat' && <ChatPage />}
        {page === 'admin' && <AdminPage products={products} />}

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-border z-40">
          <div className="flex items-center justify-around px-2 py-2">
            {[
              { icon: <Home className="w-5 h-5" />, label: 'Home', p: 'landing' as Page },
              { icon: <Store className="w-5 h-5" />, label: 'Browse', p: 'marketplace' as Page },
              { icon: <Plus className="w-5 h-5" />, label: 'Sell', p: 'sell' as Page, primary: true },
              { icon: <Heart className="w-5 h-5" />, label: 'Saved', p: 'favourites' as Page },
              { icon: <User className="w-5 h-5" />, label: 'Profile', p: (isLoggedIn ? 'profile' : 'auth') as Page },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.p)}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors',
                  (item as { primary?: boolean }).primary
                    ? 'bg-primary text-white -mt-4 shadow-lg shadow-primary/30 px-4 py-2'
                    : page === item.p ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
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
          onClick={() => navigate('admin')}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors z-40 flex items-center gap-1.5"
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Admin
        </button>
      </div>
    </div>
  )
}
