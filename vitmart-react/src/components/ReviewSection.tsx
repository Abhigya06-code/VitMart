import { useState } from 'react'
import { Star, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'
import { REVIEWS } from '@/data/products'
import { StarRating } from './StarRating'

export function ReviewSection({ isLoggedIn, productTitle }: { isLoggedIn: boolean; productTitle: string }) {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS)
  const [hovered, setHovered] = useState(0)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [flash, setFlash] = useState(false)

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }))

  function submit() {
    if (!rating) return
    setReviews((prev) => [{
      id: prev.length + 1,
      reviewer: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c0e8bf?w=100&h=100&fit=crop',
      rating,
      comment: comment || 'Great seller, smooth transaction!',
      date: 'Just now',
      transaction: productTitle,
    }, ...prev])
    setRating(0); setComment(''); setFlash(true)
    setTimeout(() => setFlash(false), 2500)
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 mt-0">
      <div className="flex items-start justify-between mb-5">
        <h3 className="font-bold text-foreground">Seller Reviews</h3>
        <StarRating rating={avg} reviews={reviews.length} size="sm" />
      </div>

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
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: reviews.length ? `${(d.count / reviews.length) * 100}%` : '0%' }} />
              </div>
              <span className="text-xs text-muted-foreground w-3 shrink-0">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {isLoggedIn ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 p-4 mb-5">
          <p className="text-sm font-semibold text-foreground mb-3">Leave a Review</p>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                <Star className={cn('w-7 h-7 transition-colors', s <= (hovered || rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
              </button>
            ))}
            {(hovered || rating) > 0 && (
              <span className="text-sm text-muted-foreground ml-2">{['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][hovered || rating]}</span>
            )}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience with this seller..." className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm resize-none h-20 focus:outline-none focus:border-primary/50 mb-3" />
          <button onClick={submit} disabled={!rating} className={cn('flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40', flash ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary/90')}>
            {flash ? <><Check className="w-4 h-4" /> Review Posted!</> : 'Submit Review'}
          </button>
        </div>
      ) : (
        <div className="bg-muted rounded-xl p-4 mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Sign in to leave a review after your purchase.</p>
          <button className="shrink-0 text-sm font-semibold text-primary hover:underline">Sign In</button>
        </div>
      )}

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
  )
}
