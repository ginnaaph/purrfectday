import { useCallback, useEffect, useState } from 'react'
import { fetchInspirationalQuotes } from '../data/InspirationalQuotes'
import { RefreshCcw } from 'lucide-react'

type Quote = { q: string; a: string }

export default function Quotes() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchAt, setLastFetchAt] = useState<number>(0)
  const COOLDOWN_MS = 60000 // 1 minute cooldown
  const isCoolingDown = Date.now() - lastFetchAt < COOLDOWN_MS

  const load = useCallback(async () => {
    const now = Date.now()
    if (now - lastFetchAt < COOLDOWN_MS) {
      return
    }
    setLoading(true)
    setError(null)
    const result = await fetchInspirationalQuotes()
    if (result.data && result.data.length > 0) {
      const { q, a } = result.data[0]
      setQuote({ q, a })
    } else {
      setError(result.error ?? 'Failed to load quote from API.')
      setQuote(null)
    }
    setLoading(false)
    setLastFetchAt(now)
  }, [lastFetchAt])

  useEffect(() => {
    void load()
  }, [load])


  return (
   <div className="align-end  text-right mr-6">
      {loading && <div>Loading quote…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && quote && (
        <div className="text-right mr-6">
          <div className="text-xl italic">“{quote.q}”</div>
          <div className="text-right text-sm mt-1">— {quote.a}</div>
        </div>
      )}
      <div className="mt-1 text-right mr-5">
        <button
          onClick={load}
          disabled={loading || isCoolingDown}
          className="px-2 py-1 text-xs rounded-lg bg-white  border-green text-green shadow disabled:opacity-50"
        >
          <RefreshCcw className="inline-block mr-1 mb-0.5" />
          New Quote
        </button>
      </div>
    </div>
  )
}
