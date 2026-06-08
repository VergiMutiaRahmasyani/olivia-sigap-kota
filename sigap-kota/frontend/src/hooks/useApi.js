import { useState, useEffect, useCallback } from 'react'
import { dashboard, reports, categories } from '../services/api'

export function useFetch(fetcher, deps = []) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const run = useCallback(() => {
    setLoading(true)
    setError(null)
    fetcher()
      .then(setData)
      .catch(err => setError(err.message ?? 'Terjadi kesalahan'))
      .finally(() => setLoading(false))
  }, deps)

  useEffect(() => { run() }, [run])

  return { data, loading, error, refetch: run }
}

// ── Dashboard stats ───────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useFetch(() => dashboard.stats(), [])
}

// ── Report list (with filters) ────────────────────────────────────────────────
export function useReports(params = {}) {
  const key = JSON.stringify(params)
  return useFetch(() => reports.index(params), [key])
}

// ── Single report ─────────────────────────────────────────────────────────────
export function useReport(id) {
  return useFetch(() => reports.show(id), [id])
}

// ── Categories ────────────────────────────────────────────────────────────────
export function useCategories() {
  return useFetch(() => categories.index(), [])
}